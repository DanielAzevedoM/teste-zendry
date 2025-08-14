import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const configId = getRouterParam(event, 'id');
  const dbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    let configs = JSON.parse(fileContent);

    const configIndex = configs.findIndex(c => c.id === configId);

    if (configIndex === -1) {
      return createError({ statusCode: 404, statusMessage: 'Configuração não encontrada' });
    }

    // Remove a configuração do array
    configs.splice(configIndex, 1);

    // Salva o array atualizado no arquivo
    await fs.writeFile(dbPath, JSON.stringify(configs, null, 2));

    // Retorna uma resposta de sucesso sem conteúdo
    return { statusCode: 204 };
  } catch (error) {
    console.error('Erro ao excluir configuração:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
  }
});