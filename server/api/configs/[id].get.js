import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const configId = getRouterParam(event, 'id');
  const dbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const configs = JSON.parse(fileContent);

    // Compara os valores como strings para evitar problemas de tipo (ex: 1 vs "1")
    const config = configs.find(c => String(c.id) === String(configId));

    if (!config) {
      return createError({ statusCode: 404, statusMessage: `Configuração de Checkout com ID '${configId}' não encontrada.` });
    }

    return config;
  } catch (error) {
    if (error.code === 'ENOENT') {
       return createError({ statusCode: 404, statusMessage: 'Arquivo de configurações não encontrado.' });
    }
    console.error('Erro ao ler configuração:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
  }
});