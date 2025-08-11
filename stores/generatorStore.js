import { defineStore } from 'pinia';
import { 
 appearanceOptions,
 summaryOptions,
 orderBumpOptions,
 logoPositionOptions,
} from '~/config/generatorOptions';

export const useGeneratorStore = defineStore('generator', {
 state: () => ({
 isLogoLoading: false, 
 template: 'standard',
 backgroundColor: appearanceOptions[0].value,
 formBackgroundColor: '#FFFFFF',
 summaryBackgroundColor: '#FAFAFA',
 summaryPosition: summaryOptions[0].value,
 showCouponField: true,
 showAddressFields: true, 
 orderBumpEnabled: orderBumpOptions[1].value,
 
 themeColors: {
 primaryButtonBg: '#3FC583',
 primaryButtonText: '#FFFFFF',
 navigationButtonBg: '#1E88E5',
 navigationButtonText: '#FFFFFF',
 titles: '#666666',
 descriptions: '#666666',
 activeStep: '#999999',
 totalValue: '#44C485',
 stepTagBg: '#333333',
 stepTagText: '#FFFFFF',
 discountTagBg: '#725BC2',
 discountTagText: '#FFFFFF',
 progressBar: '#36B376',
 progressBarText: '#FFFFFF',
 },

 header: {
 backgroundColor: '#181B4DA4',
 elementsColor: '#FFFFFF',
 logoFile: null,
 logoUrl: null,
 logoPosition: logoPositionOptions[0].value,
 },
 announcementBar: {
 text: '',
 countdownText: 'Oferta termina em',
 countdownMinutes: 0,
 barColor: '#773CBC',
 textColor: '#FFFFFF',
 countdownColor: '#FFC926',
 },
 miniChat: {
 enabled: false,
 welcomeMessage: 'Olá! Bem-vindo ao nosso checkout. Use o cupom BEMVINDO10 para 10% de desconto!',
 coupon: 'BEMVINDO10',
 },
 footer: {
 backgroundColor: '#001729',
 textColor: '#666666',
 showSupport: true,
 showWhatsapp: false,
 showPhone: false,
 showEmail: false,
 },
 }),

 getters: {
 activeLayoutComponent: (state) => `checkout-${state.template}`,
 },

 actions: {
 setHeaderLogo(file) {
 if (!file) {
 this.header.logoFile = null;
 this.header.logoUrl = null;
 return;
 }
 
 this.isLogoLoading = true;
 this.header.logoFile = file;
 const reader = new FileReader();
 
 reader.onload = (e) => {
 this.header.logoUrl = e.target.result;
 this.isLogoLoading = false;
 };
 
 reader.onerror = () => {
 this.isLogoLoading = false;
 console.error("Erro ao ler o arquivo de imagem.");
 }

 reader.readAsDataURL(file);
 },
 resetHeaderColors() {
 this.header.backgroundColor = '#FFFFFF';
 this.header.elementsColor = '#666666';
 },
 resetAnnouncementBarColors() {
 this.announcementBar.barColor = '#773CBC';
 this.announcementBar.textColor = '#FFFFFF';
 this.announcementBar.countdownColor = '#FFC926';
 },
 resetFooterColors() {
 this.footer.backgroundColor = '#F7F7F8';
 this.footer.textColor = '#666666';
 },
 resetAppearanceColors() {
 this.backgroundColor = appearanceOptions[0].value;
 this.formBackgroundColor = '#FFFFFF';
 this.summaryBackgroundColor = '#FAFAFA';
 this.themeColors.primaryButtonBg = '#3FC583';
 this.themeColors.primaryButtonText = '#FFFFFF';
 this.themeColors.navigationButtonBg = '#1E88E5';
 this.themeColors.navigationButtonText = '#FFFFFF';
 this.themeColors.titles = '#666666';
 this.themeColors.descriptions = '#666666';
 this.themeColors.activeStep = '#999999';
 this.themeColors.totalValue = '#44C485';
 this.themeColors.stepTagBg = '#333333';
 this.themeColors.stepTagText = '#FFFFFF';
 this.themeColors.discountTagBg = '#725BC2';
 this.themeColors.discountTagText = '#FFFFFF';
 this.themeColors.progressBar = '#36B376';
 this.themeColors.progressBarText = '#FFFFFF';
 },
 
 setConfig(config) {
 if (config.template) this.template = config.template;
 if (config.backgroundColor) this.backgroundColor = config.backgroundColor;
 if (config.formBackgroundColor) this.formBackgroundColor = config.formBackgroundColor;
 if (config.summaryBackgroundColor) this.summaryBackgroundColor = config.summaryBackgroundColor;
 if (config.summaryPosition) this.summaryPosition = config.summaryPosition;
 if (config.showCouponField !== undefined) this.showCouponField = config.showCouponField === 'true';
 if (config.showAddressFields !== undefined) this.showAddressFields = config.showAddressFields === 'true';
 if (config.orderBumpEnabled !== undefined) this.orderBumpEnabled = config.orderBumpEnabled === 'true';

 Object.keys(this.themeColors).forEach(key => {
 if (config[key]) {
 this.themeColors[key] = config[key];
 }
 });

 if (config.headerBackgroundColor) this.header.backgroundColor = config.headerBackgroundColor;
 if (config.headerElementsColor) this.header.elementsColor = config.headerElementsColor;
 if (config.headerLogoPosition) this.header.logoPosition = config.headerLogoPosition;
 if (config.logoUrl) this.header.logoUrl = config.logoUrl;

 if (config.announcementBarText) this.announcementBar.text = config.announcementBarText;
 if (config.announcementBarCountdownText) this.announcementBar.countdownText = config.announcementBarCountdownText;
 if (config.announcementBarCountdownMinutes) this.announcementBar.countdownMinutes = Number(config.announcementBarCountdownMinutes);
 if (config.announcementBarColor) this.announcementBar.barColor = config.announcementBarColor;
 if (config.announcementBarTextColor) this.announcementBar.textColor = config.announcementBarTextColor;
 if (config.announcementBarCountdownColor) this.announcementBar.countdownColor = config.announcementBarCountdownColor;

 if (config.miniChatEnabled !== undefined) this.miniChat.enabled = config.miniChatEnabled === 'true';
 if (config.miniChatWelcomeMessage) this.miniChat.welcomeMessage = config.miniChatWelcomeMessage;
 if (config.miniChatCoupon) this.miniChat.coupon = config.miniChatCoupon;

 if (config.footerBackgroundColor) this.footer.backgroundColor = config.footerBackgroundColor;
 if (config.footerTextColor) this.footer.textColor = config.footerTextColor;
 if (config.footerShowSupport !== undefined) this.footer.showSupport = config.footerShowSupport === 'true';
 if (config.footerShowWhatsapp !== undefined) this.footer.showWhatsapp = config.footerShowWhatsapp === 'true';
 if (config.footerShowPhone !== undefined) this.footer.showPhone = config.footerShowPhone === 'true';
 if (config.footerShowEmail !== undefined) this.footer.showEmail = config.footerShowEmail === 'true';
 },
 },
});