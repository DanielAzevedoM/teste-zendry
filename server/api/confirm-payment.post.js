import { promises as fs } from 'fs';
import path from 'path';
import { sendEmail } from '@/server/utils/sendEmail.js';

export default defineEventHandler(async (event) => {
 const { orderId } = await readBody(event);

 if (!orderId) {
  return createError({ statusCode: 400, statusMessage: 'ID do pedido não fornecido.' });
 }

 const ordersDbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');
 const customersDbPath = path.join(process.cwd(), 'server', 'db', 'customers.json');
 const paymentsDbPath = path.join(process.cwd(), 'server', 'db', 'payments.json');

 try {
  const ordersFileContent = await fs.readFile(ordersDbPath, 'utf-8');
  let orders = JSON.parse(ordersFileContent);

  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
   return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado.' });
  }

  const order = orders[orderIndex];

  if (order.status === 'PAGO') {
    return { success: true, message: `Pedido ${orderId} já estava PAGO.` };
  }

  orders[orderIndex].status = 'PAGO';

  if (order.customerIdentifier) {
    try {
      const customersFileContent = await fs.readFile(customersDbPath, 'utf-8');
      const customers = JSON.parse(customersFileContent);
      const customer = customers.find(c => c.email === order.customerIdentifier || c.cpf === order.customerIdentifier);
      
      const paymentsFileContent = await fs.readFile(paymentsDbPath, 'utf-8');
      const allPayments = JSON.parse(paymentsFileContent);

      const orderPayments = allPayments.filter(p => p.orderId === orderId);
      const totalPaid = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);

      const totalBeforeCoupon = (order.amount || 0) - (order.discount || 0);
      const couponDiscount = Math.max(0, totalBeforeCoupon - totalPaid);

      const customerName = customer ? customer.name.split(' ')[0] : 'Cliente';
      const formatBRL = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      await sendEmail({
        to: order.customerIdentifier,
        subject: `✅ Seu pedido ${orderId} foi confirmado!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Pagamento Aprovado!</h2>
            <h3>Olá ${customerName},</h3>
            <p>Uma ótima notícia! Confirmamos o pagamento do seu pedido <strong>${orderId}</strong>.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <h4>Resumo da Compra:</h4>
            <p style="margin: 5px 0;"><strong>Valor:</strong> ${formatBRL(order.amount)}</p>
            ${order.discount ? `<p style="margin: 5px 0;"><strong>Desconto:</strong> - ${formatBRL(order.discount)}</p>` : ''}
            ${couponDiscount > 0 ? `<p style="margin: 5px 0;"><strong>Desconto (Cupom):</strong> - ${formatBRL(couponDiscount)}</p>` : ''}
            <p style="margin: 5px 0; font-size: 1.1em;"><strong>Total Pago:</strong> <strong>${formatBRL(totalPaid)}</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p>Agradecemos pela sua preferência!</p>
            <p><em>Equipe do Seu E-commerce</em></p>
          </div>
        `
      });

    } catch (emailError) {
      console.error(`[ERRO] O pagamento do pedido ${orderId} foi confirmado, mas falhou ao enviar o e-mail de confirmação.`, emailError);
    }
  }

  await fs.writeFile(ordersDbPath, JSON.stringify(orders, null, 2));

  return { success: true, message: `Pedido ${orderId} atualizado para PAGO e e-mail de confirmação enviado.` };
 
 } catch (error) {
  console.error('Erro ao confirmar pagamento:', error);
  return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor' });
 }
});