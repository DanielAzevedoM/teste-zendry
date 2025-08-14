<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useCheckout } from '@/composables/useCheckout';
import { useGeneratorStore } from '~/stores/generatorStore';
import { usePaymentStore } from '~/stores/paymentStore';
import { storeToRefs } from 'pinia';

import AccountForm from '@/components/checkout/AccountForm.vue';
import AddressForm from '@/components/checkout/AddressForm.vue';
import OrderSummary from '@/components/checkout/OrderSummary.vue';
import PaymentMethod from '@/components/checkout/PaymentMethod.vue';
import PaymentConfirmation from '~/components/checkout/PaymentConfirmation.vue';
import CountdownTimer from '@/components/checkout/CountdownTimer.vue';

definePageMeta({ layout: false });

const route = useRoute();
const generatorStore = useGeneratorStore();
const paymentStore = usePaymentStore();

const { scripts } = storeToRefs(generatorStore);

const isLoading = ref(true);
const isConfigLoaded = ref(false);
const errorMessage = ref('');

const {
  steps, isCurrentStepValid,
  stepAccountValid, stepAddressValid, stepPaymentValid,
  formData, purchase,
  next, prev,
  processPayment, status, processing,
  setupCheckout, showExpirationWarning, warningCountdownSeconds, isPurchaseCompleted
} = useCheckout();

const { currentStep } = storeToRefs(paymentStore);

const paymentRef = ref(null);
const layoutName = computed(() => generatorStore.activeLayoutComponent);
const paymentStepIndex = computed(() => generatorStore.showAddressFields ? 2 : 1);
const finalStepIndex = computed(() => steps.value.length - 1);


onMounted(async () => {
  try {
    const { isReady, error } = await setupCheckout(route.params.id);
    if (error) {
      errorMessage.value = error;
    }
    isConfigLoaded.value = isReady;
  } catch (error) {
    console.error('[CHECKOUT] Erro crítico durante a inicialização:', error);
    errorMessage.value = error.message || 'Ocorreu um erro crítico ao carregar a página.';
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (!isConfigLoaded.value) return;

  const gtmId = scripts.value.googleTagManagerId;
  const fbPixelId = scripts.value.facebookPixelId;
  const metaTags = scripts.value.metaTags;

  const scriptsToInject = [];
  const noscriptsToInject = [];
  const metaToInject = [];

  if (metaTags) {
    if (metaTags.title) {
      metaToInject.push({ name: 'title', content: metaTags.title });
      metaToInject.push({ property: 'og:title', content: metaTags.title });
    }
    if (metaTags.description) {
      metaToInject.push({ name: 'description', content: metaTags.description });
      metaToInject.push({ property: 'og:description', content: metaTags.description });
    }
    if (metaTags.ogImage) {
      metaToInject.push({ property: 'og:image', content: metaTags.ogImage });
    }

    // --- INÍCIO DA CORREÇÃO ---
    // Adiciona a meta tag 'keywords' se ela existir na configuração
    if (metaTags.keywords) {
      metaToInject.push({ name: 'keywords', content: metaTags.keywords });
    }
    // --- FIM DA CORREÇÃO ---
  }

  if (gtmId) {
    scriptsToInject.push({
      children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`
    });
    noscriptsToInject.push({
      tagPosition: 'bodyOpen',
      children: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    });
  }


  if (fbPixelId) {
    scriptsToInject.push({
      children: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');`
    });
    noscriptsToInject.push({
      children: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1" />`
    });
  }

  useHead({
    title: metaTags?.title || 'Checkout',
    meta: metaToInject,
    script: scriptsToInject,
    noscript: noscriptsToInject,
  });
});

async function concluirPagamento() {
  if (!isCurrentStepValid.value) return;

  let childOk = true;
  try {
    if (paymentRef.value?.concluirPagamento) {
      childOk = await paymentRef.value.concluirPagamento();
    }
    if (!childOk) return;

    const payload = paymentRef.value.getPayload();
    await processPayment(payload);
  } catch (e) {
    console.error('Erro ao concluir pagamento:', e);
  }
}
</script>

<template>
  <div>
    <VDialog v-model="showExpirationWarning" width="auto">
      <VCard color="warning" class="pa-4 text-center">
        <VCardText>
          <p class="text-h6">Atenção!</p>
          Seu tempo está acabando. Conclua a compra para garantir seu pedido.
          <CountdownTimer :initialSeconds="warningCountdownSeconds" countdown-text="Tempo restante:"
            class="mt-2 justify-center font-weight-bold" />
        </VCardText>
        <VCardActions class="justify-center">
          <VBtn @click="showExpirationWarning = false">Entendi</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <div v-if="isLoading" class="d-flex justify-center align-center fill-height" style="min-height: 100vh;">
      <VProgressCircular indeterminate color="primary" />
    </div>
    <div v-else-if="errorMessage" class="d-flex justify-center align-center fill-height pa-4"
      style="min-height: 100vh;">
      <VAlert type="error" variant="tonal" border="start" prominent>
        {{ errorMessage }}
      </VAlert>
    </div>

    <NuxtLayout v-if="isConfigLoaded && !errorMessage" :name="layoutName">
      <template #summary>
        <OrderSummary />
      </template>

      <VWindow v-model="currentStep" class="disable-tab-transition">
        <VWindowItem>
          <AccountForm :form-data="formData" :is-active="currentStep === 0" @valid="stepAccountValid = $event" />
        </VWindowItem>

        <VWindowItem v-if="generatorStore.showAddressFields">
          <AddressForm :form-data="formData.address" :is-active="currentStep === 1"
            @valid="stepAddressValid = $event" />
        </VWindowItem>

        <VWindowItem>
          <PaymentMethod ref="paymentRef" @valid="stepPaymentValid = $event" />
        </VWindowItem>

        <VWindowItem>
          <div class="d-flex justify-center">
            <div style="width: 100%; max-width: 600px;">
              <PaymentConfirmation v-if="purchase || status !== 'idle'" :purchase="purchase" :status="status" />
            </div>
          </div>
        </VWindowItem>
      </VWindow>

      <div v-if="currentStep < finalStepIndex"
        class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
        <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="prev">
          Anterior
        </VBtn>

        <VBtn v-if="currentStep < paymentStepIndex" :disabled="!isCurrentStepValid" @click="next"
          class="btn-navigation" variant="elevated">
          Próximo
        </VBtn>

        <VBtn v-if="currentStep === paymentStepIndex" color="success" :loading="processing"
          :disabled="!isCurrentStepValid || processing || isPurchaseCompleted" @click="concluirPagamento"
          variant="elevated">
          {{ processing ? 'Processando...' : 'Concluir Pagamento' }}
        </VBtn>
      </div>

    </NuxtLayout>
  </div>
</template>