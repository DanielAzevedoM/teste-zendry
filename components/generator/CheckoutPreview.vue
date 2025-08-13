<script setup>
import { useGeneratorStore } from '~/stores/generatorStore';
import { usePaymentStore } from '~/stores/paymentStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import CountdownTimer from '~/components/checkout/CountdownTimer.vue';
import MiniChatNotification from '~/components/checkout/MiniChatNotification.vue';
import OrderSummary from '~/components/checkout/OrderSummary.vue';

const generatorStore = useGeneratorStore();
const paymentStore = usePaymentStore();

const {
  backgroundColor, formBackgroundColor, summaryBackgroundColor,
  header, footer, summaryPosition, announcementBar, miniChat, themeColors
} = storeToRefs(generatorStore);

// Usamos um valor fixo para o passo atual, para que o resumo sempre apareça
const currentStep = ref(0);

const showSummary = computed(() => currentStep.value < 2);

const wrapperStyle = computed(() => ({
  backgroundColor: backgroundColor.value,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
}));

const headerStyle = computed(() => ({
  backgroundColor: header.value.backgroundColor,
  color: header.value.elementsColor, // Aplicando a cor dos elementos
}));

const headerAlignmentClass = computed(() => ({
  'justify-start': header.value.logoPosition === 'left',
  'justify-center': header.value.logoPosition === 'center',
  'justify-end': header.value.logoPosition === 'right',
}));

const isSummaryOnLeft = computed(() => summaryPosition.value === 'left');

const showAnnouncementBar = computed(() => announcementBar.value.text || announcementBar.value.countdownMinutes > 0);

const announcementBarStyle = computed(() => ({
  backgroundColor: announcementBar.value.barColor,
  color: announcementBar.value.textColor,
  position: 'sticky', top: '0', zIndex: 4,
}));

const footerStyle = computed(() => ({
  backgroundColor: footer.value.backgroundColor,
  color: footer.value.textColor,
}));

const summaryStyle = computed(() => ({ backgroundColor: summaryBackgroundColor.value }));
const formStyle = computed(() => ({ backgroundColor: formBackgroundColor.value }));


const themeStyles = computed(() => {
  const colors = themeColors.value;
  return {
    '--theme-primary-button-bg': colors.primaryButtonBg,
    '--theme-primary-button-text': colors.primaryButtonText,
    '--theme-navigation-button-bg': colors.navigationButtonBg,
    '--theme-navigation-button-text': colors.navigationButtonText,
    '--theme-titles-color': colors.titles,
    '--theme-descriptions-color': colors.descriptions,
    '--theme-total-value-color': colors.totalValue,
  };
});

// Adicionamos dados de exemplo para o OrderSummary funcionar no preview
onMounted(() => {
  paymentStore.setPayment({
    id: 'preview_order',
    amount: 199.90,
    discount: 20.00,
  });
});

</script>

<template>
  <VApp class="checkout-theme-wrapper rounded" :style="[wrapperStyle, themeStyles]">

    <header class="pa-4 d-flex" :class="headerAlignmentClass" :style="headerStyle">
      <img v-if="header.logoUrl" :src="header.logoUrl" alt="Logo" style="max-height: 50px; max-width: 250px;">
      <img v-else src="/logo-placeholder.png" alt="Logo" style="max-height: 50px; max-width: 250px;">
    </header>

    <div v-if="showAnnouncementBar" class="pa-2 text-center" :style="announcementBarStyle">
      <VContainer class="d-flex align-center justify-center gap-x-4 flex-wrap pa-0">
        <span v-if="announcementBar.text" class="mr-4" :style="{ color: announcementBar.textColor }">
          {{ announcementBar.text }}
        </span>
        <CountdownTimer
          v-if="announcementBar.countdownMinutes > 0"
          :minutes="announcementBar.countdownMinutes"
          :countdown-text="announcementBar.countdownText"
          :countdown-color="announcementBar.countdownColor"
          :text-color="announcementBar.textColor"
        />
      </VContainer>
    </div>

    <VMain class="d-flex align-center justify-center flex-grow-1">
      <VContainer>
        <VRow justify="center">
          <VCol
            v-if="showSummary"
            cols="12" md="5"
            :class="{ 'order-md-2': !isSummaryOnLeft, 'order-md-1': isSummaryOnLeft }"
          >
            <VSheet rounded="lg" class="pa-4" :style="summaryStyle">
              <OrderSummary />
            </VSheet>
          </VCol>
          <VCol
            cols="12"
            :md="showSummary ? 7 : 12"
            :class="{ 'order-md-1': !isSummaryOnLeft, 'order-md-2': isSummaryOnLeft }"
          >
            <VSheet rounded="lg" class="pa-4" :style="formStyle">
                <h3 class="text-h6 mb-4" :style="{ color: themeStyles['--theme-titles-color'] }">Informações da Conta</h3>
                <p class="text-body-2 mb-6" :style="{ color: themeStyles['--theme-descriptions-color'] }">
                    Aqui ficarão os campos do formulário de checkout.
                </p>
                <VTextField label="Email" variant="outlined" readonly />
                <VTextField label="Nome Completo" variant="outlined" readonly class="mt-4" />
                <div class="d-flex justify-space-between mt-6">
                    <VBtn variant="tonal" color="secondary">Anterior</VBtn>
                    <VBtn variant="elevated" class="btn-navigation">Próximo</VBtn>
                </div>
            </VSheet>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>

    <footer class="pa-4 mt-auto text-center" :style="footerStyle">
      <VContainer>
        <div v-if="footer.showSupport" class="d-flex justify-center flex-column align-center flex-wrap gap-x-6 mb-4" :style="{ color: footer.textColor }">
          <div v-if="footer.showWhatsapp" class="d-flex align-center"><VIcon icon="mdi-whatsapp" class="mr-2" /><span>{{ footer.whatsapp }}</span></div>
          <div v-if="footer.showPhone" class="d-flex align-center"><VIcon icon="mdi-phone" class="mr-2" /><span>{{ footer.phone }}</span></div>
          <div v-if="footer.showEmail" class="d-flex align-center"><VIcon icon="mdi-email-outline" class="mr-2" /><span>{{ footer.email }}</span></div>
        </div>
        <p class="text-caption mb-0">&copy; {{ new Date().getFullYear() }} Sua Empresa. Todos os direitos reservados.</p>
      </VContainer>
    </footer>

    <MiniChatNotification v-if="miniChat.enabled" :message="miniChat.welcomeMessage" :coupon="miniChat.coupon" />
  </VApp>
</template>

<style scoped>
/* Garante que o preview não ocupe a tela inteira */
.v-application {
  height: 100%;
  width: 100%;
}
</style>