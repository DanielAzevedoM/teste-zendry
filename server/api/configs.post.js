import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const dbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');

  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    const configs = JSON.parse(fileContent);

    const newConfig = {
      id: uuidv4(), // Gera um ID único
      ...body
    };

    configs.push(newConfig);

    await fs.writeFile(dbPath, JSON.stringify(configs, null, 2));

    return {
      statusCode: 201,
      body: { message: 'Configuração salva com sucesso!', config: newConfig }
    };
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor',
    });
  }
});