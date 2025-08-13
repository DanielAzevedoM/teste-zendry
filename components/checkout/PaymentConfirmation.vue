<script setup>
import { computed } from 'vue'
import CountdownTimer from '~/components/checkout/CountdownTimer.vue';

const props = defineProps({
 purchase: {
  type: Object,
  required: true,
 },
 status: {
  type: String,
  default: 'processing',
 }
})

const nf = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtMoney = v => (v != null ? nf.format(v) : '-')

const u = computed(() => props.purchase?.user || {});
const p = computed(() => props.purchase?.payment || {});
const transactions = computed(() => props.purchase?.transactions || []);

const pixTransaction = computed(() => transactions.value.find(t => t.method === 'pix'));
const boletoTransaction = computed(() => transactions.value.find(t => t.method === 'boleto'));

const pixTimerMinutes = computed(() => {
 if (!pixTransaction.value?.serverData?.expiresAt) return 0;
 const diff = pixTransaction.value.serverData.expiresAt - Date.now();
 return Math.max(0, diff / (1000 * 60));
});

function copyToClipboard(text, message) {
 if (text) {
  navigator.clipboard.writeText(text);
  alert(message);
 }
}

function copyPixCode() {
 copyToClipboard(pixTransaction.value?.serverData?.qrCode, 'Código PIX copiado para a área de transferência!');
}

function copyBoletoCode() {
 copyToClipboard(boletoTransaction.value?.serverData?.linhaDigitavel, 'Linha digitável do boleto copiada!');
}
</script>

<template>
 <div>
  <div class="d-flex flex-column ga-6 mb-6">
    <div v-if="pixTransaction" class="text-center">
      <v-sheet border rounded class="pa-4">
        <h4 class="text-h6 mb-2">Pague com PIX ({{ fmtMoney(pixTransaction.amount) }})</h4>
        <p class="text-body-2 mb-3">Aponte a câmera do seu celular para o QR Code abaixo ou utilize o código "copia e cola".</p>
        
        <v-img 
          v-if="pixTransaction.serverData.qrCodeImage"
          :src="pixTransaction.serverData.qrCodeImage" 
          width="220"
          height="220"
          class="mx-auto my-2 elevation-2 rounded" 
        />
        
        <CountdownTimer 
          v-if="status === 'processing' && pixTimerMinutes > 0"
          :minutes="pixTimerMinutes" 
          countdown-text="Este código expira em:"
          class="my-3"
        />
        
        <v-text-field
          readonly
          :model-value="pixTransaction.serverData.qrCode"
          label="PIX Copia e Cola"
          append-inner-icon="mdi-content-copy"
          @click:append-inner="copyPixCode"
          variant="outlined"
          class="mt-4"
        />
      </v-sheet>
    </div>

    <div v-if="boletoTransaction" class="text-center">
      <v-sheet border rounded class="pa-4">
        <h4 class="text-h6 mb-2">Pague o Boleto ({{ fmtMoney(boletoTransaction.amount) }})</h4>
        <p class="text-body-2 mb-3">A confirmação do pagamento pode levar até 2 dias úteis.</p>
        
        <v-text-field
          readonly
          :model-value="boletoTransaction.serverData.linhaDigitavel"
          label="Linha Digitável"
          append-inner-icon="mdi-content-copy"
          @click:append-inner="copyBoletoCode"
          variant="outlined"
          class="mt-4"
        />
        
        <VBtn
          :href="boletoTransaction.serverData.boletoUrl"
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
  </div>

  <v-alert
   :type="status === 'approved' ? 'success' : 'info'"
   variant="tonal"
   border="start"
   class="mb-4"
  >
   <template #default>
    <span v-if="status === 'approved'">Pagamento aprovado! Obrigado por sua compra.</span>
    <span v-else>Aguardando confirmação do pagamento...</span>
   </template>
  </v-alert>

  <v-card variant="outlined">
   <v-card-title class="text-h6">
    {{ status === 'approved' ? 'Resumo da compra' : 'Dados da compra' }}
   </v-card-title>
   <v-card-text>
    <div class="mb-4">
     <div class="text-subtitle-2 mb-1">Cliente</div>
     <div>Nome: <strong>{{ u.name || '-' }}</strong></div>
     <div>Email: <strong>{{ u.email || '-' }}</strong></div>
    </div>
    <v-divider class="my-3" />
    <div>
     <div class="text-subtitle-2 mb-1">Pagamento</div>
     <div>Pedido ID: <strong>{{ p.id || '-' }}</strong></div>
     <div>Valor: <strong>{{ fmtMoney(p.amount) }}</strong></div>
     <div v-if="p.discount > 0">Desconto: <strong>{{ fmtMoney(p.discount) }}</strong></div>
     <div v-if="p.couponDiscount > 0">Desconto cupom: <strong>{{ fmtMoney(p.couponDiscount) }}</strong></div>
     <v-divider class="my-2" />
     <div>Total: <strong class="text-success">{{ fmtMoney(p.total) }}</strong></div>
     <div v-if="p.ipAddress">IP do Pagamento: <strong>{{ p.ipAddress }}</strong></div>
    </div>
   </v-card-text>
  </v-card>
 </div>
</template>