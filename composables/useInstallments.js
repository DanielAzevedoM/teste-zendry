import { computed } from 'vue';
import { usePaymentStore } from '~/stores/paymentStore';
import { useGeneratorStore } from '~/stores/generatorStore';

// A função agora aceita um 'amountToFinance' reativo como argumento
export function useInstallments(amountToFinance) {
  const paymentStore = usePaymentStore();
  const generatorStore = useGeneratorStore();

  // O 'total' agora é baseado no valor passado ou no total do pedido como fallback
  const total = computed(() => amountToFinance?.value || paymentStore.total);
  const settings = computed(() => generatorStore.paymentSettings);

  const installmentOptions = computed(() => {
    const options = [];
    const rates = settings.value.interestRates;
    const minParcelValue = settings.value.installmentsMinParcelValue;
    const brlFormatter = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (!total.value || total.value <= 0) {
      return [];
    }
    
    // Parcela única (sem juros)
    if (total.value >= minParcelValue) {
        options.push({
            text: `1x de ${brlFormatter(total.value)} (sem juros)`,
            value: 1,
        });
    }

    // Parcelas com juros (de 2 a 12)
    for (let i = 2; i <= 12; i++) {
      const rate = rates[i];
      if (typeof rate === 'number' && rate > 0) {
        const totalWithInterest = total.value * (1 + rate / 100);
        const parcelValue = totalWithInterest / i;

        if (parcelValue >= minParcelValue) {
          options.push({
            text: `${i}x de ${brlFormatter(parcelValue)} (com juros)`,
            value: i,
          });
        }
      }
    }
    
    return options;
  });

  return {
    installmentOptions,
  };
}