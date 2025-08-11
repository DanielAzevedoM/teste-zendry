// pages/Checkout/[id]/index.vue

<script setup>
import AccountForm from '@/components/checkout/AccountForm.vue'
import AddressForm from '@/components/checkout/AddressForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PaymentMethod from '@/components/checkout/PaymentMethod.vue'
import PaymentConfirmation from '@/components/checkout/PaymentConfirmation.vue'
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import { useCheckout } from '@/composables/useCheckout'
import { useGeneratorStore } from '~/stores/generatorStore';

definePageMeta({
  middleware: 'check-payment-exists',
  layout: false,
});

const route = useRoute()
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
  currentStep, steps, isCurrentStepValid,
  stepAccountValid, stepAddressValid, stepPaymentValid,
  formData, payment,
  next, prev, loadPayment,
  start, method, status, processing, serverData,
} = useCheckout()

await loadPayment(route.params.id)

const paymentRef = ref(null)
const purchase = ref(null)
const layoutName = computed(() => generatorStore.activeLayoutComponent);

const paymentStepIndex = computed(() => generatorStore.showAddressFields ? 2 : 1);
const finalStepIndex = computed(() => steps.value.length - 1);


async function concluirPagamento() {
  if (!isCurrentStepValid.value) return;
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
              :form-data="formData" 
              :is-active="currentStep === 0"
              @valid="stepAccountValid = $event" 
            />
          </VWindowItem>

          <VWindowItem v-if="generatorStore.showAddressFields">
            <AddressForm 
              :form-data="formData.address" 
              :is-active="currentStep === 1"
              @valid="stepAddressValid = $event" 
            />
          </VWindowItem>
          
          <VWindowItem>
            <PaymentMethod 
              ref="paymentRef" 
              @valid="stepPaymentValid = $event" 
            />
          </VWindowItem>

          <VWindowItem>
            <PaymentConfirmation 
              v-if="purchase || status !== 'idle'" 
              :purchase="purchase" 
              :status="status"
              :method="method" 
              :server-data="serverData" 
            />
          </VWindowItem>
        </VWindow>

        <div v-if="currentStep < finalStepIndex"
          class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
          <VBtn 
            color="secondary" 
            variant="tonal" 
            :disabled="currentStep === 0" 
            @click="prev"
          >
            Anterior
          </VBtn>
          
          <VBtn 
            v-if="currentStep < paymentStepIndex" 
            :disabled="!isCurrentStepValid" 
            @click="next"
            class="btn-navigation" 
            variant="elevated"
          >
            Próximo
          </VBtn>
          
          <VBtn 
            v-if="currentStep === paymentStepIndex" 
            color="success" 
            :loading="processing"
            :disabled="!isCurrentStepValid || processing" 
            @click="concluirPagamento" 
            variant="elevated"
          >
            {{ processing ? 'Processando...' : 'Concluir Pagamento' }}
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </NuxtLayout>
</template>