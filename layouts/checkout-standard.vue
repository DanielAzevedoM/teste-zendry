<script setup>
import { useGeneratorStore } from '~/stores/generatorStore';
import { storeToRefs } from 'pinia';
import CountdownTimer from '~/components/checkout/CountdownTimer.vue';
import MiniChatNotification from '~/components/checkout/MiniChatNotification.vue';

const generatorStore = useGeneratorStore();
const { 
 backgroundColor, formBackgroundColor, summaryBackgroundColor,
 header, footer, summaryPosition, announcementBar, miniChat, themeColors
} = storeToRefs(generatorStore);

const wrapperStyle = computed(() => ({
 backgroundColor: backgroundColor.value,
 display: 'flex',
 flexDirection: 'column',
 minHeight: '100vh',
}));

const headerStyle = computed(() => ({
 backgroundColor: header.value.backgroundColor,
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
 position: 'sticky', top: '0', zIndex: 1004,
 '--theme-titles-color': 'inherit',
 '--theme-descriptions-color': 'inherit',
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
 '--theme-active-step-color': colors.activeStep,
 '--theme-total-value-color': colors.totalValue,
 '--theme-step-tag-bg': colors.stepTagBg,
 '--theme-step-tag-text': colors.stepTagText,
 '--theme-discount-tag-bg': colors.discountTagBg,
 '--theme-discount-tag-text': colors.discountTagText,
 '--theme-progress-bar': colors.progressBar,
 '--theme-progress-bar-text': colors.progressBarText,
 };
});

const supportInfo = {
 whatsapp: '(99) 99999-9999',
 phone: '0800 000 0000',
 email: 'suporte@suaempresa.com'
}
</script>
 
<template>
 <VApp class="checkout-theme-wrapper" :style="[wrapperStyle, themeStyles]">
 
  <header class="pa-4 d-flex" :class="headerAlignmentClass" :style="headerStyle">
    <img v-if="header.logoUrl" :src="header.logoUrl" alt="Logo da Empresa" style="max-height: 50px; max-width: 250px;">
    <h1 v-else class="text-h5" :style="{ color: header.elementsColor }">Finalize sua Compra</h1>
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
 <VCol cols="12" md="5" sm="10" :class="{ 'order-md-2': !isSummaryOnLeft, 'order-md-1': isSummaryOnLeft }">
 <VSheet rounded="lg" class="pa-4 pa-md-6" :style="summaryStyle"><slot name="summary" /></VSheet>
 </VCol>
 <VCol cols="12" md="7" sm="10" :class="{ 'order-md-1': !isSummaryOnLeft, 'order-md-2': isSummaryOnLeft }">
 <VSheet rounded="lg" class="pa-4 pa-md-6" :style="formStyle"><slot /></VSheet>
 </VCol>
 </VRow>
 </VContainer>
 </VMain>
 <footer v-if="footer.showSupport" class="pa-4 mt-auto text-center" :style="footerStyle">
 <VContainer>
 <div class="d-flex justify-center flex-column align-center flex-wrap gap-x-6" :style="{ color: footer.textColor }">
 <div v-if="footer.showWhatsapp" class="d-flex align-center"><VIcon icon="mdi-whatsapp" class="mr-2" :color="footer.textColor" /><span :style="{ color: footer.textColor }">{{ supportInfo.whatsapp }}</span></div>
 <div v-if="footer.showPhone" class="d-flex align-center"><VIcon icon="mdi-phone" class="mr-2" :color="footer.textColor" /><span :style="{ color: footer.textColor }">{{ supportInfo.phone }}</span></div>
 <div v-if="footer.showEmail" class="d-flex align-center"><VIcon icon="mdi-email-outline" class="mr-2" :color="footer.textColor" /><span :style="{ color: footer.textColor }">{{ supportInfo.email }}</span></div>
 </div>
 <p class="text-caption mt-4 mb-0" :style="{ color: footer.textColor }">&copy; {{ new Date().getFullYear() }} Sua Empresa. Todos os direitos reservados.</p>
 </VContainer>
 </footer>
 <MiniChatNotification v-if="miniChat.enabled" :message="miniChat.welcomeMessage" :coupon="miniChat.coupon" />
 </VApp>
</template>