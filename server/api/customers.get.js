import { promises as fs } from 'fs';
import path from 'path';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const { identifier } = getQuery(event);
    const dbPath = path.join(process.cwd(), 'server', 'db', 'customers.json');

    if (!identifier) {
        return createError({ statusCode: 400, statusMessage: 'Identificador (email) não fornecido' });
    }

    try {
        const fileContent = await fs.readFile(dbPath, 'utf-8');
        const customers = JSON.parse(fileContent);
        
        // Alterado para buscar apenas por e-mail
        const customer = customers.find(c => c.email === identifier);
        
        return customer || null;

    } catch (error) {
        if (error.code === 'ENOENT') {
            return null; 
        }
        console.error('Erro ao ler clientes:', error);
        return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
    }
});