
import { paymentsMock } from '~/utils/fakeApi/mock-data'

function reaisToCentavos(v) {
  const n = Number(v ?? 0)
  if (Number.isNaN(n)) return 0
  return Math.round(n * 100)
}

export async function getPaymentById(id) {
  await new Promise(r => setTimeout(r, 120))
  const p = paymentsMock.find(x => String(x.id) === String(id))
  if (!p) throw new Error('Pagamento não encontrado')

  return {
    id: p.id,
    type: p.type || 'pix',
    amount: p.amount,      // <- CENTAVOS
    discount: p.discount,  // <- CENTAVOS
    currency: p.currency || 'BRL',
    expiresAt: p.expiresAt ?? null,
    isCompleted: !!p.isCompleted,
    metadata: p.metadata ?? {},
  }
}

export async function concluirPagamentoAPI({ orderId, amount, discount, buyer }) {
  await new Promise(r => setTimeout(r, 120))
  // Simula uma resposta OK
  return { ok: true, orderId, amount, discount, buyer }
}
