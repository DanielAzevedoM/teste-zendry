import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Constrói o caminho para o nosso arquivo JSON de configurações
  const dbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const configs = JSON.parse(fileContent);
    
    // Retorna a lista de configurações
    return configs;
  } catch (error) {
    // Se o arquivo ainda não existir, retorna um array vazio
    if (error.code === 'ENOENT') {
      return [];
    }
    
    // Para outros erros, loga no console e retorna um erro de servidor
    console.error('Erro ao ler as configurações de checkout:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Erro Interno do Servidor ao buscar configurações',
    });
  }
});