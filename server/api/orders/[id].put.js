import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'id');
  const updatedData = await readBody(event);
  const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    let orders = JSON.parse(fileContent);

    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' });
    }

    if (orders[orderIndex].status !== 'Em aguardo') {
        return createError({ statusCode: 403, statusMessage: 'Apenas pedidos "Em aguardo" podem ser editados.' });
    }

    // Mantém os dados originais e apenas atualiza os que vieram no corpo da requisição
    orders[orderIndex] = { ...orders[orderIndex], ...updatedData };

    await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));

    return { statusCode: 200, body: orders[orderIndex] };
  } catch (error) {
    console.error('Erro ao editar pedido:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
  }
});