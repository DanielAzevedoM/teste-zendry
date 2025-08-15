<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useGeneratorStore } from '~/stores/generatorStore';
import { usePaymentStore } from '~/stores/paymentStore';
import { storeToRefs } from 'pinia';
import { usePayment } from '@/composables/usePayment';
import CardPaymentForm from './CardPaymentForm.vue';
import BoletoPaymentForm from './BoletoPaymentForm.vue';
import PixPaymentInfo from './PixPaymentInfo.vue';

const emit = defineEmits(['valid']);
const generatorStore = useGeneratorStore();
const paymentStore = usePaymentStore();
const { paymentSettings } = storeToRefs(generatorStore);
const { total: orderTotal, payment } = storeToRefs(paymentStore);

// Refs para os componentes filhos
const cardFormRef = ref(null);
const boletoFormRef = ref(null);

// Estado do componente
const singleMethod = ref('card');
const useMultiPayment = ref(false);
const multiPaymentSelection = ref([]);
const cardAmount = ref(0);
const pixAmount = ref(0);
const boletoAmount = ref(0);

// Estado dos formulários filhos
const isCardValid = ref(false);
const isBoletoValid = ref(false);

const amountForInstallments = computed(() => useMultiPayment.value ? Number(cardAmount.value) : orderTotal.value);
const {
  card,
  boleto,
  rules
} = usePayment(amountForInstallments);

const ipAddress = computed(() => payment.value?.paymentDetails?.ipAddress);

const allAvailableMethods = computed(() => [
  { key: 'card', title: 'Cartão', enabled: paymentSettings.value.allowedMethods.card },
  { key: 'pix', title: 'PIX', enabled: paymentSettings.value.allowedMethods.pix },
  { key: 'boleto', title: 'Boleto', enabled: paymentSettings.value.allowedMethods.boleto },
].filter(m => m.enabled));

const amountsSumValid = computed(() => {
    if (!useMultiPayment.value) return true;
    const sum = (multiPaymentSelection.value.includes('card') ? Number(cardAmount.value) : 0) +
                (multiPaymentSelection.value.includes('pix') ? Number(pixAmount.value) : 0) +
                (multiPaymentSelection.value.includes('boleto') ? Number(boletoAmount.value) : 0);
    return Math.abs(sum - orderTotal.value) < 0.01;
});

const isValid = computed(() => {
  if (useMultiPayment.value) {
    if (multiPaymentSelection.value.length !== 2) return false;
    if (!amountsSumValid.value) return false;
    
    let valid = true;
    if (multiPaymentSelection.value.includes('card') && !isCardValid.value) valid = false;
    if (multiPaymentSelection.value.includes('boleto') && !isBoletoValid.value) valid = false;
    if (multiPaymentSelection.value.includes('card') && Number(cardAmount.value) < paymentSettings.value.multiPaymentsMinCardValue) valid = false;
    
    return valid;
  }
  
  if (singleMethod.value === 'card') return isCardValid.value;
  if (singleMethod.value === 'pix') return true;
  if (singleMethod.value === 'boleto') return isBoletoValid.value;
  return false;
});

watch(isValid, (v) => emit('valid', v));

watch(useMultiPayment, () => {
  multiPaymentSelection.value = [];
  cardAmount.value = 0;
  pixAmount.value = 0;
  boletoAmount.value = 0;
  if (allAvailableMethods.value.length > 0) {
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
    if (multiPaymentSelection.value.includes('card') && cardAmount.value > 0) payments.push({ method: 'card', amount: Number(cardAmount.value), details: card });
    if (multiPaymentSelection.value.includes('pix') && pixAmount.value > 0) payments.push({ method: 'pix', amount: Number(pixAmount.value), details: {} });
    if (multiPaymentSelection.value.includes('boleto') && boletoAmount.value > 0) payments.push({ method: 'boleto', amount: Number(boletoAmount.value), details: boleto });
    return payments;
  }

  const payload = { amount: orderTotal.value, details: {} };
  if (singleMethod.value === 'card') payload.details = card;
  if (singleMethod.value === 'boleto') payload.details = boleto;
  return [{ method: singleMethod.value, ...payload }];
}

async function concluirPagamento() {
  let childValid = true;
  if ((useMultiPayment.value && multiPaymentSelection.value.includes('card')) || (!useMultiPayment.value && singleMethod.value === 'card')) {
    const { valid } = await cardFormRef.value.validate();
    childValid = valid;
  }
  return childValid && isValid.value;
}

onMounted(() => {
  if (allAvailableMethods.value.length > 0) {
    singleMethod.value = allAvailableMethods.value[0].key;
  }
});

defineExpose({ concluirPagamento, isValid, getPayload });
</script>

<template>
  <div>
    <h3 class="text-h6 mb-4">Escolha o método de pagamento</h3>
    
    <div v-if="!useMultiPayment" class="mb-6">
      <div class="d-flex flex-column align-center" style="gap: 16px;">
        <v-btn-toggle v-model="singleMethod" mandatory class="d-flex w-100">
          <v-btn v-for="method in allAvailableMethods" :key="method.key" :value="method.key" class="flex-grow-1">
            {{ method.title }}
          </v-btn>
        </v-btn-toggle>

        <VDivider class="w-100">
          <span class="px-2 text-caption">OU</span>
        </VDivider>
        <div class="d-flex justify-center flex-wrap" style="gap: 16px;">
          <VBtn disabled variant="outlined" prepend-icon="mdi-apple">
            Apple Pay
          </VBtn>
          <VBtn disabled variant="outlined">
            <template #prepend>
              <img src="/card-brands/google.svg" alt="Google Pay" style="height: 20px;" class="mr-2" />
            </template>
            Google Pay
          </VBtn>
        </div>
        </div>
    </div>

    <VSheet v-if="paymentSettings.allowMultiPayments" border rounded class="pa-4 mb-6">
      <VSwitch v-model="useMultiPayment" label="Pagar com mais de uma forma" color="success" />
    </VSheet>

    <div v-if="useMultiPayment">
      <p class="text-subtitle-1 mb-2">Selecione duas formas de pagamento*:</p>
      <div class="d-flex ga-4 mb-2">
        <VCheckbox v-for="method in allAvailableMethods" :key="method.key" v-model="multiPaymentSelection" :label="method.title" :value="method.key" hide-details="auto" />
      </div>
       <VAlert v-if="!amountsSumValid && multiPaymentSelection.length === 2" density="compact" type="error" variant="tonal" class="mb-4">
        A soma dos valores deve ser igual ao total do pedido.
      </VAlert>

      <div v-if="multiPaymentSelection.includes('card')" class="mb-4">
          <h4 class="text-subtitle-1 my-4">Pagamento com Cartão de Crédito</h4>
          <VTextField v-model.number="cardAmount" label="Valor a pagar no Cartão*" type="number" prefix="R$" variant="outlined" class="mb-4" :rules="[v => !!v || 'Obrigatório', v => v >= paymentSettings.multiPaymentsMinCardValue || `Mínimo de R$ ${paymentSettings.multiPaymentsMinCardValue.toFixed(2)}`]" />
          <CardPaymentForm v-model="card" :amount="cardAmount" @valid="isCardValid = $event" ref="cardFormRef"/>
      </div>

       <div v-if="multiPaymentSelection.includes('boleto')" class="mb-4">
          <h4 class="text-subtitle-1 my-4">Pagamento com Boleto</h4>
          <VTextField v-model.number="boletoAmount" label="Valor a pagar no Boleto*" type="number" prefix="R$" variant="outlined" class="mb-4" :rules="[v => !!v || 'Obrigatório']" />
          <BoletoPaymentForm v-model="boleto" @valid="isBoletoValid = $event" ref="boletoFormRef" />
      </div>

       <div v-if="multiPaymentSelection.includes('pix')" class="mb-4">
          <h4 class="text-subtitle-1 my-4">Pagamento com PIX</h4>
          <VTextField v-model.number="pixAmount" label="Valor a pagar no PIX*" type="number" prefix="R$" variant="outlined" :rules="[v => !!v || 'Obrigatório']" />
          <PixPaymentInfo/>
      </div>

    </div>
    <div v-else>
      <CardPaymentForm v-if="singleMethod === 'card'" v-model="card" :amount="orderTotal" @valid="isCardValid = $event" ref="cardFormRef" />
      <BoletoPaymentForm v-if="singleMethod === 'boleto'" v-model="boleto" @valid="isBoletoValid = $event" ref="boletoFormRef" />
      <PixPaymentInfo v-if="singleMethod === 'pix'" />
    </div>
    
    <div v-if="paymentSettings.captureIp && ipAddress" class="text-caption text-disabled text-center mt-6">
      <VIcon icon="mdi-lock-outline" size="x-small" class="mr-1" />
      <span>Conexão segura. IP: {{ ipAddress }}</span>
    </div>
  </div>
</template>