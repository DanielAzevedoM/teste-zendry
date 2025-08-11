<script setup>
import AccountForm from '@/components/checkout/AccountForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PaymentMethod from '@/components/checkout/PaymentMethod.vue'
import PaymentConfirmation from '@/components/checkout/PaymentConfirmation.vue'
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useCheckout } from '@/composables/useCheckout'
import { useCoupon } from '@/composables/useCoupon'
import { useGeneratorStore } from '~/stores/generatorStore';

definePageMeta({ 
 middleware: 'check-payment-exists',
 layout: false,
});

const route = useRoute()
const router = useRouter()
const generatorStore = useGeneratorStore();

generatorStore.setConfig(route.query);

onMounted(() => {
  if (typeof window !== 'undefined') {
    const storedLogo = sessionStorage.getItem('checkoutLogoUrl');
    if (storedLogo) {
      generatorStore.header.logoUrl = storedLogo;
    }
  }
});

const {
 currentStep, steps,
 step1Valid, step2Valid,
 formData, payment,
 next, prev, loadPayment,
 start, method, status, processing, serverData, setStep, 
} = useCheckout()

await loadPayment(route.params.id)

const { couponCode } = useCoupon()
const paymentRef = ref(null)
const purchase = ref(null)
const layoutName = computed(() => generatorStore.activeLayoutComponent);

async function concluirPagamento () {
 if (!step2Valid.value) return;
 let childOk = true;
 try {
   if (paymentRef.value?.concluirPagamento) {
     childOk = await paymentRef.value.concluirPagamento();
   }
   if (!childOk) return;
   const payload = paymentRef.value.getPayload();
   await start(payment.value.id, payload.method, payload);
   purchase.value = {
     user: {
        name: formData.name,
        cpf: formData.cpf,
        email: formData.email,
     },
     payment: {
       id: payment.value.id,
       method: payload.method,
       amount: payment.value.amount,
       discount: 0, 
       total: payment.value.amount, 
     },
   };
   next();
 } catch (e) {
   console.error('Erro ao concluir pagamento:', e);
 }
}

</script>

<template>
 <NuxtLayout :name="layoutName">
 <template #summary>
 <OrderSummary />
 </template>
 
 <VRow justify="center">
 <VCol cols="12" md="11">
 
 <VWindow v-model="currentStep" class="disable-tab-transition">
 <VWindowItem>
 <AccountForm 
 v-model:form-data="formData" 
 @valid-step1="step1Valid = $event" 
 @valid-step2="step2Valid = $event" 
 />
 </VWindowItem>

 <VWindowItem>
 <PaymentMethod 
 ref="paymentRef" 
 :coupon-code="couponCode" 
 @valid="step2Valid = $event" 
 />
 </VWindowItem>

 <VWindowItem>
 <PaymentConfirmation 
 v-if="purchase || status !== 'idle'"
 :purchase="purchase" 
 :status="status"
 />
 </VWindowItem>
 </VWindow>

 <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
 <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="prev">
  Anterior
 </VBtn>
 <VBtn v-if="currentStep < 1" :disabled="!step1Valid" @click="next" class="btn-navigation" variant="elevated">
  Próximo
 </VBtn>
 <VBtn v-if="currentStep === 1" color="success" :loading="processing" :disabled="!step2Valid || processing" @click="concluirPagamento" variant="elevated">
  {{ processing ? 'Processando...' : 'Concluir Pagamento' }}
 </VBtn>
 </div>
 </VCol>
 </VRow>
 </NuxtLayout>
</template>