<script setup>
import { computed, watch } from 'vue'
import { usePaymentStore } from '~/stores/paymentStore'
import { useGeneratorStore } from '~/stores/generatorStore';
import { storeToRefs } from 'pinia';

const generatorStore = useGeneratorStore();
const { showCouponField } = storeToRefs(generatorStore);

const paymentStore = usePaymentStore()

// Usar storeToRefs para manter a reatividade do estado da store
const { payment, coupon, couponCode } = storeToRefs(paymentStore)

// Observar o código do cupom no v-model e chamar a action da store para recalcular
watch(couponCode, (newCode) => {
  paymentStore.setCouponFromOrderSummary(newCode)
})

// Obter todos os valores diretamente da store e seus getters para exibição
const amount = computed(() => payment.value?.amount || 0)
const discount = computed(() => payment.value?.discount || 0)
const couponDiscount = computed(() => coupon.value || 0)
const total = computed(() => paymentStore.total) // Usando o getter para o total final

</script>

<template>
 <v-container class="px-4 py-6" style="max-width: 24rem;">
  <v-text-field
    v-if="showCouponField"
    v-model="couponCode"
    class="pt-5"
    label="Cupom"
    variant="outlined"
    hide-details="auto"
    placeholder="Digite seu cupom"
  />

  <v-row class="pt-5">
    <v-col><p>Valor:</p></v-col>
    <v-col class="text-right"><p>R$ {{ amount.toFixed(2) }}</p></v-col>
  </v-row>

  <v-row class="mt-0">
    <v-col><p>Desconto (base):</p></v-col>
    <v-col class="text-right"><p>R$ {{ discount.toFixed(2) }}</p></v-col>
  </v-row>

  <v-row class="mt-0">
    <v-col><p>Desconto cupom:</p></v-col>
    <v-col class="text-right"><p>R$ {{ couponDiscount.toFixed(2) }}</p></v-col>
  </v-row>

  <v-divider class="my-4" />

  <v-row>
    <v-col><p>Valor a pagar:</p></v-col>
    <v-col class="text-right"><h2>R$ {{ total.toFixed(2) }}</h2></v-col>
  </v-row>
 </v-container>
</template>