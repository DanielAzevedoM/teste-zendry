import { promises as fs } from 'fs';
import path from 'path';
import { getRequestIP, getRequestURL } from 'h3';
import { sendEmail } from '@/server/utils/sendEmail.js';

export default defineEventHandler(async (event) => {
 const newOrder = await readBody(event);
 const dbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');

 const ipAddress = getRequestIP(event, { xForwardedFor: true });
 if (!newOrder.paymentDetails) {
  newOrder.paymentDetails = {};
 }
 newOrder.paymentDetails.ipAddress = ipAddress;

 try {
  let orders = [];
  try {
   const fileContent = await fs.readFile(dbPath, 'utf-8');
   orders = JSON.parse(fileContent);
  } catch (error) {
   if (error.code !== 'ENOENT') throw error;
  }

  orders.push(newOrder);
  await fs.writeFile(dbPath, JSON.stringify(orders, null, 2));

  if (newOrder.customerIdentifier) {
   const customersDbPath = path.join(process.cwd(), 'server', 'db', 'customers.json');
   const configsDbPath = path.join(process.cwd(), 'server', 'db', 'checkout-configs.json');

   try {
    const customersFile = await fs.readFile(customersDbPath, 'utf-8');
    const customers = JSON.parse(customersFile);

    const configsFile = await fs.readFile(configsDbPath, 'utf-8');
    const configs = JSON.parse(configsFile);

    const config = configs.find(c => c.id === newOrder.configId);

    const existingCustomer = customers.find(c => c.email === newOrder.customerIdentifier || c.cpf === newOrder.customerIdentifier);

    let customerInfoForEmail;

    if (existingCustomer) {
     customerInfoForEmail = existingCustomer;
    } else {
     customerInfoForEmail = {
      email: newOrder.customerIdentifier,
      name: 'Cliente'
     };
    }
    
    const requestUrl = getRequestURL(event);
    const checkoutLink = new URL(`/checkout/${newOrder.id}`, requestUrl.origin).href;
    
    let emailSubject = "Finalize sua compra agora!";
    let emailBodyParagraph;

    if (config?.paymentSettings?.checkoutExpiration?.enabled) {
      const duration = config.paymentSettings.checkoutExpiration.durationMinutes;
      emailBodyParagraph = `
        <p>Notamos que você iniciou um checkout para o pedido <strong>${newOrder.id}</strong>.</p>
        <p>Ele ficará reservado para você por <strong>${duration} minutos</strong>.</p>
        <p>Não perca tempo! Clique no botão abaixo para finalizar sua compra:</p>
      `;
    } else {
      emailBodyParagraph = `
        <p>Vimos que você iniciou uma compra para o pedido <strong>${newOrder.id}</strong>.</p>
        <p>Seu pedido está aguardando o pagamento. Clique no botão abaixo para continuar de onde parou e finalizar sua compra:</p>
      `;
    }

    await sendEmail({
     to: customerInfoForEmail.email,
     subject: emailSubject,
     html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
       <h3>Olá ${customerInfoForEmail.name.split(' ')[0]},</h3>
       ${emailBodyParagraph}
       <a href="${checkoutLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #3FC583; text-decoration: none; border-radius: 5px; margin: 10px 0;">
        Finalizar Compra Agora
       </a>
       <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
       <p><a href="${checkoutLink}">${checkoutLink}</a></p>
       <br>
       <p><em>Equipe do Seu E-commerce</em></p>
      </div>
     `
    });

   } catch (e) {
    console.error("Falha ao tentar enviar email:", e);
   }
  }

  return {
   statusCode: 201,
   body: newOrder
  };
 } catch (error) {
  console.error('Erro ao criar pedido:', error);
  return createError({
   statusCode: 500,
   statusMessage: 'Erro interno do servidor ao salvar o pedido',
  });
 }
});