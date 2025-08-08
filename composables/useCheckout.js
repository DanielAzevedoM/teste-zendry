// MODIFICATION BASED ON: /home/daniel/Downloads/zendry-checkout/composables/useCheckout.js
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { buscarCep } from '~/services/cepService'
import { userMe } from '~/services/userService'
import { fetchPayment, createPayment } from '@/services/paymentApi'
import { usePaymentStore } from '@/stores/paymentStore'

export function useCheckout () {
  const { $ws } = useNuxtApp()
  const paymentStore = usePaymentStore()

  // ====== WIZARD =============================================================
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

  // ====== FORM ===============================================================
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
      } catch { /* silent */ }
    }
  })

  // ====== ORQUESTRAÇÃO DO PAGAMENTO =========================================
  const payment = ref(null)   // compat com seus componentes
  const method = ref(null)
  const status = ref('idle')
  const processing = ref(false)
  const serverData = reactive({})

  async function loadPayment (id) {
    if (!id) {
      payment.value = null
      paymentStore.clear()
      return null
    }
    try {
      const data = await fetchPayment(id)
      payment.value = data || null

      // Store: snapshot inicial
      paymentStore.setPayment(payment.value)
      paymentStore.setStatus('idle')
      paymentStore.mergeServerData({})
      return payment.value
    } catch {
      payment.value = null
      paymentStore.clear()
      return null
    }
  }

  const mapMethod = (m) => {
    if (m === 'card') return 'credit_card'
    if (m === 'pix') return 'pix'
    if (m === 'boleto') return 'boleto'
    return m
  }

  /**
   * Inicia o pagamento no back e PREENCHE A STORE.
   * Também emite via WS um evento código 200 (processing) e,
   * após um delay, um evento approved com os dados da compra.
   */
  async function start (id, mthdUI, payload = {}) {
    if (!id) return
    method.value = mthdUI
    processing.value = true
    status.value = 'processing'

    // Store: marca início
    paymentStore.setMethod(mthdUI)
    paymentStore.setStatus('processing')

    try {
      const res = await createPayment({
        id,
        method: mapMethod(mthdUI),
        payload,
        buyer: {
          id: userData?.id,
          name: formData.name,
          email: formData.email,
        },
      })

      // server data local
      Object.keys(serverData).forEach(k => delete serverData[k])
      Object.assign(serverData, res || {})

      // Store: dados complementares retornados
      paymentStore.mergeServerData(res || {})

      // === WebSocket (PROCESSING/200) ===
      const processingEvent = {
        id,
        code: 200,
        status: 'processing',
        method: mapMethod(mthdUI),
        payment: payment.value,
        serverData: { ...res },
      }
      paymentStore.setLastEvent(processingEvent)
      $ws?.emit?.('payment:status', processingEvent)

      // === Delay fake e APPROVED/200 ===
      setTimeout(() => {
        const approvedEvent = {
          id,
          code: 200,
          status: 'approved',
          method: mapMethod(mthdUI),
          payment: payment.value,
          serverData: { ...res, approvedAt: new Date().toISOString() },
        }
        paymentStore.setLastEvent(approvedEvent)
        $ws?.emit?.('payment:status', approvedEvent)
      }, 10000) // ajuste o delay que preferir
    } catch (e) {
      status.value = 'failed'
      processing.value = false
      paymentStore.setStatus('failed')

      const failedEvent = {
        id,
        code: 500,
        status: 'failed',
        error: e?.message || 'createPayment failed',
      }
      paymentStore.setLastEvent(failedEvent)
      $ws?.emit?.('payment:status', failedEvent)
    }
  }

  // === Handler do WebSocket: mantém composable E store sincronizados =========
  function onStatus (msg) {
    if (!payment.value || msg?.id !== payment.value.id) return

    status.value = msg.status || status.value
    paymentStore.setStatus(status.value)

    if (msg && typeof msg === 'object') {
      Object.assign(serverData, msg.serverData || {})
      paymentStore.mergeServerData(msg.serverData || {})
      paymentStore.setLastEvent(msg)
    }

    if (['approved', 'failed', 'expired', 'canceled'].includes(status.value)) {
      processing.value = false
      if (status.value === 'approved') setStep(2)
    }
  }

  onMounted(() => {
    $ws?.on?.('payment:status', onStatus)
  })
  onBeforeUnmount(() => {
    $ws?.off?.('payment:status', onStatus)
  })

  return {
    // wizard
    currentStep, steps, isCurrentStepValid,
    step1Valid, step2Valid, next, prev, setStep,

    // form
    formData,

    // pagamento
    payment, method, status, processing, serverData,
    loadPayment, start,
  }
}
