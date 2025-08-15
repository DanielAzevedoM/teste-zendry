import { reactive, ref, computed } from 'vue'; // Alterado: importado 'reactive'
import { useCardBrand } from '@/composables/useCardBrand';
import { useInstallments } from '@/composables/useInstallments';
import { onlyDigits, luhnValid } from '@/utils/cardBrand';

export function usePayment(amountToFinance) {
  // --- Estado dos Formulários ---
  // ALTERADO: Usando reactive em vez de ref para objetos
  const card = reactive({
    holderName: '',
    number: '',
    expiry: '',
    cvv: '',
    installments: 1
  });

  const boleto = reactive({
    email: ''
  });

  // --- Lógica de Negócio e Helpers ---
  const { getBrand, brandIcon } = useCardBrand();
  const { installmentOptions } = useInstallments(amountToFinance);

  const cardBrand = computed(() => getBrand(card.number));
  const cardBrandIcon = computed(() => brandIcon(cardBrand.value));

  // --- Regras de Validação (sem alteração) ---
  const rules = {
    required: v => !!(v || '').toString().trim() || 'Campo obrigatório',
    cardHolder: v => (v || '').trim().includes(' ') || 'Digite o nome completo',
    cardNumber: v => luhnValid(onlyDigits(v)) || 'Número de cartão inválido',
    cardNumberLength: v => {
      const brand = getBrand(v);
      const digits = onlyDigits(v);
      if (brand === 'amex') {
        return digits.length === 15 || 'Cartões Amex devem ter 15 dígitos';
      }
      if (brand) {
        return digits.length === 16 || 'Este cartão deve ter 16 dígitos';
      }
      return true;
    },
    expiryDate: v => {
      if (!/^\d{2}\s*\/\s*\d{2}$/.test(v)) return 'Data inválida (MM/AA)';
      const [m, y] = v.split('/').map(n => parseInt(n, 10));
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (m < 1 || m > 12) return 'Mês inválido';
      if (y < currentYear || (y === currentYear && m < currentMonth)) return 'Cartão expirado';
      return true;
    },
    cvv: v => (onlyDigits(v).length >= 3 && onlyDigits(v).length <= 4) || 'CVV deve ter 3 ou 4 dígitos',
    email: v => /^\S+@\S+\.\S+$/.test(String(v)) || 'E-mail inválido',
  };

  // --- Exporta tudo que o componente precisa ---
  return {
    card,
    boleto,
    rules,
    installmentOptions,
    cardBrand,
    cardBrandIcon
  };
}