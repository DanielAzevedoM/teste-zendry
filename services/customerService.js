/**
 * Busca um cliente pelo email ou CPF.
 * @param {string} identifier
 * @returns {Promise<Object|null>}
 */
export async function getCustomer(identifier) {
  if (!identifier) return null;
  return await $fetch(`/api/customers?identifier=${identifier}`);
}