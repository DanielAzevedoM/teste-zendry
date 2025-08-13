/**
 * Confirma um pagamento e emite um evento websocket.
 * @param {string} orderId O ID do pedido a ser confirmado.
 * @param {object} wsEmitter A instância do emissor WebSocket de nuxtApp.$ws.
 */
export async function confirmPayment(orderId, wsEmitter) {
  if (!orderId) throw new Error('O ID do pedido é obrigatório');

  // 1. Chama a API para confirmar o pagamento no backend
  await $fetch('/api/confirm-payment', {
    method: 'POST',
    body: { orderId }
  });

  // 2. Emite um evento websocket para notificar os clientes
  if (wsEmitter && typeof wsEmitter.emit === 'function') {
    console.log(`Emitindo evento de aprovação para o pedido: ${orderId}`);
    const approvedEvent = {
      id: orderId,
      code: 200,
      status: 'approved',
      serverData: { approvedAt: new Date().toISOString() },
    };
    wsEmitter.emit('payment:status', approvedEvent);
  } else {
    console.warn('Emissor WebSocket não está disponível. Notificação do cliente ignorada.');
  }
}