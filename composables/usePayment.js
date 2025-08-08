// composables/usePayment.js
import { ref, computed } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { createTransaction } from '@/services/transactionService'
import { onlyDigits, isValidCPF } from '@/utils/cardBrand'

export function usePayment () {
  // método selecionado
  const method = ref('card') // 'card' | 'pix' | 'boleto'

  // formulário cartão
  const card = ref({
    holder: '',
    number: '',
    exp: '',     // MM/AA
    cvv: '',
    brand: '',
    _valid: false,
  })

  // formulário pix
  const pix = ref({
    key: '',
    payerName: '',
    _valid: false,
  })

  // formulário boleto
  const boleto = ref({
    payerName: '',
    cpf: '',
    email: '',
    _valid: false,
  })

  // regras compartilhadas
  const rules = {
    required: label => v => (v ?? '').toString().trim() !== '' || `${label} é obrigatório`,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'E-mail inválido',
    onlyDigits: label => v => /^\d+$/.test(onlyDigits(v)) || `${label} deve conter apenas números`,
    len: (label, n) => v => onlyDigits(v).length === n || `${label} deve ter ${n} dígitos`,
    lenBetween: (label, min, max) => v => {
      const d = onlyDigits(v).length
      return (d >= min && d <= max) || `${label} deve ter entre ${min} e ${max} dígitos`
    },
    minLen: (label, n) => v => (v || '').trim().length >= n || `${label} deve ter no mínimo ${n} caracteres`,
    cpf: v => (onlyDigits(v).length === 11 && isValidCPF(v)) || 'CPF inválido',
    expDate: v => {
      // MM/AA simples
      const m = /^(\d{2})\/(\d{2})$/.exec((v || '').trim())
      if (!m) return 'Data inválida'
      const mm = +m[1], yy = +m[2]
      if (mm < 1 || mm > 12) return 'Mês inválido'
      // opcional: validar expiração no tempo real
      return true
    },
  }

  // validade global do step2
  const isValid = computed(() => {
    if (method.value === 'card')  return card.value._valid
    if (method.value === 'pix')   return pix.value._valid
    if (method.value === 'boleto')return boleto.value._valid
    return false
  })

  // pagar: cria transação e “ouve” status por websocket fake
  async function pay ({ amount, discount, orderId, buyer }) {
    if (!isValid.value) throw new Error('Formulário de pagamento inválido')

    // payload
    const payload = {
      orderId,
      method: method.value,
      amount,
      discount,
      buyer,
      details: {
        card: method.value === 'card' ? {
          holder: card.value.holder,
          number: onlyDigits(card.value.number).replace(/.(?=.{4})/g, '*'),
          brand: card.value.brand,
          exp: card.value.exp,
        } : null,
        pix: method.value === 'pix' ? { key: pix.value.key, payerName: pix.value.payerName } : null,
        boleto: method.value === 'boleto' ? {
          payerName: boleto.value.payerName,
          cpf: onlyDigits(boleto.value.cpf).replace(/.(?=.{2})/g, '*'),
          email: boleto.value.email,
        } : null,
      }
    }

    // cria transação na "API" fake
    const tx = await createTransaction(payload)

    // FAKE WS: canal por transação (substitua por WS real quando tiver)
    // Aqui só simulamos mudança de status para 'approved' em ~1.5s
    const { open, close } = useWebSocket(`wss://fake-gateway.local/tx/${tx.id}`, {
      autoReconnect: false,
      immediate: false,
      // note: é só para ilustrar interface; não conecta de verdade
      onOpen() {},
      onMessage() {},
      onClose() {},
      onError() {},
    })

    open() // abre "conexão" (mock)

    await new Promise(resolve => setTimeout(resolve, 1500))

    close() // fecha "conexão"

    // devolve “status 200”
    return { status: 200, id: tx.id }
  }

  return {
    method,
    card, pix, boleto,
    rules,
    isValid,
    pay,
  }
}
