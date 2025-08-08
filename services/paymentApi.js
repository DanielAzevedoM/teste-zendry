import { createTransaction } from '@/services/transactionService'

let _ws

export function setWs (ws) { _ws = ws }

// Busca de valores base da cobrança (mantém comportamento simulado atual)
export async function fetchPayment (id) {
  await new Promise(r => setTimeout(r, 300))

  return {
    id,
    amount: 12990,
    discount: 2990,
    total: 10000,
    currency: 'BRL',
  }
}


export async function createPayment ({ id, method, payload }) {
  // Simula latência da criação
  await new Promise(r => setTimeout(r, 400))

  // 1) Salva no "fake api" (transactions) com todos os dados que a tela pode querer exibir
  const tx = await createTransaction({
    orderId: id,
    method,
    ...payload, // esperado conter: amount, discount, buyer { name, id }, e detalhes do método
  })

  // 2) Emite "processing" imediatamente, com os dados relevantes para a UI mostrar "aguardando confirmação"
  _ws?.emit('payment:status', {
    id,                     // mantém o mesmo id do fluxo (pedido)
    status: 'processing',
    method,
    transactionId: tx.id,   // id interno do "fake api"
    createdAt: tx.createdAt,
    details: {
      orderId: tx.orderId,
      amount: tx.amount,
      discount: tx.discount,
      buyer: tx.buyer,      // { name, id }
      methodDetails: tx.details || null, // dados específicos do método (ex: cartão mascarado, pix, boleto)
    },
  })

  // 3) Emissão de "approved" após o delay do provedor (alinhado com transactionService)
  setTimeout(() => {
    _ws?.emit('payment:status', {
      id,
      status: 'approved',
      method,
      transactionId: tx.id,
      approvedAt: new Date().toISOString(),
    })
  }, 3200) // ligeiramente acima do 3000ms do transactionService para garantir ordem dos eventos

  // 4) Retorno mantido por método, inclusive dados extras para PIX (se já for usado na tela)
  if (method === 'credit_card') {
    // Para cartão, apenas confirma depois — nada especial para retornar aqui
    return { ok: true }
  }

  if (method === 'pix') {
    // Mantém a simulação atual com QR e expiração
    const expiresAt = Date.now() + 3 * 60 * 1000
    const qrBase64 = 'data:image/png;base64,iVBORw0KGgoAAA.' // QR fictício
    return { ok: true, qrBase64, expiresAt }
  }

  if (method === 'boleto') {
    // Para boleto, podemos retornar dados mínimos (linha digitável poderia estar no payload)
    return { ok: true }
  }

  // Fallback genérico
  return { ok: true }
}
