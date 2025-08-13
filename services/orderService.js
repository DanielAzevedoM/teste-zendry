import { v4 as uuidv4 } from 'uuid';

const OrderStatus = {
  PENDING: 'Em aguardo',
};

/**
 * Busca todos os pedidos.
 * @returns {Promise<Array>}
 */
export async function getOrders() {
  return await $fetch('/api/orders');
}

/**
 * Busca um pedido específico pelo ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getOrder(id) {
  return await $fetch(`/api/orders/${id}`);
}

/**
 * Cria um novo pedido.
 * @param {Object} orderData
 * @returns {Promise<Object>}
 */
export async function createOrder(orderData) {
  const orderToCreate = {
    id: `ord_${uuidv4()}`,
    ...orderData,
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString()
  };
  const response = await $fetch('/api/orders', { method: 'POST', body: orderToCreate });
  return response.body;
}

/**
 * Atualiza um pedido existente.
 * @param {string} id
 * @param {Object} orderData
 * @returns {Promise<Object>}
 */
export async function updateOrder(id, orderData) {
  const response = await $fetch(`/api/orders/${id}`, { method: 'PUT', body: orderData });
  return response.body;
}

/**
 * Deleta um pedido.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteOrder(id) {
  await $fetch(`/api/orders/${id}`, { method: 'DELETE' });
}

/**
 * Marca um pedido como expirado.
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
export async function expireOrder(orderId) {
  return await $fetch('/api/orders/expire', {
    method: 'POST',
    body: { orderId }
  });
}