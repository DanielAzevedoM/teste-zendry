<script setup>
import { computed, watch } from 'vue'
import { usePaymentStore } from '~/stores/paymentStore'
import { useGeneratorStore } from '~/stores/generatorStore';
import { storeToRefs } from 'pinia';

const generatorStore = useGeneratorStore();
const { showCouponField } = storeToRefs(generatorStore);

const paymentStore = usePaymentStore()


const { payment, coupon, couponCode } = storeToRefs(paymentStore)


watch(couponCode, (newCode) => {
  paymentStore.setCouponFromOrderSummary(newCode)
})


const amount = computed(() => payment.value?.amount || 0)
const discount = computed(() => payment.value?.discount || 0)
const couponDiscount = computed(() => coupon.value || 0)
const total = computed(() => paymentStore.total)

// Função adicionada para formatar a moeda no padrão brasileiro
const formatCurrency = (value) => {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

</script>

<template>
  <v-container class="px-4 py-6" style="max-width: 24rem;">
    <v-text-field v-if="showCouponField" v-model="couponCode" class="pt-5" label="Cupom" variant="outlined"
      hide-details="auto" placeholder="Digite seu cupom" />

    <v-row class="pt-5">
      <v-col>
        <p>Valor:</p>
      </v-col>
      <v-col class="text-right">
        <p>R$ {{ formatCurrency(amount) }}</p>
      </v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col>
        <p>Desconto (base):</p>
      </v-col>
      <v-col class="text-right">
        <p>R$ {{ formatCurrency(discount) }}</p>
      </v-col>
    </v-row>

    <v-row v-if="showCouponField" class="mt-0">
      <v-col>
        <p>Desconto cupom:</p>
      </v-col>
      <v-col class="text-right">
        <p>R$ {{ formatCurrency(couponDiscount) }}</p>
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col>
        <p>Valor a pagar:</p>
      </v-col>
      <v-col class="text-right">
        <h2>R$ {{ formatCurrency(total) }}</h2>
      </v-col>
    </v-row>
  </v-container>
</template>