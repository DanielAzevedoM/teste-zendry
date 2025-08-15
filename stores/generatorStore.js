import { defineStore } from 'pinia';

export const useGeneratorStore = defineStore('generator', {
  state: () => ({
    isLogoLoading: false,
    template: 'standard',
    backgroundColor: "#C8C2E0",
    formBackgroundColor: '#FFFFFF',
    summaryBackgroundColor: '#FAFAFA',
    summaryPosition: 'right',
    showCouponField: true,
    showAddressFields: true,
    themeColors: {
      primaryButtonBg: '#3FC583',
      primaryButtonText: '#FFFFFF',
      navigationButtonBg: '#1E88E5',
      navigationButtonText: '#FFFFFF',
      titles: '#666666',
      descriptions: '#666666',
      totalValue: '#666666',
    },
    header: {
      backgroundColor: '#181B4DA4',
      elementsColor: '#FFFFFF',
      logoFile: null,
      logoUrl: null,
      logoPosition: 'left',
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
      title: 'Boas-vindas!',
      iconColor: '#1E88E5',
      welcomeMessage: 'Olá! Bem-vindo ao nosso checkout. Use o cupom BEMVINDO10 para 10% de desconto!',
      coupon: 'BEMVINDO10',
      showOnConfirmation: false,
      confirmationTitle: 'Compra Aprovada!',
      confirmationMessage: 'Obrigado por sua compra! ✨',
      buttonBgColor: '#1E88E5',
      buttonTextColor: '#FFFFFF',
    },
  
    newsletter: {
      enabled: false,
      title: 'Não perca nossas novidades!',
      subtitle: 'Assine nossa newsletter e receba ofertas exclusivas.',
      buttonText: 'Assinar',
    },
    footer: {
      backgroundColor: '#001729',
      textColor: '#666666',
      showSupport: true,
      showWhatsapp: false,
      whatsapp: '(99) 99999-9999',
      showPhone: false,
      phone: '0800 000 0000',
      showEmail: false,
      email: 'suporte@suaempresa.com',
    },
    paymentSettings: {
      allowedMethods: {
        card: true,
        pix: true,
        boleto: true
      },
      allowMultiPayments: false,
      multiPaymentsMinCardValue: 50.00,
      installmentsMinParcelValue: 5.00,
      captureIp: true,
      checkoutExpiration: {
        enabled: false,
        durationMinutes: 8,
        warningMinutes: 4
      },
      interestRates: {
        '1': 0, '2': 4.59, '3': 5.99, '4': 7.89, '5': 9.15, '6': 10.99,
        '7': 12.50, '8': 13.99, '9': 15.25, '10': 16.89, '11': 18.50, '12': 19.99
      },
    },
    scripts: {
      googleTagManagerId: '',
      facebookPixelId: '',
      metaTags: {
        title: '',
        description: '',
        keywords: ''
      }
    },
  }),

  getters: {
    activeLayoutComponent: (state) => `checkout-${state.template}`,
    finalStepIndex: (state) => {
      return state.showAddressFields ? 3 : 2;
    }
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
      this.header.backgroundColor = '#181B4DA4';
      this.header.elementsColor = '#FFFFFF';
    },
    resetAnnouncementBarColors() {
      this.announcementBar.barColor = '#773CBC';
      this.announcementBar.textColor = '#FFFFFF';
      this.announcementBar.countdownColor = '#FFC926';
    },
    resetFooterColors() {
      this.footer.backgroundColor = '#001729';
      this.footer.textColor = '#666666';
    },

    resetMiniChatColors() {
      this.miniChat.iconColor = '#1E88E5';
      this.miniChat.buttonBgColor = '#1E88E5';
      this.miniChat.buttonTextColor = '#FFFFFF';
    },
    resetAppearanceColors() {
      this.backgroundColor = '#C8C2E0';
      this.formBackgroundColor = '#FFFFFF';
      this.summaryBackgroundColor = '#FAFAFA';
      this.themeColors.primaryButtonBg = '#3FC583';
      this.themeColors.primaryButtonText = '#FFFFFF';
      this.themeColors.navigationButtonBg = '#1E88E5';
      this.themeColors.navigationButtonText = '#FFFFFF';
      this.themeColors.titles = '#666666';
      this.themeColors.descriptions = '#666666';
      this.themeColors.totalValue = '#666666';
    },
    resetPaymentSettings() {
      this.paymentSettings.allowedMethods = { card: true, pix: true, boleto: true };
      this.paymentSettings.allowMultiPayments = false;
      this.paymentSettings.multiPaymentsMinCardValue = 50.00;
      this.paymentSettings.installmentsMinParcelValue = 5.00;
      this.paymentSettings.captureIp = true;
      this.paymentSettings.checkoutExpiration = { enabled: false, durationMinutes: 8, warningMinutes: 4 };
    },

    resetScripts() {
      this.scripts.googleTagManagerId = '';
      this.scripts.facebookPixelId = '';
      this.scripts.metaTags = {
        title: '',
        description: '',
        keywords: ''
      };
    },
    setConfig(config) {
      if (config.template) this.template = config.template;
      if (config.backgroundColor) this.backgroundColor = config.backgroundColor;
      if (config.formBackgroundColor) this.formBackgroundColor = config.formBackgroundColor;
      if (config.summaryBackgroundColor) this.summaryBackgroundColor = config.summaryBackgroundColor;
      if (config.summaryPosition) this.summaryPosition = config.summaryPosition;
      if (config.showCouponField !== undefined) this.showCouponField = config.showCouponField;
      if (config.showAddressFields !== undefined) this.showAddressFields = config.showAddressFields;
      if (config.themeColors) {
        this.themeColors = { ...this.themeColors, ...config.themeColors };
      }
      if (config.header) {
        this.header = { ...this.header, ...config.header };
      }
      if (config.announcementBar) {
        if (config.announcementBar.countdownMinutes) {
          config.announcementBar.countdownMinutes = Number(config.announcementBar.countdownMinutes);
        }
        this.announcementBar = { ...this.announcementBar, ...config.announcementBar };
      }
      if (config.miniChat) {
        this.miniChat = { ...this.miniChat, ...config.miniChat };
      }

      if (config.newsletter) {
          this.newsletter = { ...this.newsletter, ...config.newsletter };
      }
      if (config.footer) {
        this.footer = { ...this.footer, ...config.footer };
      }
      if (config.paymentSettings) {
        const newSettings = { ...this.paymentSettings, ...config.paymentSettings };
        newSettings.allowedMethods = { ...this.paymentSettings.allowedMethods, ...config.paymentSettings.allowedMethods };
        newSettings.checkoutExpiration = { ...this.paymentSettings.checkoutExpiration, ...config.paymentSettings.checkoutExpiration };
        this.paymentSettings = newSettings;
      }

      if (config.scripts) {
        const newScripts = { ...this.scripts, ...config.scripts };
        newScripts.metaTags = { ...this.scripts.metaTags, ...(config.scripts.metaTags || {}) };
        this.scripts = newScripts;
      }
    },
  },
});