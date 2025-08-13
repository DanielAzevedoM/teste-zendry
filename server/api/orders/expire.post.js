import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    const { orderId } = await readBody(event);

    if (!orderId) {
        return createError({ statusCode: 400, statusMessage: 'ID do pedido não fornecido.' });
    }

    const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        let orders = JSON.parse(fileContent);

        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
            return { success: false, message: 'Pedido não encontrado.' };
        }
        
        if (orders[orderIndex].status === 'Em aguardo') {
            orders[orderIndex].status = 'EXPIRADO';
            await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));
            return { success: true, message: `Pedido ${orderId} expirado.` };
        }
        
        return { success: false, message: `Pedido já está com status '${orders[orderIndex].status}'.` };

    } catch (error) {
        console.error('Erro ao expirar pedido:', error);
        return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
    }
});