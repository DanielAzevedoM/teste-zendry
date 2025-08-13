import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
 const orderId = getRouterParam(event, 'id');
 const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

 try {
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  let orders = JSON.parse(fileContent);

  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
   return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' });
  }
  
  // RESTRIÇÃO REMOVIDA: Agora, qualquer pedido encontrado pode ser excluído.

  orders.splice(orderIndex, 1);

  await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));

  return { statusCode: 204 }; 
 } catch (error) {
  console.error('Erro ao excluir pedido:', error);
  return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
 }
});