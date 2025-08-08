
let _seq = 1
export const transactions = []

export async function createTransaction (payload) {
  // Simula latência da API
  await new Promise(r => setTimeout(r, 300))

  const id = String(_seq++)
  const tx = {
    id,
    status: 'processing',
    createdAt: new Date().toISOString(),
    ...payload, // Mantém todos os dados da compra + método + usuário etc.
  }

  transactions.push(tx)

  // Delay para confirmar (simulação do provedor de pagamento)
  setTimeout(() => {
    const t = transactions.find(x => x.id === id)
    if (t) t.status = 'approved'
  }, 3000) // aumentado para dar tempo da tela exibir "aguardando confirmação"

  return tx
}

// Utilitário opcional para consultar uma transação específica (não quebra nada existente)
export function getTransactionById (id) {
  return transactions.find(t => String(t.id) === String(id)) || null
}

// Utilitário opcional para listar tudo (pode ajudar em depuração futura)
export function listTransactions () {
  return [...transactions]
}
