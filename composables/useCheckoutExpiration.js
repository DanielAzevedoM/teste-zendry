// composables/useCheckoutExpiration.js
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { expireOrder } from '~/services/orderService';

export function useCheckoutExpiration() {
  const router = useRouter();
  const showExpirationWarning = ref(false);
  const warningCountdownSeconds = ref(0);
  let expirationInterval = null;

  const handleExpiration = async (orderId, redirect = true) => {
    stopExpirationTimer();
    try {
      await expireOrder(orderId);
      if (redirect) {
        alert("Seu tempo para concluir a compra expirou. Redirecionando...");
        router.push('/orders');
      }
    } catch (error) {
      console.error("Erro ao expirar o pedido:", error);
    }
  };

  const startExpirationTimer = (order, config) => {
    if (!config?.paymentSettings?.checkoutExpiration?.enabled) {
      return;
    }

    const createdAt = new Date(order.createdAt).getTime();
    const durationMs = config.paymentSettings.checkoutExpiration.durationMinutes * 60 * 1000;
    const expirationTime = createdAt + durationMs;

    if (Date.now() >= expirationTime) {
      handleExpiration(order.id);
      return;
    }

    let remainingSeconds = Math.floor((expirationTime - Date.now()) / 1000);
    const warningSecondsThreshold = config.paymentSettings.checkoutExpiration.warningMinutes * 60;
    let hasShownWarning = false;

    expirationInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds > 0 && remainingSeconds <= warningSecondsThreshold && !hasShownWarning) {
        warningCountdownSeconds.value = remainingSeconds;
        showExpirationWarning.value = true;
        hasShownWarning = true;
      }
      if (remainingSeconds <= 0) {
        handleExpiration(order.id);
      }
    }, 1000);
  };

  const stopExpirationTimer = () => {
    if (expirationInterval) {
      clearInterval(expirationInterval);
      expirationInterval = null;
    }
  };

  return {
    showExpirationWarning,
    warningCountdownSeconds,
    startExpirationTimer,
    stopExpirationTimer,
  };
}