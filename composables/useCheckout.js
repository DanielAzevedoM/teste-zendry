// composables/useCheckout.js

import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { userMe } from '~/services/userService'
import { createPayment } from '@/services/paymentApi'
import { usePaymentStore } from '@/stores/paymentStore'
import { useGeneratorStore } from '~/stores/generatorStore';
import { getPaymentById } from '~/services/paymentService'; // LINHA ADICIONADA

export function useCheckout () {
 const { $ws } = useNuxtApp()
 const paymentStore = usePaymentStore()
 const generatorStore = useGeneratorStore();

 
 const currentStep = ref(0)
 const stepAccountValid = ref(false)
 const stepAddressValid = ref(false)
 const stepPaymentValid = ref(false)

 const steps = computed(() => {
  const baseSteps = [
    { title: 'Detalhes da conta', subtitle: 'Conta' },
    { title: 'Meio de pagamento', subtitle: 'Pagamento' },
    { title: 'Confirmação do pagamento', subtitle: 'Confirmação' },
  ];
  if (generatorStore.showAddressFields) {
    baseSteps.splice(1, 0, { title: 'Endereço', subtitle: 'Entrega' });
  }
  return baseSteps;
 });

 const isCurrentStepValid = computed(() => {
    // Etapa 0: Conta
    if (currentStep.value === 0) return stepAccountValid.value;

    if (generatorStore.showAddressFields) {
      // Com endereço: Etapa 1 é Endereço, Etapa 2 é Pagamento
      if (currentStep.value === 1) return stepAddressValid.value;
      if (currentStep.value === 2) return stepPaymentValid.value;
    } else {
      // Sem endereço: Etapa 1 é Pagamento
      if (currentStep.value === 1) return stepPaymentValid.value;
    }
    // A última etapa (confirmação) não precisa de validação de botão
    return true; 
  });


 function next () { if (currentStep.value < steps.value.length -1) currentStep.value++ }
 function prev () { if (currentStep.value > 0) currentStep.value-- }
 function setStep (n) {
 if (Number.isInteger(n) && n >= 0 && n < steps.value.length) currentStep.value = n
 }
 
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
 
 const payment = ref(null)
 const method = ref('card')
 const status = ref('idle')
 const processing = ref(false)
 const serverData = reactive({})

 async function loadPayment (id) {
    try {
        const p = await getPaymentById(id) // Agora esta função será encontrada
        payment.value = p
        paymentStore.setPayment(p)
    } catch (e) {
        console.error('Erro ao carregar pagamento:', e)
    }
 }

 const mapMethod = m => ({ card: 'credit_card' }[m] || m)

 async function start (id, mthdUI, payload = {}) {
 if (!id) return
 method.value = mthdUI
 processing.value = true
 status.value = 'processing'

 
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

 
 Object.keys(serverData).forEach(k => delete serverData[k])
 Object.assign(serverData, res || {})

 
 paymentStore.mergeServerData(res || {})

 
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
 }, 10000) 
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

 
 function onStatus (msg) {
    if (!payment.value || msg?.id !== payment.value.id) return

    status.value = msg.status || status.value
    paymentStore.setStatus(status.value)

    if (msg && typeof msg === 'object') {
        Object.assign(serverData, msg.serverData || {})
        paymentStore.mergeServerData(msg.serverData || {})
        paymentStore.setLastEvent(msg)
    }
    
    const finalStep = steps.value.length - 1;
    if (['approved', 'failed', 'expired', 'canceled'].includes(status.value)) {
        processing.value = false
        if (status.value === 'approved') setStep(finalStep)
    }
 }

 onMounted(() => {
 $ws?.on?.('payment:status', onStatus)
 })
 onBeforeUnmount(() => {
 $ws?.off?.('payment:status', onStatus)
 })

 return {
 
 currentStep, steps, isCurrentStepValid,
 stepAccountValid, stepAddressValid, stepPaymentValid, next, prev, setStep,

 
 formData,

 
 payment, method, status, processing, serverData,
 loadPayment, start,
 }
}