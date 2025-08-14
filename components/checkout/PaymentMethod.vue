<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useCardBrand } from '@/composables/useCardBrand';
import { useInstallments } from '@/composables/useInstallments';
import { onlyDigits, luhnValid } from '@/utils/cardBrand';
import { useGeneratorStore } from '~/stores/generatorStore';
import { usePaymentStore } from '~/stores/paymentStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
  couponCode: { type: String, default: '' },
});
const emit = defineEmits(['valid']);
const generatorStore = useGeneratorStore();
const paymentStore = usePaymentStore();
const { paymentSettings } = storeToRefs(generatorStore);
const { total: orderTotal, payment } = storeToRefs(paymentStore);
const singleMethod = ref('card');
const useMultiPayment = ref(false);
const multiPaymentSelection = ref([]);
const cardAmount = ref(0);
const pixAmount = ref(0);
const boletoAmount = ref(0);
const formCardRef = ref(null);
const isCardFormValid = ref(false);
const card = ref({ holderName: '', number: '', expiry: '', cvv: '' });
const installments = ref(1);
const boleto = ref({ email: '' });
const { getBrand, brandIcon } = useCardBrand();
const amountForInstallments = computed(() => useMultiPayment.value ? Number(cardAmount.value) : orderTotal.value);
const { installmentOptions } = useInstallments(amountForInstallments);
const cardBrand = computed(() => getBrand(card.value.number));
const cardBrandIcon = computed(() => brandIcon(cardBrand.value));
const ipAddress = computed(() => payment.value?.paymentDetails?.ipAddress);
const allAvailableMethods = computed(() => [
  { key: 'card', title: 'Cartão', enabled: paymentSettings.value.allowedMethods.card },
  { key: 'pix', title: 'PIX', enabled: paymentSettings.value.allowedMethods.pix },
  { key: 'boleto', title: 'Boleto', enabled: paymentSettings.value.allowedMethods.boleto },
].filter(m => m.enabled));
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
  // --- CORREÇÃO AQUI ---
  email: v => /^\S+@\S+\.\S+$/.test(String(v)) || 'E-mail inválido',
  minValue: (min, message) => v => Number(v) >= min || message,
  selectTwo: () => multiPaymentSelection.value.length === 2 || 'Selecione duas formas de pagamento',
  amountsSum: () => {
    if (!useMultiPayment.value) return true;
    const sum = (multiPaymentSelection.value.includes('card') ? Number(cardAmount.value) : 0) +
      (multiPaymentSelection.value.includes('pix') ? Number(pixAmount.value) : 0) +
      (multiPaymentSelection.value.includes('boleto') ? Number(boletoAmount.value) : 0);
    return Math.abs(sum - orderTotal.value) < 0.01 || `A soma (R$ ${sum.toFixed(2)}) deve ser igual ao total (R$ ${orderTotal.value.toFixed(2)})`;
  },
};

const showSelectionError = computed(() => {
  return useMultiPayment.value && multiPaymentSelection.value.length === 1;
});

const isValid = computed(() => {
  if (useMultiPayment.value) {
    if (multiPaymentSelection.value.length !== 2) return false;
    if (rules.amountsSum() !== true) return false;

    let valid = true;
    if (multiPaymentSelection.value.includes('card')) {
      if (!isCardFormValid.value || Number(cardAmount.value) < paymentSettings.value.multiPaymentsMinCardValue) {
        valid = false;
      }
    }
    if (multiPaymentSelection.value.includes('boleto')) {
      if (!boleto.value.email || rules.email(boleto.value.email) !== true) {
        valid = false;
      }
    }
    return valid;
  }
  const method = allAvailableMethods.value.find(m => m.key === singleMethod.value);
  if (!method) return false;
  if (method.key === 'card') return isCardFormValid.value;
  if (method.key === 'pix') return true;
  if (method.key === 'boleto') return !!boleto.value.email && rules.email(boleto.value.email) === true;
  return false;
});
watch(isValid, (v) => emit('valid', v));
watch(useMultiPayment, (isMulti) => {
  multiPaymentSelection.value = [];
  cardAmount.value = 0;
  pixAmount.value = 0;
  boletoAmount.value = 0;
  if (!isMulti && allAvailableMethods.value.length > 0) {
    singleMethod.value = allAvailableMethods.value[0].key;
  }
});
watch(multiPaymentSelection, (newSelection) => {
  if (newSelection.length > 2) {
    multiPaymentSelection.value.shift();
  }
});
function getPayload() {
  if (useMultiPayment.value) {
    const payments = [];
    if (multiPaymentSelection.value.includes('card') && cardAmount.value > 0) {
      payments.push({ method: 'card', amount: Number(cardAmount.value), details: { ...card.value, installments: installments.value } });
    }
    if (multiPaymentSelection.value.includes('pix') && pixAmount.value > 0) {
      payments.push({ method: 'pix', amount: Number(pixAmount.value), details: {} });
    }
    if (multiPaymentSelection.value.includes('boleto') && boletoAmount.value > 0) {
      payments.push({ method: 'boleto', amount: Number(boletoAmount.value), details: { ...boleto.value } });
    }
    return payments;
  }
  const payload = { amount: orderTotal.value, details: {} };
  if (singleMethod.value === 'card') payload.details = { ...card.value, installments: installments.value };
  if (singleMethod.value === 'boleto') payload.details = { ...boleto.value };

  return [{ method: singleMethod.value, ...payload }];
}
async function concluirPagamento() {
  if ((useMultiPayment.value && multiPaymentSelection.value.includes('card')) || (!useMultiPayment.value && singleMethod.value === 'card')) {
    const { valid } = await formCardRef.value.validate();
    return valid && isValid.value;
  }
  return isValid.value;
}
onMounted(() => {
  if (allAvailableMethods.value.length > 0) {
    singleMethod.value = allAvailableMethods.value[0].key;
  }
})
watch([cardAmount, pixAmount, boletoAmount], () => {
  if (useMultiPayment.value) {
    nextTick(() => {
      formCardRef.value?.validate();
    });
  }
});
defineExpose({ concluirPagamento, isValid, getPayload });
</script>

<template>
  <div>
    <h3 class="text-h6 mb-4">Escolha o método de pagamento</h3>

    <div v-if="!useMultiPayment" class="mb-6">
      <div class="d-flex flex-column align-center" style="gap: 16px;">
        <v-btn-toggle v-model="singleMethod" mandatory>
          <v-btn v-for="method in allAvailableMethods" :key="method.key" :value="method.key">
            {{ method.title }}
          </v-btn>
        </v-btn-toggle>

        <VDivider class="w-100 my-1">
          <span class="px-2 text-caption">OU</span>
        </VDivider>

        <div class="d-flex justify-center flex-wrap" style="gap: 16px;">
          <VBtn disabled variant="outlined" prepend-icon="mdi-apple">
            Apple Pay
          </VBtn>
          <VBtn disabled variant="outlined" prepend-icon="mdi-google-pay">
            Google Pay
          </VBtn>
        </div>
      </div>
    </div>

    <VSheet v-if="paymentSettings.allowMultiPayments" border rounded class="pa-4 mb-6">
      <VSwitch v-model="useMultiPayment" label="Pagar com mais de uma forma" color="success" />
    </VSheet>

    <VForm ref="formCardRef" v-model="isCardFormValid" validate-on="blur">
      <div v-if="useMultiPayment">
        <p class="text-subtitle-1 mb-2">Selecione duas formas de pagamento*:</p>
        <div class="d-flex ga-4 mb-2">
          <VCheckbox v-for="method in allAvailableMethods" :key="method.key" v-model="multiPaymentSelection"
            :label="method.title" :value="method.key" hide-details="auto" />
        </div>

        <VExpandTransition>
          <VAlert v-if="showSelectionError" density="compact" type="error" variant="tonal" class="mb-4">
            Selecione mais uma forma de pagamento.
          </VAlert>
        </VExpandTransition>

        <div v-if="multiPaymentSelection.length > 0">
          <div v-if="multiPaymentSelection.includes('card')" class="mb-4">
            <h4 class="text-subtitle-1 mb-4">Pagamento com Cartão de Crédito</h4>
            <VTextField v-model.number="cardAmount" label="Valor a pagar no Cartão*" type="number" prefix="R$"
              variant="outlined" class="mb-4"
              :rules="[rules.required, rules.minValue(paymentSettings.multiPaymentsMinCardValue, `Valor mínimo no cartão é R$ ${paymentSettings.multiPaymentsMinCardValue.toFixed(2)}`), rules.amountsSum]" />
            <v-text-field v-model="card.holderName" label="Nome no cartão*" :rules="[rules.required, rules.cardHolder]"
              variant="outlined" class="mb-3" />
            <v-text-field v-model="card.number" label="Número do cartão*"
              :rules="[rules.required, rules.cardNumber, rules.cardNumberLength]" v-mask="'card'" variant="outlined"
              class="mb-3">
              <template #prepend-inner>
                <img :key="cardBrandIcon" :src="cardBrandIcon" alt="Bandeira do cartão"
                  style="height: 24px; margin-right: 8px;" />
              </template>
            </v-text-field>
            <div class="d-flex" style="gap:12px">
              <v-text-field v-model="card.expiry" label="Validade (MM/AA)*" v-mask="'expiry'"
                :rules="[rules.required, rules.expiryDate]" variant="outlined" />
              <v-text-field v-model="card.cvv" label="CVV*" :rules="[rules.required, rules.cvv]" maxlength="4"
                variant="outlined" />
            </div>
            <VSelect v-if="installmentOptions.length > 0 && cardAmount > 0" v-model="installments" label="Parcelamento"
              :items="installmentOptions" item-title="text" item-value="value" variant="outlined" class="mt-3" />
          </div>

          <div v-if="multiPaymentSelection.includes('pix')" class="mb-4">
            <h4 class="text-subtitle-1 mb-4">Pagamento com PIX</h4>
            <VTextField v-model.number="pixAmount" label="Valor a pagar no PIX*" type="number" prefix="R$"
              variant="outlined" :rules="[rules.required, rules.amountsSum]" />
          </div>

          <div v-if="multiPaymentSelection.includes('boleto')" class="mb-4">
            <h4 class="text-subtitle-1 mb-4">Pagamento com Boleto</h4>
            <VTextField v-model.number="boletoAmount" label="Valor a pagar no Boleto*" type="number" prefix="R$"
              variant="outlined" class="mb-4" :rules="[rules.required, rules.amountsSum]" />
            <v-text-field v-model="boleto.email" label="E-mail para envio do boleto*"
              :rules="[rules.required, rules.email]" variant="outlined" />
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="singleMethod === 'card'">
          <v-text-field v-model="card.holderName" label="Nome no cartão*" :rules="[rules.required, rules.cardHolder]"
            variant="outlined" class="mb-3" />
          <v-text-field v-model="card.number" label="Número do cartão*"
            :rules="[rules.required, rules.cardNumber, rules.cardNumberLength]" v-mask="'card'" variant="outlined"
            class="mb-3">
            <template #prepend-inner>
              <img :key="cardBrandIcon" :src="cardBrandIcon" alt="Bandeira do cartão"
                style="height: 24px; margin-right: 8px;" />
            </template>
          </v-text-field>
          <div class="d-flex" style="gap:12px">
            <v-text-field v-model="card.expiry" label="Validade (MM/AA)*" v-mask="'expiry'"
              :rules="[rules.required, rules.expiryDate]" variant="outlined" />
            <v-text-field v-model="card.cvv" label="CVV*" :rules="[rules.required, rules.cvv]" maxlength="4"
              variant="outlined" />
          </div>
          <VSelect v-if="installmentOptions.length > 0" v-model="installments" label="Parcelamento"
            :items="installmentOptions" item-title="text" item-value="value" variant="outlined" class="mt-3" />
        </div>
        <div v-else-if="singleMethod === 'pix'">
          <v-alert variant="tonal">Pagamento instantâneo. Após confirmar, mostraremos o QR Code e aguardaremos a
            confirmação
            automática.</v-alert>
        </div>
        <div v-else-if="singleMethod === 'boleto'">
          <v-text-field v-model="boleto.email" label="E-mail para envio do boleto*"
            :rules="[rules.required, rules.email]" variant="outlined" class="mb-3" />
          <v-alert variant="tonal">O boleto será gerado e você poderá abrir/baixar antes da compensação.</v-alert>
        </div>
      </div>
    </VForm>

    <div v-if="paymentSettings.captureIp && ipAddress" class="text-caption text-disabled text-center mt-6">
      <VIcon icon="mdi-lock-outline" size="x-small" class="mr-1" />
      <span>Conexão segura. IP: {{ ipAddress }}</span>
    </div>
  </div>
</template>