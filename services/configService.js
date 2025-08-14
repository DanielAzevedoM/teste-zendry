/**
 * Busca todas as configurações de checkout.
 * @returns {Promise<Array>}
 */
export async function getConfigs() {
  return await $fetch('/api/configs');
}

/**
 * Busca uma configuração de checkout específica pelo ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getConfig(id) {
  return await $fetch(`/api/configs/${id}`);
}

// Adicionar esta nova função
export async function deleteConfig(id) {
  return await $fetch(`/api/configs/${id}`, { method: 'DELETE' });
}