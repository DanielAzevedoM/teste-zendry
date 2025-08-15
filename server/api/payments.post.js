import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/server/utils/sendEmail.js';

export default defineEventHandler(async (event) => {
  const paymentData = await readBody(event);
  const { orderId, method, amount, details, buyer } = paymentData;

  if (!orderId || !method || !amount) {
    return createError({ statusCode: 400, statusMessage: 'Dados de pagamento incompletos.' });
  }

  const ordersDbPath = path.join(process.cwd(), 'server', 'db', 'orders.json');
  const paymentsDbPath = path.join(process.cwd(), 'server', 'db', 'payments.json');

  try {
    const ordersFileContent = await fs.readFile(ordersDbPath, 'utf-8');
    let orders = JSON.parse(ordersFileContent);

    let payments = [];
    try {
      const paymentsFileContent = await fs.readFile(paymentsDbPath, 'utf-8');
      payments = JSON.parse(paymentsFileContent);
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }

    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return createError({ statusCode: 404, statusMessage: 'Pedido não encontrado.' });
    }

    const order = orders[orderIndex];
    if (order.status !== 'Em aguardo') {
      return createError({ statusCode: 403, statusMessage: `Este pedido já está com status '${order.status}'.` });
    }

    if (buyer && buyer.email) {
      orders[orderIndex].customerIdentifier = buyer.email;
      if (buyer.name) {
        orders[orderIndex].customerName = buyer.name;
      }
      await fs.writeFile(ordersDbPath, JSON.stringify(orders, null, 2));
    }

    const newPayment = {
      id: `txn_${uuidv4()}`,
      orderId,
      amount,
      method,
      status: 'PENDENTE',
      createdAt: new Date().toISOString(),
      details
    };
    payments.push(newPayment);
    await fs.writeFile(paymentsDbPath, JSON.stringify(payments, null, 2));

    if (method === 'pix') {
      const qrCodeData = "00020101021226850014BR.GOV.BCB.PIX2560simulacao.com/pix/multi";
      const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCodeData)}`;
      return {
        ok: true,
        qrCode: qrCodeData,
        qrCodeImage: qrCodeImageUrl,
        expiresAt: Date.now() + 5 * 60 * 1000
      };
    }

    if (method === 'boleto') {
      const boletoData = {
        boletoUrl: "https://www.example.com/boleto/gerado", // URL Fictícia
        linhaDigitavel: "34191.79001 01043.510047 91020.101014 1 93250000150000" // Linha Fictícia
      };
      
      // LÓGICA DE ENVIO DE E-MAIL DO BOLETO CORRIGIDA E MAIS ROBUSTA
      const recipientEmail = details?.email || buyer?.email;

      if (recipientEmail) {
        console.log(`[EMAIL BOLETO] Preparando para enviar boleto para: ${recipientEmail}`);
        try {
            const customerName = buyer.name ? buyer.name.split(' ')[0] : 'Cliente';
            await sendEmail({
                to: recipientEmail,
                subject: `Seu boleto para o pedido #${orderId} foi gerado`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h3>Olá ${customerName},</h3>
                        <p>Seu boleto para o pedido <strong>${orderId}</strong> no valor de <strong>${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> foi gerado com sucesso!</p>
                        <p>Para pagar, você pode usar a linha digitável abaixo ou clicar no botão para visualizar e imprimir o boleto.</p>
                        <hr style="margin: 20px 0;">
                        <p style="font-family: monospace; font-size: 14px; background: #f4f4f4; padding: 10px; border-radius: 4px; text-align: center;">${boletoData.linhaDigitavel}</p>
                        <div style="text-align: center; margin: 20px 0;">
                          <a href="${boletoData.boletoUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #3FC583; text-decoration: none; border-radius: 5px;">
                              Visualizar e Imprimir Boleto
                          </a>
                        </div>
                        <p>Lembre-se que a confirmação do pagamento pode levar até 2 dias úteis.</p>
                        <br>
                        <p><em>Equipe Zendry</em></p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error(`[ERRO] Falha ao enviar o e-mail do boleto para o pedido ${orderId}. E-mail: ${recipientEmail}`, emailError);
        }
      } else {
        console.warn(`[AVISO] O e-mail do boleto para o pedido ${orderId} não foi enviado porque nenhum e-mail de destinatário foi encontrado.`);
      }

      return { ok: true, ...boletoData };
    }

    return { ok: true, transactionId: newPayment.id };

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor ao processar pagamento' });
  }
});