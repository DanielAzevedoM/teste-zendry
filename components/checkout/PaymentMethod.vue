// MODIFICATION BASED ON: /home/daniel/Downloads/zendry-checkout/components/checkout/PaymentMethod.vue
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  couponCode: { type: String, default: '' },
})

const emit = defineEmits(['valid'])

// ------------------------------------------------------------------
// UI state
// ------------------------------------------------------------------
const method = ref(null) // 'card' | 'pix' | 'boleto'

// Campos de cartão (exemplo enxuto)
const card = ref({
  holderName: '',
  number: '',
  expiry: '',
  cvv: '',
})

// PIX não precisa de payload além do método
// Boleto opcional
const boleto = ref({
  email: '',
})

// ------------------------------------------------------------------
// Validação simples (apenas existência do essencial por método)
// ------------------------------------------------------------------
const isCardValid = computed(() => {
  if (method.value !== 'card') return false
  const c = card.value
  return !!(c.holderName && c.number && c.expiry && c.cvv)
})

const isPixValid = computed(() => method.value === 'pix') // sem campos extras

const isBoletoValid = computed(() => {
  if (method.value !== 'boleto') return false
  return !!boleto.value.email
})

const isValid = computed(() => {
  if (method.value === 'card') return isCardValid.value
  if (method.value === 'pix') return isPixValid.value
  if (method.value === 'boleto') return isBoletoValid.value
  return false
})

// emite pro pai sempre que mudar
watch([method, card, boleto], () => emit('valid', isValid.value), { deep: true, immediate: true })

// ------------------------------------------------------------------
// Payload por método (o back do seu flow decide o formato final)
// ------------------------------------------------------------------
function getPayload () {
  if (method.value === 'card') {
    const { holderName, number, expiry, cvv } = card.value
    return {
      method: 'card',
      card: { holderName, number, expiry, cvv },
    }
  }
  if (method.value === 'pix') {
    return { method: 'pix' }
  }
  if (method.value === 'boleto') {
    const { email } = boleto.value
    return { method: 'boleto', boleto: { email } }
  }
  return null
}

// ------------------------------------------------------------------
// Chamado pelo pai antes de concluir; pode rodar validações extras
// ------------------------------------------------------------------
async function concluirPagamento () {
  emit('valid', isValid.value)
  // se quiser, você pode exibir mensagens aqui antes de retornar false
  return isValid.value
}

// expõe para o pai
defineExpose({
  concluirPagamento,
  isValid,
  method,
  getPayload,
})
</script>

<template>
  <div>
    <h3 class="text-h6 mb-4">Escolha o método de pagamento</h3>

    <v-btn-toggle v-model="method" mandatory class="mb-6">
      <v-btn value="card">Cartão</v-btn>
      <v-btn value="pix">PIX</v-btn>
      <v-btn value="boleto">Boleto</v-btn>
    </v-btn-toggle>

    <!-- Cartão -->
    <div v-if="method === 'card'">
      <v-text-field
        v-model="card.holderName"
        label="Nome impresso no cartão"
        variant="outlined"
        class="mb-3"
      />
      <v-text-field
        v-model="card.number"
        label="Número do cartão"
        variant="outlined"
        class="mb-3"
        v-mask="'card'"
      />
      <div class="d-flex" style="gap:12px">
        <v-text-field
          v-model="card.expiry"
          label="Validade (MM/AA)"
          variant="outlined"
          v-mask="'expiry'"
          class="flex-grow-1"
        />
        <v-text-field
          v-model="card.cvv"
          label="CVV"
          variant="outlined"
          class="flex-grow-1"
        />
      </div>
    </div>

    <!-- PIX -->
    <div v-else-if="method === 'pix'">
      <v-alert variant="tonal">
        Pagamento instantâneo. Após confirmar, mostraremos o QR Code e aguardaremos a confirmação automática.
      </v-alert>
    </div>

    <!-- Boleto -->
    <div v-else-if="method === 'boleto'">
      <v-text-field
        v-model="boleto.email"
        label="E-mail para envio do boleto"
        variant="outlined"
        class="mb-3"
      />
      <v-alert variant="tonal">
        O boleto será gerado e você poderá abrir/baixar antes da compensação.
      </v-alert>
    </div>



  </div>
</template>
