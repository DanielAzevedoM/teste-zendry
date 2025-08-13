<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGeneratorStore } from '~/stores/generatorStore';
import {
    summaryOptions,
    logoPositionOptions,
    showSupportOptions
} from '~/config/generatorOptions';

const generatorStore = useGeneratorStore();
const currentTab = ref(0);
const isLoading = ref(false);

const {
    isLogoLoading,
    template, header, footer,
    backgroundColor, formBackgroundColor, summaryBackgroundColor,
    summaryPosition, showCouponField, showAddressFields,
    announcementBar, miniChat, themeColors,
    paymentSettings,
    scripts
} = storeToRefs(generatorStore);

function onLogoChange(file) {
    generatorStore.setHeaderLogo(file || null);
}

async function saveConfiguration() {
    isLoading.value = true;

    const configData = {
        name: `Configuração ${new Date().toLocaleString('pt-BR')}`,
        template: template.value,
        backgroundColor: backgroundColor.value,
        formBackgroundColor: formBackgroundColor.value,
        summaryBackgroundColor: summaryBackgroundColor.value,
        summaryPosition: summaryPosition.value,
        showCouponField: showCouponField.value,
        showAddressFields: showAddressFields.value,
        header: {
            backgroundColor: header.value.backgroundColor,
            elementsColor: header.value.elementsColor,
            logoPosition: header.value.logoPosition,
        },
        announcementBar: announcementBar.value,
        miniChat: miniChat.value,
        footer: footer.value,
        themeColors: themeColors.value,
        paymentSettings: paymentSettings.value,
        scripts: scripts.value
    };

    try {
        const response = await fetch('/api/configs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(configData),
        });

        if (!response.ok) throw new Error('Falha ao salvar a configuração');

        const result = await response.json();
        alert(`Configuração salva com sucesso! ID: ${result.body.config.id}`);
    } catch (error) {
        console.error(error);
        alert('Ocorreu um erro ao salvar a configuração.');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>

    <div class="pb-4 pt-4 text-center header-actions">
        <NuxtLink to="/orders">
            <VBtn class="mx-2" color="indigo">Ver Pedidos</VBtn>
        </NuxtLink>
        <NuxtLink to="/admin">
            <VBtn class="mx-2" color="green">Painel de Confirmação</VBtn>
        </NuxtLink>
    </div>
    <VCard class="mx-auto" max-width="600" title="Gerador de Configuração de Checkout"
        subtitle="Crie e salve modelos de checkout">
        <VTabs v-model="currentTab" bg-color="transparent" grow class="mt-4">
            <VTab>Cabeçalho</VTab>
            <VTab>Rodapé</VTab>
            <VTab>Formulário</VTab>
            <VTab>Resumo</VTab>
            <VTab>Aparência</VTab>
            <VTab>Extras</VTab>
            <VTab>Pagamentos</VTab>
            <VTab>Scripts</VTab>
        </VTabs>
        <VDivider />

        <VWindow v-model="currentTab">
            <VWindowItem class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-h6 mb-0">Cores</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetHeaderColors()">Resetar cor padrão
                    </VBtn>
                </div>
                <VSheet border rounded class="pa-4">
                    <VLabel class="mb-1">Cor do cabeçalho</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="header.backgroundColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: header.backgroundColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="header.backgroundColor" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mt-4 mb-1">Cor dos elementos</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="header.elementsColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: header.elementsColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="header.elementsColor" variant="outlined" density="compact" hide-details />
                    </div>
                    <p class="text-caption mt-2">Recomendamos usar cores que apresentam um maior contraste para não
                        prejudicar a visualização.</p>
                </VSheet>
                <p class="text-h6 mt-6 mb-4">Configurações</p>
                <VSheet border rounded class="pa-4">
                    <VLabel class="mb-1">Logotipo</VLabel>
                    <VFileInput label="Arraste a imagem ou clique aqui" variant="outlined"
                        accept="image/png, image/jpeg" @update:model-value="onLogoChange" :loading="isLogoLoading" />
                    <p class="text-caption mt-1">Formatos .jpg e .png com menos de 500kb. Sugestão de tamanho: 300 x 90
                        px.</p>
                    <VLabel class="mt-4">Posicionamento</VLabel>
                    <VSelect v-model="header.logoPosition" :items="logoPositionOptions" variant="outlined"
                        class="mt-1" />
                </VSheet>
                <div class="d-flex justify-space-between align-center mt-6 mb-4">
                    <p class="text-h6 mb-0">Barra de anúncio / Cronômetro</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetAnnouncementBarColors()">Resetar cor
                        padrão</VBtn>
                </div>
                <VSheet border rounded class="pa-4">
                    <p class="text-caption">A barra de anúncio ficará fixa abaixo do cabeçalho. Caso não tenha um texto
                        ou o cronômetro esteja zerado, a barra não aparecerá.</p>
                    <VLabel class="mt-4 mb-1">Texto da barra de anúncio <span class="text-caption">(opcional)</span>
                    </VLabel>
                    <VTextarea v-model="announcementBar.text" variant="outlined" rows="3"
                        placeholder="Digite aqui..." />
                    <VLabel class="mt-4 mb-1">Texto do cronômetro</VLabel>
                    <VTextField v-model="announcementBar.countdownText" variant="outlined" density="compact"
                        maxlength="50" counter />
                    <VLabel class="mt-4 mb-1">Tempo do cronômetro</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VBtn icon="mdi-minus" variant="outlined" size="small"
                            @click="announcementBar.countdownMinutes = Math.max(0, announcementBar.countdownMinutes - 1)" />
                        <VTextField v-model.number="announcementBar.countdownMinutes" variant="outlined"
                            density="compact" hide-details style="max-width: 80px;" class="text-center" type="number"
                            min="0" />
                        <VBtn icon="mdi-plus" variant="outlined" size="small"
                            @click="announcementBar.countdownMinutes++" />
                        <span class="ml-2">minutos.</span>
                    </div>
                    <p class="text-caption mt-1">Deixe 0 (zero) caso não queira utilizar o cronômetro.</p>
                    <VLabel class="mt-4 mb-1">Cor da barra</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="announcementBar.barColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: announcementBar.barColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="announcementBar.barColor" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mt-4 mb-1">Cor do texto</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="announcementBar.textColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: announcementBar.textColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="announcementBar.textColor" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mt-4 mb-1">Cor do cronômetro</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="announcementBar.countdownColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: announcementBar.countdownColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="announcementBar.countdownColor" variant="outlined" density="compact"
                            hide-details />
                    </div>
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-h6 mb-0">Cores</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetFooterColors()">Resetar cor padrão
                    </VBtn>
                </div>
                <VSheet border rounded class="pa-4">
                    <VLabel class="mb-1">Cor do rodapé</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="footer.backgroundColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: footer.backgroundColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="footer.backgroundColor" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mt-4 mb-1">Cor do texto</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="footer.textColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: footer.textColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="footer.textColor" variant="outlined" density="compact" hide-details />
                    </div>
                </VSheet>
                <p class="text-h6 mt-6 mb-4">Atendimento</p>
                <VSheet border rounded class="pa-4">
                    <VSelect v-model="footer.showSupport" label="Exibir atendimento?" :items="showSupportOptions"
                        variant="outlined" />
                    <div v-if="footer.showSupport" class="mt-4">
                        <VCheckbox v-model="footer.showWhatsapp" label="Mostrar WhatsApp" />
                        <VTextField v-if="footer.showWhatsapp" v-model="footer.whatsapp" label="Número do WhatsApp"
                            variant="outlined" density="compact" class="ml-8 mb-2" placeholder="(99) 99999-9999" />
                        <VCheckbox v-model="footer.showPhone" label="Mostrar telefone/celular" />
                        <VTextField v-if="footer.showPhone" v-model="footer.phone" label="Número do Telefone"
                            variant="outlined" density="compact" class="ml-8 mb-2" placeholder="0800 000 0000" />
                        <VCheckbox v-model="footer.showEmail" label="Mostrar e-mail" />
                        <VTextField v-if="footer.showEmail" v-model="footer.email" label="Endereço de E-mail"
                            variant="outlined" density="compact" class="ml-8 mb-2"
                            placeholder="suporte@suaempresa.com" />
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
                    <VSwitch v-model="showAddressFields"
                        :label="showAddressFields ? 'Seção de endereço ativada' : 'Seção de endereço desativada'"
                        class="mt-2" />
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <p class="text-h6 mb-4">Layout do Resumo</p>
                <VSheet border rounded class="pa-4">
                    <VLabel class="mb-1">Posição do resumo do pedido</VLabel>
                    <VRadioGroup v-model="summaryPosition" class="mb-4">
                        <VRadio v-for="item in summaryOptions" :key="item.value" :label="item.title"
                            :value="item.value" />
                    </VRadioGroup>
                </VSheet>
                <p class="text-h6 mt-6 mb-4">Configurações</p>
                <VSheet border rounded class="pa-4">
                    <VCheckbox v-model="showCouponField" label="Exibir campo de cupom de desconto" />
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-h6 mb-0">Botões</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetAppearanceColors()">Resetar cor padrão
                    </VBtn>
                </div>
                <VSheet border rounded class="pa-4">
                    <p class="font-weight-medium mb-2">BOTÃO PRIMÁRIO (Ex: Concluir Pagamento)</p>
                    <p class="text-caption mb-4">Os botões primários são aqueles que realizam a ação principal da etapa.
                    </p>
                    <VLabel class="mb-1">Cor do botão</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.primaryButtonBg" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.primaryButtonBg, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.primaryButtonBg" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mb-1">Cor do texto</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.primaryButtonText" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.primaryButtonText, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.primaryButtonText" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VDivider class="my-4" />
                    <p class="font-weight-medium mb-2">BOTÃO DE NAVEGAÇÃO (Ex: Próximo)</p>
                    <VLabel class="mb-1">Cor do botão</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.navigationButtonBg" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.navigationButtonBg, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.navigationButtonBg" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mb-1">Cor do texto</VLabel>
                    <div class="d-flex align-center gap-x-2">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.navigationButtonText" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.navigationButtonText, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.navigationButtonText" variant="outlined" density="compact"
                            hide-details />
                    </div>
                </VSheet>
                <div class="d-flex justify-space-between align-center mt-6 mb-4">
                    <p class="text-h6 mb-0">Cores Gerais</p>
                </div>
                <VSheet border rounded class="pa-4">
                    <VLabel class="mb-1">Cor do fundo da página</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="backgroundColor" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: backgroundColor, width: '36px', height: '36px' }" />
                        <VTextField v-model="backgroundColor" variant="outlined" density="compact" hide-details />
                    </div>
                    <VLabel class="mb-1">Cor dos títulos</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.titles" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.titles, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.titles" variant="outlined" density="compact" hide-details />
                    </div>
                    <VLabel class="mb-1">Cor das descrições</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.descriptions" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.descriptions, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.descriptions" variant="outlined" density="compact"
                            hide-details />
                    </div>
                    <VLabel class="mb-1">Cor do valor total</VLabel>
                    <div class="d-flex align-center gap-x-2 mb-4">
                        <VMenu activator="parent" :close-on-content-click="false">
                            <VColorPicker v-model="themeColors.totalValue" />
                        </VMenu>
                        <div class="border rounded cursor-pointer"
                            :style="{ backgroundColor: themeColors.totalValue, width: '36px', height: '36px' }" />
                        <VTextField v-model="themeColors.totalValue" variant="outlined" density="compact"
                            hide-details />
                    </div>
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <p class="text-h6 mb-4">Notificações e Cupons</p>
                <VSheet border rounded class="pa-4">
                    <p class="text-subtitle-1 mb-2">Mini Chat de Notificação</p>
                    <p class="text-caption">Exibe uma pequena notificação de boas-vindas no canto da tela.</p>
                    <VSwitch v-model="miniChat.enabled" :label="miniChat.enabled ? 'Ativado' : 'Desativado'"
                        class="mt-2" />
                    <div v-if="miniChat.enabled">
                        <VLabel class="mt-4 mb-1">Mensagem de boas-vindas</VLabel>
                        <VTextarea v-model="miniChat.welcomeMessage" variant="outlined" rows="3"
                            placeholder="Ex: Olá! Use o cupom BEMVINDO10 para 10% OFF." />
                        <VLabel class="mt-4 mb-1">Cupom oferecido (opcional)</VLabel>
                        <VTextField v-model="miniChat.coupon" variant="outlined" density="compact"
                            placeholder="BEMVINDO10" />
                        <VDivider class="my-4" />
                        <p class="text-subtitle-1 mb-2">Mini Chat na Confirmação</p>
                        <VSwitch v-model="miniChat.showOnConfirmation"
                            :label="miniChat.showOnConfirmation ? 'Ativado na página de confirmação' : 'Desativado na página de confirmação'"
                            class="mt-2" />
                        <div v-if="miniChat.showOnConfirmation">
                            <VLabel class="mt-4 mb-1">Mensagem de confirmação (opcional)</VLabel>
                            <VTextarea v-model="miniChat.confirmationMessage" variant="outlined" rows="3"
                                placeholder="Ex: Obrigado pela compra!" />
                        </div>
                    </div>
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-h6 mb-0">Configurações de Pagamento</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetPaymentSettings()">Resetar</VBtn>
                </div>

                <VSheet border rounded class="pa-4 mb-6">
                    <p class="text-subtitle-1 mb-2">Métodos de Pagamento Disponíveis</p>
                    <div class="d-flex flex-column">
                        <VSwitch v-model="paymentSettings.allowedMethods.card" label="Cartão de Crédito" />
                        <VSwitch v-model="paymentSettings.allowedMethods.pix" label="PIX" />
                        <VSwitch v-model="paymentSettings.allowedMethods.boleto" label="Boleto" />
                    </div>
                </VSheet>

                <VSheet border rounded class="pa-4 mb-6">
                    <p class="text-subtitle-1 mb-2">Expiração do Checkout</p>
                    <VSwitch v-model="paymentSettings.checkoutExpiration.enabled"
                        :label="paymentSettings.checkoutExpiration.enabled ? 'Timer de expiração ativado' : 'Timer de expiração desativado'" />
                    <p class="text-caption">Quando ativado, o cliente terá um tempo limitado para concluir a compra.</p>
                    <div v-if="paymentSettings.checkoutExpiration.enabled" class="mt-4">
                        <VTextField v-model.number="paymentSettings.checkoutExpiration.durationMinutes"
                            label="Duração total (minutos)" type="number" variant="outlined" density="compact" />
                        <VTextField v-model.number="paymentSettings.checkoutExpiration.warningMinutes"
                            label="Avisar quando restar (minutos)" type="number" variant="outlined" density="compact"
                            class="mt-2" />
                    </div>
                </VSheet>

                <VSheet border rounded class="pa-4 mb-6">
                    <p class="text-subtitle-1 mb-2">Pagamento Dividido (Juros)</p>
                    <VTextField v-model.number="paymentSettings.installmentsMinParcelValue"
                        label="Valor mínimo por parcela" type="number" prefix="R$" variant="outlined" />
                    <p class="text-caption mt-2">O sistema de parcelamento só exibirá opções cuja parcela seja maior ou
                        igual a este valor.</p>
                </VSheet>

                <VSheet border rounded class="pa-4 mb-6">
                    <p class="text-subtitle-1 mb-2">Múltiplos Pagamentos</p>
                    <VSwitch v-model="paymentSettings.allowMultiPayments"
                        :label="paymentSettings.allowMultiPayments ? 'Ativado' : 'Desativado'" />
                    <p class="text-caption">Permite que o cliente pague com mais de um método.</p>
                    <VTextField v-if="paymentSettings.allowMultiPayments"
                        v-model.number="paymentSettings.multiPaymentsMinCardValue"
                        label="Valor mínimo de pagamento no cartão" type="number" prefix="R$" variant="outlined"
                        class="mt-4" />
                </VSheet>

                <VSheet border rounded class="pa-4">
                    <p class="text-subtitle-1 mb-2">Segurança e Rastreamento</p>
                    <VSwitch v-model="paymentSettings.captureIp"
                        :label="paymentSettings.captureIp ? 'Captura de IP ativada' : 'Captura de IP desativada'" />
                    <p class="text-caption">Captura o endereço de IP do comprador e o exibe nos detalhes do pedido.</p>
                </VSheet>
            </VWindowItem>

            <VWindowItem class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                    <p class="text-h6 mb-0">Meta Tags & Scripts</p>
                    <VBtn variant="text" size="small" @click="generatorStore.resetScripts()">Resetar</VBtn>
                </div>
                <VSheet border rounded class="pa-4 mb-6">
                    <p class="text-subtitle-1 mb-2">Google Tag Manager</p>
                    <VTextField v-model="scripts.googleTagManagerId" label="ID do Google Tag Manager" variant="outlined"
                        placeholder="GTM-XXXXXX" clearable />
                    <p class="text-caption mt-1">Insira o ID do seu contêiner do GTM. Ele será injetado no cabeçalho da
                        página.</p>
                </VSheet>
                <VSheet border rounded class="pa-4">
                    <p class="text-subtitle-1 mb-2">Facebook Pixel</p>
                    <VTextField v-model="scripts.facebookPixelId" label="ID do Pixel do Facebook" variant="outlined"
                        placeholder="123456789012345" clearable />
                    <p class="text-caption mt-1">Insira o ID do seu Pixel. O código base será adicionado à página.</p>
                </VSheet>
            </VWindowItem>

        </VWindow>

        <VDivider />
        <VCardActions class="pa-4">
            <VSpacer />
            <VBtn color="primary" variant="elevated" size="large" @click="saveConfiguration"
                :loading="isLoading || isLogoLoading">
                {{ isLoading ? 'Salvando...' : (isLogoLoading ? 'Processando Imagem...' : 'Salvar Configuração') }}
            </VBtn>
        </VCardActions>
    </VCard>
</template>