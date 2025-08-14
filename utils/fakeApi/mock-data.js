
export const paymentsMock = [
  {
    id: "pay_001",
    type: "",
    amount: 150.00,
    discount: 50,
    currency: "BRL",
    expiresAt: "2025-08-07T20:30:00Z",
    isCompleted: false,
    qrCode: "00020101021226850014BR.GOV.BCB.PIX2560pixcodeexemplodepagamentofintech.com/pix/1234567890",
    qrCodeImage: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226850014BR.GOV.BCB.PIX2560pixcodeexemplodepagamentofintech.com/pix/1234567890",
    customer: {
      id: ""
    }
  },
  {
    id: "pay_002",
    type: "cartao",
    amount: 89.90,
    discount: 0,
    currency: "BRL",
    expiresAt: null,
    isCompleted: true,
    customer: {
      id: ""
    },
    cardLastDigits: "1234",
    authorizationCode: "A1B2C3"
  },
  {
    id: "pay_003",
    type: "boleto",
    amount: 250.00,
    discount: 0,
    currency: "BRL",
    expiresAt: "2025-08-10T23:59:59Z",
    isCompleted: false,
    boletoUrl: "https://www.google.com",
    customer: {
      id: ""
    }
  }
]

// #### INÍCIO DA MODIFICAÇÃO ####
export const cupons = [
  {
    code: "BLACKFRIDAY",
    type: "percent", // Adicionado
    value: 20,      // Renomeado de 'discount' para 'value'
    expiresAt: "2025-11-30T23:59:59Z"
  },
  {
    code: "NATAL2025",
    type: "percent", // Adicionado
    value: 15,      // Renomeado de 'discount' para 'value'
    expiresAt: "2025-12-25T23:59:59Z"
  },
  {
    code: "BEMVINDO10",
    type: "percent", // Adicionado
    value: 10,      // Renomeado de 'discount' para 'value'
    expiresAt: "2026-01-31T23:59:59Z"
  }
]
// #### FIM DA MODIFICAÇÃO ####

export function findCouponByCode(code) {
  if (!code) return null
  return cupons.find(
    c => c.code.toUpperCase() === String(code).trim().toUpperCase()
  ) || null
}

export function calcCouponValue(coupon, amount) {
  if (!coupon) return 0
  const a = Number(amount || 0)

  if (coupon.type === 'percent') {
    const raw = a * (Number(coupon.value || 0) / 100)
    const max = Number(coupon.max ?? raw)
    return Math.max(0, Math.min(raw, max))
  }

  if (coupon.type === 'fixed') {
    return Math.max(0, Number(coupon.value || 0))
  }

  return 0
}