// composables/useCheckout.js
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { buscarCep } from '~/services/cepService'
import { userMe } from '~/services/userService'

// novo serviço único para o passo 4
import { fetchPayment, createPayment } from '@/services/paymentApi'

export function useCheckout () {
  const { $ws } = useNuxtApp()

  // ====== WIZARD (mantido) ===================================================
  const currentStep = ref(0)
  const step1Valid = ref(false)
  const step2Valid = ref(false)

  const isCurrentStepValid = computed(() =>
    currentStep.value === 0 ? step1Valid.value : step2Valid.value
  )

  const steps = [
    { title: 'Detalhes da conta', subtitle: 'Conta' },
    { title: 'Meio de pagamento', subtitle: 'Pagamento' },
    { title: 'Confirmação do pagamento', subtitle: 'Confirmação' },
  ]

  function next () { if (currentStep.value < 2) currentStep.value++ }
  function prev () { if (currentStep.value > 0) currentStep.value-- }
  function setStep (n) {
    if (Number.isInteger(n) && n >= 0 && n <= 2) currentStep.value = n
  }

  // ====== FORM (mantido) =====================================================
  const userData = userMe() || {}
  const formData = reactive({
    name: userData.name || '',
    email: userData.email || '',
    cpf: userData.cpf || '',
    phone: userData.phone || '',
    address: {
      city: userData.address?.city || '',
      state: userData.address?.state || '',
      country: userData.address?.country || '',
      zip: userData.address?.zip || '',
      neighborhood: userData.address?.neighborhood || '',
      complement: userData.address?.complement || '',
      street: userData.address?.street || '',
    },
    checkbox: !!userData.checkbox,
  })

  // Auto-preenche endereço pelo CEP
  watch(() => formData.address.zip, async (novoCep) => {
    const cep = (novoCep || '').replace(/\D/g, '')
    if (cep.length === 8) {
      try {
        const dados = await buscarCep(cep)
        if (dados) {
          formData.address.street = dados.street || ''
          formData.address.neighborhood = dados.neighborhood || ''
          formData.address.city = dados.city || ''
          formData.address.state = dados.state || ''
        }
      } catch {
        // silencioso
      }
    }
  })

  // ====== ORQUESTRAÇÃO DO PAGAMENTO (novo) ===================================
  // Estado principal vindo do back (id, amount, discount, total, etc.)
  const payment = ref(null)

  // método escolhido na UI ('card' | 'pix' | 'boleto')
  const method = ref(null)

  // status do fluxo
  const status = ref('idle') // idle | processing | approved | failed | expired | canceled
  const processing = ref(false)

  // dados extras enviados/recebidos do back para a tela
  // ex: { qrcode, expiresAt, boletoUrl, authorizationId, ... }
  const serverData = reactive({})

  // Busca pagamento no back (DESCONTO vem do back)
  async function loadPayment (id) {
    if (!id) {
      payment.value = null
      return null
    }
    try {
      // fetchPayment deve devolver o objeto pronto p/ UI (com discount calculado no back)
      const data = await fetchPayment(id)
      payment.value = data || null
      return payment.value
    } catch (e) {
      payment.value = null
      return null
    }
  }

  // Mapeia o método da UI para o slug do back
  const mapMethod = (m) => {
    if (m === 'card') return 'credit_card'
    if (m === 'pix') return 'pix'
    if (m === 'boleto') return 'boleto'
    return m
  }

  /**
   * Inicia o pagamento no back.
   * @param {string} id        - paymentId
   * @param {'card'|'pix'|'boleto'} mthdUI - método da UI
   * @param {object} payload   - dados do comprador + método (ex.: token do cartão, etc.)
   */
  async function start (id, mthdUI, payload = {}) {
    if (!id) return
    method.value = mthdUI
    processing.value = true
    status.value = 'processing'

    try {
      // cria/inicia no back — back retorna dados para renderização:
      //   - credit_card: { authorizationId, ... }
      //   - pix: { qrcode, expiresAt, ... }
      //   - boleto: { boletoUrl, linhaDigitavel, expiresAt, ... }
      const res = await createPayment({
        id,
        method: mapMethod(mthdUI),
        payload,
      })

      // mantém o serverData sempre sincronizado
      Object.keys(serverData).forEach(k => delete serverData[k])
      Object.assign(serverData, res || {})
    } catch (e) {
      status.value = 'failed'
      processing.value = false
    }
  }

  // Handler de eventos do “websocket” fake/real
  // Esperado msg: { id, status, ...extras }
  function onStatus (msg) {
    // garante que é do mesmo pagamento
    if (!payment.value || msg?.id !== payment.value.id) return

    status.value = msg.status || status.value

    // atualiza quaisquer dados adicionais que venham do back (qr atualizado, auth id, etc.)
    if (msg && typeof msg === 'object') {
      Object.assign(serverData, msg)
    }

    if (msg.status === 'approved' || msg.status === 'failed' || msg.status === 'expired' || msg.status === 'canceled') {
      processing.value = false
      // quando aprovado, o wizard pode ir para a confirmação
      if (msg.status === 'approved') setStep(2)
    }
  }

  onMounted(() => {
    // ouça os eventos de status
    // canal sugerido no passo: 'payment:status'
    $ws?.on?.('payment:status', onStatus)
  })

  onBeforeUnmount(() => {
    $ws?.off?.('payment:status', onStatus)
  })

  return {
    // wizard
    currentStep, steps, isCurrentStepValid,
    step1Valid, step2Valid,
    next, prev, setStep,

    // form
    formData,

    // pagamento
    payment, method, status, processing, serverData,
    loadPayment, start,
  }
}
