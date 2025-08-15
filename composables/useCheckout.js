// composables/useCheckout.js
import { reactive, computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '@/stores/paymentStore';
import { useGeneratorStore } from '~/stores/generatorStore';
import { useCheckoutSetup } from './useCheckoutSetup';
import { useCheckoutExpiration } from './useCheckoutExpiration';

export function useCheckout() {
  const { $ws } = useNuxtApp();
  const paymentStore = usePaymentStore();
  const generatorStore = useGeneratorStore();

  const purchase = ref(null);
  const { currentStep } = storeToRefs(paymentStore);
  const stepAccountValid = ref(false);
  const stepAddressValid = ref(false);
  const stepPaymentValid = ref(false);

  const formData = reactive({
    name: '', email: '', cpf: '', phone: '',
    address: { city: '', state: '', country: '', zip: '', neighborhood: '', complement: '', street: '' },
    checkbox: false,
  });

  const { setupCheckout: performSetup } = useCheckoutSetup(formData);
  const { showExpirationWarning, warningCountdownSeconds, startExpirationTimer, stopExpirationTimer } = useCheckoutExpiration();
  
  const status = ref('idle');
  const processing = ref(false);

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
    if (currentStep.value === 0) return stepAccountValid.value;
    if (generatorStore.showAddressFields) {
      if (currentStep.value === 1) return stepAddressValid.value;
      if (currentStep.value === 2) return stepPaymentValid.value;
    } else {
      if (currentStep.value === 1) return stepPaymentValid.value;
    }
    return true;
  });

  function setStep(n) {
    if (Number.isInteger(n) && n >= 0 && n < steps.value.length) {
      paymentStore.setCurrentStep(n);
    }
  }
  function next() {
    if (currentStep.value < steps.value.length - 1) {
      paymentStore.setCurrentStep(currentStep.value + 1);
    }
  }
  function prev() {
    if (currentStep.value > 0) {
      paymentStore.setCurrentStep(currentStep.value - 1);
    }
  }

  async function setup(orderId) {
      const { isReady, order, config, error } = await performSetup(orderId);
      if (isReady) {
          startExpirationTimer(order, config);
      }
      return { isReady, error };
  }

  async function processPayment(paymentPayloads) {
    const payment = paymentStore.payment;
    if (!payment?.id || !paymentPayloads || paymentPayloads.length === 0) return;

    stopExpirationTimer();
    processing.value = true;
    status.value = 'processing';
    paymentStore.setStatus('processing');
    paymentStore.setMethod(paymentPayloads.length > 1 ? 'multi' : paymentPayloads[0].method);

    try {
      const transactionResponses = [];
      for (const payload of paymentPayloads) {
        const res = await $fetch('/api/payments', {
          method: 'POST',
          body: {
            orderId: payment.id,
            amount: payload.amount,
            method: payload.method,
            details: payload.details,
            buyer: { name: formData.name, email: formData.email },
          },
        });
        transactionResponses.push({ ...payload, serverData: res });
      }

      const firstServerData = transactionResponses[0]?.serverData || {};
      paymentStore.mergeServerData(firstServerData);

      purchase.value = {
        user: { ...formData },
        payment: { ...payment, total: paymentStore.total, couponDiscount: paymentStore.coupon, ipAddress: payment.paymentDetails?.ipAddress },
        transactions: transactionResponses
      };

      next();

    } catch (e) {
      status.value = 'failed';
      paymentStore.setStatus('failed');
      console.error("Erro ao processar pagamento:", e);
      alert(e.data?.statusMessage || 'Ocorreu um erro ao processar seu pagamento.');
      processing.value = false;
    }
  }

  function onStatus(msg) {
    if (!paymentStore.payment || msg?.id !== paymentStore.payment.id) return;
    status.value = msg.status || status.value;
    paymentStore.setStatus(status.value);
    paymentStore.setLastEvent(msg);

    const finalStep = generatorStore.finalStepIndex;
    if (['approved', 'failed', 'expired', 'canceled'].includes(status.value)) {
      processing.value = false;
      if (status.value === 'approved') setStep(finalStep);
    }
  }

  onMounted(() => {
    $ws?.on?.('payment:status', onStatus);
    setStep(0);
  });

  onBeforeUnmount(() => {
    $ws?.off?.('payment:status', onStatus);
    stopExpirationTimer();
  });

  return {
    currentStep, steps, isCurrentStepValid,
    stepAccountValid, stepAddressValid, stepPaymentValid, next, prev, setStep,
    formData, purchase,
    processPayment, status, processing,
    setupCheckout: setup, showExpirationWarning, warningCountdownSeconds
  };
}