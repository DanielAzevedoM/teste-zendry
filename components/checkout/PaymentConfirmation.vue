// components/checkout/PaymentConfirmation.vue

<script setup>
import { ref, computed } from 'vue'
import CountdownTimer from '~/components/checkout/CountdownTimer.vue';

const props = defineProps({
 purchase: {
 type: Object,
 required: true,
 },
 status: {
 type: String,
 default: 'processing',
 },
 method: {
 type: String,
 required: true,
 },
 serverData: {
 type: Object,
 default: () => ({}),
 }
})

const nf = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtMoney = v => (v != null ? nf.format(v) : '-')

const u = props.purchase?.user || {}
const p = props.purchase?.payment || {}

const pixTimerMinutes = computed(() => {
 if (!props.serverData?.expiresAt) return 0;
 const diff = props.serverData.expiresAt - Date.now();
 return Math.max(0, diff / (1000 * 60));
});

function copyToClipboard(text, message) {
 if (text) {
 navigator.clipboard.writeText(text);
 alert(message);
 }
}

function copyPixCode() {
 copyToClipboard(props.serverData?.qrCode, 'Código PIX copiado para a área de transferência!');
}

function copyBoletoCode() {
 copyToClipboard(props.serverData?.linhaDigitavel, 'Linha digitável do boleto copiada!');
}
</script>

<template>
 <div>
 <div v-if="method === 'pix'" class="text-center mb-6">
 <v-sheet border rounded class="pa-4">
 <h4 class="text-h6 mb-2">Pague com PIX para concluir a compra</h4>
 <p class="text-body-2 mb-3">Aponte a câmera do seu celular para o QR Code abaixo ou utilize o código "copia e cola".</p>
 <v-img :src="serverData.qrCodeImage" max-width="220" class="mx-auto my-2 elevation-2 rounded" />
 
 <CountdownTimer 
 v-if="status === 'processing' && pixTimerMinutes > 0"
 :minutes="pixTimerMinutes" 
 countdown-text="Este código expira em:"
 class="my-3"
 />
 
 <v-text-field
 readonly
 :model-value="serverData.qrCode"
 label="PIX Copia e Cola"
 append-inner-icon="mdi-content-copy"
 @click:append-inner="copyPixCode"
 variant="outlined"
 class="mt-4"
 />
 </v-sheet>
 </div>

 <div v-if="method === 'boleto'" class="text-center mb-6">
 <v-sheet border rounded class="pa-4">
 <h4 class="text-h6 mb-2">Boleto Gerado com Sucesso!</h4>
 <p class="text-body-2 mb-3">A confirmação do pagamento pode levar até 2 dias úteis. Você pode pagar utilizando a linha digitável ou imprimindo o boleto.</p>
 
 <v-text-field
 readonly
 :model-value="serverData.linhaDigitavel"
 label="Linha Digitável"
 append-inner-icon="mdi-content-copy"
 @click:append-inner="copyBoletoCode"
 variant="outlined"
 class="mt-4"
 />
 
 <VBtn
 :href="serverData.boletoUrl"
 target="_blank"
 color="success"
 variant="elevated"
 size="large"
 block
 class="mt-3"
 >
 <VIcon icon="mdi-barcode-scan" start />
 Visualizar e Imprimir Boleto
 </VBtn>
 </v-sheet>
 </div>


 <v-alert
 :type="status === 'approved' ? 'success' : 'info'"
 variant="tonal"
 border="start"
 class="mb-4"
 >
 <template #default>
 <span v-if="status === 'approved'">Pagamento aprovado!</span>
 <span v-else>Aguardando confirmação do pagamento...</span>
 </template>
 </v-alert>

 <v-card variant="outlined">
 <v-card-title class="text-h6">
 {{ status === 'approved' ? 'Resumo da compra' : 'Dados da compra' }}
 </v-card-title>

 <v-card-text>
 <div class="mb-4">
 <div class="text-subtitle-2 mb-1">Usuário</div>
 <div>Nome: <strong>{{ u?.name || '-' }}</strong></div>
 <div>CPF: <strong>{{ u?.cpf || '-' }}</strong></div>
 <div>Email: <strong>{{ u?.email || '-' }}</strong></div>
 </div>

 <v-divider class="my-3" />

 <div>
 <div class="text-subtitle-2 mb-1">Pagamento</div>
 <div>ID: <strong>{{ p?.id || '-' }}</strong></div>
 <div>Tipo: <strong>{{ p?.method || '-' }}</strong></div>
 <div>Valor: <strong>{{ fmtMoney(p?.amount) }}</strong></div>
 <div>Desconto: <strong>{{ fmtMoney(p?.discount) }}</strong></div>
 <div>Total: <strong>{{ fmtMoney(p?.total) }}</strong></div>
 </div>
 </v-card-text>
 </v-card>
 </div>
</template>