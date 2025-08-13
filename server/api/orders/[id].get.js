import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'id');
  const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const orders = JSON.parse(fileContent);

    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' });
    }

    return order;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' });
    }
    console.error('Erro ao ler pedido:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
  }
});