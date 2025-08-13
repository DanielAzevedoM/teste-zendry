import { promises as fs } from 'fs';
import path from 'path';
import { sendEmail } from '~/server/utils/sendEmail.js';

export async function checkAndExpireOrders() {
    console.log('[CRON] Verificando pedidos expirados...');

    const ordersDbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');
    const configsDbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');
    const customersDbPath = path.join(process.cwd(), 'server', 'db', 'customers.json');

    try {
        const ordersFile = await fs.readFile(ordersDbPath, 'utf-8');
        let orders = JSON.parse(ordersFile);

        const configsFile = await fs.readFile(configsDbPath, 'utf-8');
        const configs = JSON.parse(configsFile);
        
        const customersFile = await fs.readFile(customersDbPath, 'utf-8');
        const customers = JSON.parse(customersFile);

        let changesMade = false;

        const pendingOrders = orders.filter(o => o.status === 'Em aguardo');

        for (const order of pendingOrders) {
            const config = configs.find(c => c.id === order.configId);

            if (config?.paymentSettings?.checkoutExpiration?.enabled) {
                const createdAt = new Date(order.createdAt).getTime();
                const durationMs = config.paymentSettings.checkoutExpiration.durationMinutes * 60 * 1000;
                const expirationTime = createdAt + durationMs;

                if (Date.now() > expirationTime) {
                    console.log(`[CRON] Pedido ${order.id} expirado. Alterando status.`);
                    order.status = 'EXPIRADO';
                    changesMade = true;
                    
                    let customerInfoForEmail;
                    const existingCustomer = customers.find(c => c.email === order.customerIdentifier || c.cpf === order.customerIdentifier);

                    if (existingCustomer) {
                        customerInfoForEmail = existingCustomer;
                    } else {
                        customerInfoForEmail = {
                            email: order.customerIdentifier,
                            name: 'Cliente'
                        };
                    }
                    
                    if (customerInfoForEmail && customerInfoForEmail.email) {
                        console.log(`[CRON] Enviando e-mail de expiração para ${customerInfoForEmail.email}`);
                        await sendEmail({
                            to: customerInfoForEmail.email,
                            subject: "Sua oportunidade expirou, mas ainda há tempo!",
                            html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                                <h3>Olá ${customerInfoForEmail.name.split(' ')[0]},</h3>
                                <p>Vimos que o tempo para finalizar seu pedido <strong>${order.id}</strong> acabou.</p>
                                <p>Não se preocupe! Se você ainda tiver interesse, pode iniciar uma nova compra a qualquer momento.</p>
                                <p>Estamos aqui se precisar de ajuda!</p>
                                <br>
                                <p><em>Equipe do Seu E-commerce</em></p>
                            </div>
                            `
                        });
                    }
                }
            }
        }

        if (changesMade) {
            await fs.writeFile(ordersDbPath, JSON.stringify(orders, null, 2));
            console.log('[CRON] Arquivo de pedidos atualizado com as expirações.');
        } else {
            console.log('[CRON] Nenhum pedido expirado encontrado.');
        }

    } catch (error) {
        console.error('[CRON] Erro ao verificar expiração de pedidos:', error);
    }
}