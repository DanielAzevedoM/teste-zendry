// services/paymentApi.js
let _ws // será injetado via plugin pra simular websocket

export function setWs(ws) { _ws = ws } // chamada no plugin

// Busca dados do pagamento já com desconto calculado no “servidor”
export async function fetchPayment(id) {
  // simula back: valor e desconto calculado lá
  await new Promise(r => setTimeout(r, 300))
  // devolve amount bruto, discount e total
  return {
    id,
    amount: 12990,
    discount: 2990,
    total: 10000,
    currency: 'BRL',
  }
}

// Inicia o pagamento no “servidor”
export async function createPayment({ id, method, payload }) {
  await new Promise(r => setTimeout(r, 400))
  // avisa pelo “websocket” que está processando
  _ws?.emit('payment:status', { id, status: 'processing', method })

  // Simulação por método:
  if (method === 'credit_card') {
    // depois de um delay, confirmar
    setTimeout(() => {
      _ws?.emit('payment:status', {
        id, status: 'approved', method,
        authCode: String(Math.floor(Math.random()*900000)+100000),
      })
    }, 2500)
    return { ok: true }
  }

  if (method === 'pix') {
    // gera um QR base64 (mock) + expiração 3 min
    const expiresAt = Date.now() + 3*60*1000
    const qrBase64 = 'data:image/png;base64,iVBORw0KGgoAAA...' // mock
    // simula confirmação por “websocket” em ~5s
    setTimeout(() => {
      _ws?.emit('payment:status', { id, status: 'approved', method, paidAt: Date.now() })
    }, 5000)
    return { ok: true, qrBase64, expiresAt }
  }

  if (method === 'boleto') {
    const expiresAt = Date.now() + 3*60*1000
    const boletoPdf = 'data:application/pdf;base64,JVBERi0xLjQK...' // mock
    const linhaDigitavel = '34191.79001 01043.510047 91020.150008 1 23450000010000'
    setTimeout(() => {
      _ws?.emit('payment:status', { id, status: 'approved', method, paidAt: Date.now() })
    }, 7000)
    return { ok: true, boletoPdf, linhaDigitavel, expiresAt }
  }

  return { ok: false }
}
