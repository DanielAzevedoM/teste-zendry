<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPaymentById } from '~/services/paymentService'
import { useCoupon } from '@/composables/useCoupon'


const route = useRoute()

const amount = ref(0)    
const discount = ref(0)  

const { couponCode, discountValue } = useCoupon(0) 

const p = await getPaymentById(route.params.id)
amount.value = p.amount

const couponDiscount = computed(() =>
  amount.value * (Number(discountValue.value || 0) / 100)
)

const total = computed(() =>
  amount.value - discount.value - couponDiscount.value
)
</script>

<template>
  <v-container class="px-4 py-6" style="max-width: 24rem;">
    <v-text-field
      v-model="couponCode"
      class="pt-5"
      label="Cupom"
      variant="outlined"
      hide-details="auto"
      placeholder="Digite seu cupom"
    />

    <v-row class="pt-5">
      <v-col><p>Valor:</p></v-col>
      <v-col class="text-right"><p>R$ {{ amount }}</p></v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col><p>Desconto (base):</p></v-col>
      <v-col class="text-right"><p>R$ {{ discount }}</p></v-col>
    </v-row>

    <v-row class="mt-0">
      <v-col><p>Desconto cupom ({{ discountValue }}%)</p></v-col>
      <v-col class="text-right"><p>R$ {{ couponDiscount }}</p></v-col>
    </v-row>

    <v-divider class="my-4" />

    <v-row>
      <v-col><p>Valor a pagar:</p></v-col>
      <v-col class="text-right"><h2>R$ {{ total }}</h2></v-col>
    </v-row>
  </v-container>
</template>
