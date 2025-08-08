// services/transactionService.js
// Simula POST /transactions e guarda em memória

let _seq = 1
export const transactions = []

export async function createTransaction (payload) {
  // simula latência
  await new Promise(r => setTimeout(r, 300))
  const id = String(_seq++)
  const tx = {
    id,
    status: 'processing',
    createdAt: new Date().toISOString(),
    ...payload,
  }
  transactions.push(tx)

  // simula aprovação depois
  setTimeout(() => {
    const t = transactions.find(x => x.id === id)
    if (t) t.status = 'approved'
  }, 1200)

  return tx
}
