import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
      return {
        ok: true,
        boletoUrl: "https://www.google.com",
        linhaDigitavel: "34191.79001 01043.510047 91020.101014 1 93250000150000"
      };
    }

    return { ok: true, transactionId: newPayment.id };

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return createError({ statusCode: 500, statusMessage: 'Erro Interno do Servidor ao processar pagamento' });
  }
});