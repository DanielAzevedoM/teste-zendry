import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Constrói o caminho para o nosso arquivo JSON de pedidos
  const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const orders = JSON.parse(fileContent);
    
    // Retorna a lista de pedidos
    return orders;
  } catch (error) {
    // Se o arquivo ainda não existir, o que é normal, retorna um array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    
    // Para outros erros, loga no console e retorna um erro de servidor
    console.error('Erro ao ler os pedidos:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Erro Interno do Servidor ao buscar os pedidos',
    });
  }
});