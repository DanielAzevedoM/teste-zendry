import { reactive, computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePaymentStore } from '@/stores/paymentStore';
import { useGeneratorStore } from '~/stores/generatorStore';
import { getOrder, expireOrder } from '~/services/orderService';
import { getConfig } from '~/services/configService';
import { getCustomer } from '~/services/customerService';

export function useCheckout() {
  const { $ws } = useNuxtApp();
  const route = useRoute();
  const router = useRouter();
  const paymentStore = usePaymentStore();
  const generatorStore = useGeneratorStore();

  const purchase = ref(null);
  const { currentStep } = storeToRefs(paymentStore);
  const { paymentSettings } = storeToRefs(generatorStore);

  const stepAccountValid = ref(false);
  const stepAddressValid = ref(false);
  const stepPaymentValid = ref(false);

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

  const formData = reactive({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: { city: '', state: '', country: '', zip: '', neighborhood: '', complement: '', street: '' },
    checkbox: false,
  });

  const payment = ref(null);
  const method = ref('card');
  const status = ref('idle');
  const processing = ref(false);
  const serverData = reactive({});

  const showExpirationWarning = ref(false);
  const warningCountdownSeconds = ref(0);
  let expirationInterval = null;
  const isPurchaseCompleted = ref(false);

  async function handleExpiration(redirect = true) {
    isPurchaseCompleted.value = true;
    clearInterval(expirationInterval);
    expirationInterval = null;
    try {
      await expireOrder(route.params.id);
      if (redirect) {
        alert("Seu tempo para concluir a compra expirou. Redirecionando...");
        router.push('/orders');
      }
    } catch (error) {
      console.error("Erro ao expirar o pedido:", error);
    }
  }
  
  async function setupCheckout(orderId) {
    if (!orderId) throw new Error("ID do pedido não fornecido.");

    const order = await getOrder(orderId);
    if (!order) throw new Error('Pedido não encontrado.');

    if (order.status === 'PAGO') {
      alert("Este pedido já foi pago. Redirecionando...");
      router.push('/orders');
      return { isReady: false };
    }

    if (order.status === 'EXPIRADO') {
      alert("Este pedido já está expirado. Redirecionando...");
      router.push('/orders');
      return { isReady: false };
    }

    const config = await getConfig(order.configId);
    generatorStore.setConfig(config);

    if (paymentSettings.value.checkoutExpiration.enabled) {
      const createdAt = new Date(order.createdAt).getTime();
      const durationMs = paymentSettings.value.checkoutExpiration.durationMinutes * 60 * 1000;
      const expirationTime = createdAt + durationMs;

      if (Date.now() >= expirationTime) {
        await handleExpiration();
        return { isReady: false, error: 'Este pedido expirou.' };
      }

      let remainingSeconds = Math.floor((expirationTime - Date.now()) / 1000);
      const warningSecondsThreshold = paymentSettings.value.checkoutExpiration.warningMinutes * 60;
      
      let hasShownWarning = false;
      expirationInterval = setInterval(() => {
        if (isPurchaseCompleted.value) {
          clearInterval(expirationInterval);
          return;
        }
        remainingSeconds--;
        if (remainingSeconds > 0 && remainingSeconds <= warningSecondsThreshold && !hasShownWarning) {
          warningCountdownSeconds.value = remainingSeconds;
          showExpirationWarning.value = true;
          hasShownWarning = true;
        }
        if (remainingSeconds <= 0) {
          handleExpiration();
        }
      }, 1000);
    }

    const paymentData = { id: order.id, amount: order.amount, discount: order.discount, paymentDetails: order.paymentDetails, customerIdentifier: order.customerIdentifier };
    payment.value = paymentData;
    paymentStore.setPayment(paymentData);

    const customer = await getCustomer(order.customerIdentifier);
    if (customer) {
      formData.name = customer.name || '';
      formData.email = customer.email || '';
      formData.cpf = customer.cpf || '';
      formData.phone = customer.phone || '';
      if (customer.address) {
        formData.address = { ...formData.address, ...customer.address };
      }
    } else if (order.customerIdentifier) {
      formData.email = order.customerIdentifier;
    }
    
    return { isReady: true };
  }

  async function processPayment(paymentPayloads) {
    if (!payment.value?.id || !paymentPayloads || paymentPayloads.length === 0) return;

    isPurchaseCompleted.value = true;
    clearInterval(expirationInterval);
    expirationInterval = null;

    processing.value = true;
    status.value = 'processing';
    paymentStore.setStatus('processing');

    method.value = paymentPayloads.length > 1 ? 'multi' : paymentPayloads[0].method;
    paymentStore.setMethod(method.value);

    try {
      const transactionResponses = [];
      for (const payload of paymentPayloads) {
        const res = await $fetch('/api/payments', {
          method: 'POST',
          body: {
            orderId: payment.value.id,
            amount: payload.amount,
            method: payload.method,
            details: payload.details,
            buyer: { name: formData.name, email: formData.email },
          },
        });
        transactionResponses.push({ ...payload, serverData: res });
      }

      const firstServerData = transactionResponses[0]?.serverData || {};
      Object.keys(serverData).forEach(k => delete serverData[k]);
      Object.assign(serverData, firstServerData);
      paymentStore.mergeServerData(firstServerData);

      purchase.value = {
        user: { ...formData },
        payment: { ...payment.value, total: paymentStore.total, couponDiscount: paymentStore.coupon, ipAddress: payment.value.paymentDetails?.ipAddress },
        transactions: transactionResponses
      };

      next();

    } catch (e) {
      status.value = 'failed';
      paymentStore.setStatus('failed');
      console.error("Erro ao processar pagamento:", e);
      alert(e.data?.statusMessage || 'Ocorreu um erro ao processar seu pagamento.');
      processing.value = false;
      isPurchaseCompleted.value = false; // Permite tentar novamente
    }
  }

  function onStatus(msg) {
    if (!payment.value || msg?.id !== payment.value.id) return;
    status.value = msg.status || status.value;
    paymentStore.setStatus(status.value);
    paymentStore.setLastEvent(msg);

    if (purchase.value) {
      purchase.value = { ...purchase.value };
    }

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
    clearInterval(expirationInterval);
  });

  return {
    currentStep, steps, isCurrentStepValid,
    stepAccountValid, stepAddressValid, stepPaymentValid, next, prev, setStep,
    formData,
    payment, method, status, processing, serverData,
    setupCheckout, processPayment,
    purchase,
    showExpirationWarning, warningCountdownSeconds, isPurchaseCompleted
  };
}