<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useCardBrand } from '@/composables/useCardBrand';
import { useInstallments } from '@/composables/useInstallments';
import { onlyDigits, luhnValid } from '@/utils/cardBrand';

const props = defineProps({
  modelValue: { type: Object, required: true },
  amount: { type: Number, required: true },
});
const emit = defineEmits(['update:modelValue', 'valid']);

const formCardRef = ref(null);
const isCardFormValid = ref(false);
const card = ref({ ...props.modelValue });

const { getBrand, brandIcon } = useCardBrand();
const amountForInstallments = computed(() => props.amount);
const { installmentOptions } = useInstallments(amountForInstallments);

const cardBrand = computed(() => getBrand(card.value.number));
const cardBrandIcon = computed(() => brandIcon(cardBrand.value));

const rules = {
  required: v => !!(v || '').toString().trim() || 'Campo obrigatório',
  cardHolder: v => (v || '').trim().includes(' ') || 'Digite o nome completo',
  cardNumber: v => luhnValid(onlyDigits(v)) || 'Número de cartão inválido',
  cardNumberLength: v => {
    const brand = getBrand(v);
    const digits = onlyDigits(v);
    if (brand === 'amex') return digits.length === 15 || 'Amex deve ter 15 dígitos';
    if (brand) return digits.length === 16 || 'Este cartão deve ter 16 dígitos';
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
};

watch(card, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

watch(isCardFormValid, (v) => emit('valid', !!v));

onMounted(() => {
  if (!card.value.installments) {
      card.value.installments = 1;
  }
});

defineExpose({ validate: () => formCardRef.value.validate() });
</script>

<template>
  <VForm ref="formCardRef" v-model="isCardFormValid" validate-on="input">
    <v-text-field v-model="card.holderName" label="Nome no cartão*" :rules="[rules.required, rules.cardHolder]" variant="outlined" class="mb-3" />
    <v-text-field v-model="card.number" label="Número do cartão*" :rules="[rules.required, rules.cardNumber, rules.cardNumberLength]" v-mask="'card'" variant="outlined" class="mb-3">
      <template #prepend-inner>
        <img :key="cardBrandIcon" :src="cardBrandIcon" alt="Bandeira do cartão" style="height: 24px; margin-right: 8px;" />
      </template>
    </v-text-field>
    <div class="d-flex" style="gap:12px">
      <v-text-field v-model="card.expiry" label="Validade (MM/AA)*" v-mask="'expiry'" :rules="[rules.required, rules.expiryDate]" variant="outlined" />
      <v-text-field 
        v-model="card.cvv" 
        label="CVV*" 
        :rules="[rules.required, rules.cvv]" 
        maxlength="4" 
        variant="outlined" 
        type="password"
        inputmode="numeric"
      />
    </div>
    <VSelect v-if="installmentOptions.length > 0 && amount > 0" v-model="card.installments" label="Parcelamento" :items="installmentOptions" item-title="text" item-value="value" variant="outlined" class="mt-3" />
  </VForm>
</template>