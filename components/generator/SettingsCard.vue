<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGeneratorStore } from '~/stores/generatorStore';
import { 
 appearanceOptions,
 summaryOptions,
 orderBumpOptions,
 logoPositionOptions,
 showSupportOptions
} from '~/config/generatorOptions';

const generatorStore = useGeneratorStore();
const router = useRouter();
const currentTab = ref(0);

const { 
 isLogoLoading,
 template, header, footer, 
 backgroundColor, formBackgroundColor, summaryBackgroundColor,
 summaryPosition, showCouponField, showAddressFields,
 orderBumpEnabled, announcementBar, miniChat, themeColors
} = storeToRefs(generatorStore);

function onLogoChange(file) { 
 generatorStore.setHeaderLogo(file || null); 
}

function generateCheckout() {
 if (typeof window !== 'undefined') {
 sessionStorage.setItem('checkoutLogoUrl', header.value.logoUrl || '');
 }

 const query = {
 template: template.value,
 backgroundColor: backgroundColor.value,
 formBackgroundColor: formBackgroundColor.value,
 summaryBackgroundColor: summaryBackgroundColor.value,
 summaryPosition: summaryPosition.value,
 showCouponField: showCouponField.value,
 showAddressFields: showAddressFields.value,
 orderBumpEnabled: orderBumpEnabled.value,
 headerBackgroundColor: header.value.backgroundColor,
 headerElementsColor: header.value.elementsColor,
 headerLogoPosition: header.value.logoPosition,
 announcementBarText: announcementBar.value.text,
 announcementBarCountdownText: announcementBar.value.countdownText,
 announcementBarCountdownMinutes: announcementBar.value.countdownMinutes,
 announcementBarColor: announcementBar.value.barColor,
 announcementBarTextColor: announcementBar.value.textColor,
 announcementBarCountdownColor: announcementBar.value.countdownColor,
 miniChatEnabled: miniChat.value.enabled,
 miniChatWelcomeMessage: miniChat.value.welcomeMessage,
 miniChatCoupon: miniChat.value.coupon,
 footerBackgroundColor: footer.value.backgroundColor,
 footerTextColor: footer.value.textColor,
 footerShowSupport: footer.value.showSupport,
 footerShowWhatsapp: footer.value.showWhatsapp,
 footerShowPhone: footer.value.showPhone,
 footerShowEmail: footer.value.showEmail,
 ...themeColors.value,
 };
 
 router.push({ path: '/Checkout/pay_001', query });
}
</script>

<template>
 <VCard
 class="mx-auto"
 max-width="600"
 title="Gerador de checkout"
 subtitle="Personalize e gere um link de checkout"
 >
 <VTabs v-model="currentTab" bg-color="transparent" grow class="mt-4">
 <VTab>Cabeçalho</VTab>
 <VTab>Rodapé</VTab>
 <VTab>Formulário</VTab>
 <VTab>Resumo</VTab>
 <VTab>Aparência</VTab>
 <VTab>Order Bump</VTab>
 </VTabs>
 <VDivider />

 <VWindow v-model="currentTab">
 <VWindowItem class="pa-4">
 <div class="d-flex justify-space-between align-center mb-4"><p class="text-h6 mb-0">Cores</p><VBtn variant="text" size="small" @click="generatorStore.resetHeaderColors()">Resetar cor padrão</VBtn></div>
 <VSheet border rounded class="pa-4">
 <VLabel class="mb-1">Cor do cabeçalho</VLabel>
 <div class="d-flex align-center gap-x-2">
 <VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="header.backgroundColor" /></VMenu>
 <div class="border rounded cursor-pointer" :style="{ backgroundColor: header.backgroundColor, width: '36px', height: '36px' }" />
 <VTextField v-model="header.backgroundColor" variant="outlined" density="compact" hide-details />
 </div>
 <VLabel class="mt-4 mb-1">Cor dos elementos</VLabel>
 <div class="d-flex align-center gap-x-2">
 <VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="header.elementsColor" /></VMenu>
 <div class="border rounded cursor-pointer" :style="{ backgroundColor: header.elementsColor, width: '36px', height: '36px' }" />
 <VTextField v-model="header.elementsColor" variant="outlined" density="compact" hide-details />
 </div>
 <p class="text-caption mt-2">Recomendamos usar cores que apresentam um maior contraste para não prejudicar a visualização.</p>
 </VSheet>
 <p class="text-h6 mt-6 mb-4">Configurações</p>
 <VSheet border rounded class="pa-4">
 <VLabel class="mb-1">Logotipo</VLabel>
 <VFileInput 
 label="Arraste a imagem ou clique aqui" 
 variant="outlined" 
 accept="image/png, image/jpeg" 
 @update:model-value="onLogoChange" 
 :loading="isLogoLoading"
 />
 <p class="text-caption mt-1">Formatos .jpg e .png com menos de 500kb. Sugestão de tamanho: 300 x 90 px.</p>
 <VLabel class="mt-4">Posicionamento</VLabel>
 <VSelect v-model="header.logoPosition" :items="logoPositionOptions" variant="outlined" class="mt-1" />
 </VSheet>
 <div class="d-flex justify-space-between align-center mt-6 mb-4"><p class="text-h6 mb-0">Barra de anúncio / Cronômetro</p><VBtn variant="text" size="small" @click="generatorStore.resetAnnouncementBarColors()">Resetar cor padrão</VBtn></div>
 <VSheet border rounded class="pa-4">
 <p class="text-caption">A barra de anúncio ficará fixa abaixo do cabeçalho. Caso não tenha um texto ou o cronômetro esteja zerado, a barra não aparecerá.</p>
 <VLabel class="mt-4 mb-1">Texto da barra de anúncio <span class="text-caption">(opcional)</span></VLabel>
 <VTextarea v-model="announcementBar.text" variant="outlined" rows="3" placeholder="Digite aqui..." />
 <VLabel class="mt-4 mb-1">Texto do cronômetro</VLabel>
 <VTextField v-model="announcementBar.countdownText" variant="outlined" density="compact" maxlength="50" counter />
 <VLabel class="mt-4 mb-1">Tempo do cronômetro</VLabel>
 <div class="d-flex align-center gap-x-2">
 <VBtn icon="mdi-minus" variant="outlined" size="small" @click="announcementBar.countdownMinutes = Math.max(0, announcementBar.countdownMinutes - 1)" />
 <VTextField v-model.number="announcementBar.countdownMinutes" variant="outlined" density="compact" hide-details style="max-width: 80px;" class="text-center" type="number" min="0" />
 <VBtn icon="mdi-plus" variant="outlined" size="small" @click="announcementBar.countdownMinutes++" />
 <span class="ml-2">minutos.</span>
 </div>
 <p class="text-caption mt-1">Deixe 0 (zero) caso não queira utilizar o cronômetro.</p>
 <VLabel class="mt-4 mb-1">Cor da barra</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="announcementBar.barColor" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: announcementBar.barColor, width: '36px', height: '36px' }" /><VTextField v-model="announcementBar.barColor" variant="outlined" density="compact" hide-details /></div>
 
 <VLabel class="mt-4 mb-1">Cor do texto</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="announcementBar.textColor" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: announcementBar.textColor, width: '36px', height: '36px' }" /><VTextField v-model="announcementBar.textColor" variant="outlined" density="compact" hide-details /></div>

 <VLabel class="mt-4 mb-1">Cor do cronômetro</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="announcementBar.countdownColor" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: announcementBar.countdownColor, width: '36px', height: '36px' }" /><VTextField v-model="announcementBar.countdownColor" variant="outlined" density="compact" hide-details /></div>
 </VSheet>
 </VWindowItem>
 
 <VWindowItem class="pa-4">
 <div class="d-flex justify-space-between align-center mb-4"><p class="text-h6 mb-0">Cores</p><VBtn variant="text" size="small" @click="generatorStore.resetFooterColors()">Resetar cor padrão</VBtn></div>
 <VSheet border rounded class="pa-4">
 <VLabel class="mb-1">Cor do rodapé</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="footer.backgroundColor" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: footer.backgroundColor, width: '36px', height: '36px' }" /><VTextField v-model="footer.backgroundColor" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mt-4 mb-1">Cor do texto</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="footer.textColor" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: footer.textColor, width: '36px', height: '36px' }" /><VTextField v-model="footer.textColor" variant="outlined" density="compact" hide-details /></div>
 </VSheet>
 <p class="text-h6 mt-6 mb-4">Atendimento</p>
 <VSheet border rounded class="pa-4">
 <VSelect v-model="footer.showSupport" label="Exibir atendimento?" :items="showSupportOptions" variant="outlined" />
 <div v-if="footer.showSupport" class="mt-4">
 <VCheckbox v-model="footer.showWhatsapp" label="Mostrar WhatsApp" />
 <VCheckbox v-model="footer.showPhone" label="Mostrar telefone/celular" />
 <VCheckbox v-model="footer.showEmail" label="Mostrar e-mail" />
 </div>
 </VSheet>
 </VWindowItem>

 <VWindowItem class="pa-4">
 <p class="text-h6 mb-4">Configurações do Formulário</p>
 <VSheet border rounded class="pa-4">
 <p class="text-subtitle-1 mb-2">Campos de Endereço</p>
 <p class="text-caption">
 Ative ou desative a seção de endereço no formulário de informações pessoais. 
 Útil para produtos digitais que não exigem entrega.
 </p>
 <VSwitch 
 v-model="showAddressFields" 
 :label="showAddressFields ? 'Seção de endereço ativada' : 'Seção de endereço desativada'" 
 class="mt-2" 
 />
 </VSheet>
 </VWindowItem>
 
 <VWindowItem class="pa-4">
 <p class="text-h6 mb-4">Layout do Resumo</p>
 <VSheet border rounded class="pa-4">
 <VLabel class="mb-1">Posição do resumo do pedido</VLabel>
 <VRadioGroup v-model="summaryPosition" class="mb-4">
 <VRadio v-for="item in summaryOptions" :key="item.value" :label="item.title" :value="item.value" />
 </VRadioGroup>
 </VSheet>
 <p class="text-h6 mt-6 mb-4">Configurações</p>
 <VSheet border rounded class="pa-4">
 <VCheckbox v-model="showCouponField" label="Exibir campo de cupom de desconto" />
 </VSheet>
 </VWindowItem>
 
 <VWindowItem class="pa-4">
 <div class="d-flex justify-space-between align-center mb-4"><p class="text-h6 mb-0">Botões</p><VBtn variant="text" size="small" @click="generatorStore.resetAppearanceColors()">Resetar cor padrão</VBtn></div>
 <VSheet border rounded class="pa-4">
 <p class="font-weight-medium mb-2">BOTÃO PRIMÁRIO (Ex: Concluir Pagamento)</p>
 <p class="text-caption mb-4">Os botões primários são aqueles que realizam a ação principal da etapa.</p>
 <VLabel class="mb-1">Cor do botão</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.primaryButtonBg" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.primaryButtonBg, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.primaryButtonBg" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do texto</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.primaryButtonText" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.primaryButtonText, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.primaryButtonText" variant="outlined" density="compact" hide-details /></div>
 <VDivider class="my-4"/>
 <p class="font-weight-medium mb-2">BOTÃO DE NAVEGAÇÃO (Ex: Próximo)</p>
 <VLabel class="mb-1">Cor do botão</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.navigationButtonBg" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.navigationButtonBg, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.navigationButtonBg" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do texto</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.navigationButtonText" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.navigationButtonText, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.navigationButtonText" variant="outlined" density="compact" hide-details /></div>
 </VSheet>
 <div class="d-flex justify-space-between align-center mt-6 mb-4"><p class="text-h6 mb-0">Cores Gerais</p></div>
 <VSheet border rounded class="pa-4">
 <VLabel class="mb-1">Cor do fundo da página</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4">
 <VMenu activator="parent" :close-on-content-click="false">
 <VColorPicker v-model="backgroundColor" />
 </VMenu>
 <div class="border rounded cursor-pointer" :style="{ backgroundColor: backgroundColor, width: '36px', height: '36px' }" />
 <VTextField v-model="backgroundColor" variant="outlined" density="compact" hide-details />
 </div>
 <VLabel class="mb-1">Cor dos títulos</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.titles" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.titles, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.titles" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor das descrições</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.descriptions" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.descriptions, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.descriptions" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor da etapa de compra ativa</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.activeStep" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.activeStep, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.activeStep" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do valor total</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.totalValue" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.totalValue, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.totalValue" variant="outlined" density="compact" hide-details /></div>
 <VDivider class="my-4"/><p class="font-weight-medium mb-2">TAG DE ETAPAS</p>
 <VLabel class="mb-1">Cor da tag</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.stepTagBg" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.stepTagBg, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.stepTagBg" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do número</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.stepTagText" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.stepTagText, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.stepTagText" variant="outlined" density="compact" hide-details /></div>
 </VSheet>
 <VSheet border rounded class="pa-4 mt-4">
 <p class="font-weight-medium mb-2">TAG DE DESCONTO</p>
 <VLabel class="mb-1">Cor da tag</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.discountTagBg" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.discountTagBg, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.discountTagBg" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do texto</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.discountTagText" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.discountTagText, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.discountTagText" variant="outlined" density="compact" hide-details /></div>
 <VDivider class="my-4"/><p class="font-weight-medium mb-2">BARRA DE PROGRESSO (celular)</p>
 <VLabel class="mb-1">Cor da barra de progresso</VLabel>
 <div class="d-flex align-center gap-x-2 mb-4"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.progressBar" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.progressBar, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.progressBar" variant="outlined" density="compact" hide-details /></div>
 <VLabel class="mb-1">Cor do número</VLabel>
 <div class="d-flex align-center gap-x-2"><VMenu activator="parent" :close-on-content-click="false"><VColorPicker v-model="themeColors.progressBarText" /></VMenu><div class="border rounded cursor-pointer" :style="{ backgroundColor: themeColors.progressBarText, width: '36px', height: '36px' }" /><VTextField v-model="themeColors.progressBarText" variant="outlined" density="compact" hide-details /></div>
 </VSheet>
 </VWindowItem>
 
 <VWindowItem class="pa-4">
 <p class="text-h6 mb-4">Order Bump</p>
 <VSheet border rounded class="pa-4">
 <p class="text-subtitle-1 mb-2">Oferta no Checkout (Order Bump)</p>
 <p class="text-caption">Ofereça um produto complementar com um clique antes da finalização da compra.</p>
 <VSwitch v-model="orderBumpEnabled" :label="orderBumpEnabled ? 'Ativado' : 'Desativado'" class="mt-2" />
 </VSheet>
 <VDivider class="my-6" />
 <p class="text-h6 mb-4">Notificações e Cupons</p>
 <VSheet border rounded class="pa-4">
 <p class="text-subtitle-1 mb-2">Mini Chat de Notificação</p>
 <p class="text-caption">Exibe uma pequena notificação de boas-vindas no canto da tela, podendo oferecer um cupom.</p>
 <VSwitch v-model="miniChat.enabled" :label="miniChat.enabled ? 'Ativado' : 'Desativado'" class="mt-2" />
 <div v-if="miniChat.enabled">
 <VLabel class="mt-4 mb-1">Mensagem de boas-vindas</VLabel>
 <VTextarea v-model="miniChat.welcomeMessage" variant="outlined" rows="3" placeholder="Ex: Olá! Use o cupom BEMVINDO10 para 10% OFF." />
 <VLabel class="mt-4 mb-1">Cupom oferecido (opcional)</VLabel>
 <VTextField v-model="miniChat.coupon" variant="outlined" density="compact" placeholder="BEMVINDO10" />
 </div>
 </VSheet>
 </VWindowItem>
 </VWindow>
 
 <VDivider />
 <VCardActions class="pa-4">
 <VSpacer />
 <VBtn 
 color="primary" 
 variant="elevated" 
 size="large" 
 @click="generateCheckout"
 :disabled="isLogoLoading"
 >
 {{ isLogoLoading ? 'Processando Imagem...' : 'Gerar e Visualizar Checkout' }}
 </VBtn>
 </VCardActions>
 </VCard>
</template>