<script setup>
import { ref, computed, watch } from 'vue'
import { useCardBrand } from '@/composables/useCardBrand'
import { onlyDigits, luhnValid } from '@/utils/cardBrand'

const props = defineProps({
  couponCode: { type: String, default: '' },
})

const emit = defineEmits(['valid'])

const { getBrand, brandIcon } = useCardBrand()

const method = ref('card')

// --- Lógica do Cartão de Crédito ---
const formCardRef = ref(null)
const isCardFormValid = ref(false)
const card = ref({
  holderName: '',
  number: '',
  expiry: '',
  cvv: '',
})

const cardBrand = computed(() => getBrand(card.value.number))
const cardBrandIcon = computed(() => brandIcon(cardBrand.value))

// --- Lógica do Boleto ---
const boleto = ref({
  email: '',
})

// --- Regras de Validação ---
const rules = {
  required: v => !!(v || '').trim() || 'Campo obrigatório',
  cardHolder: v => (v || '').trim().includes(' ') || 'Digite o nome completo como no cartão',
  cardNumber: v => {
    const digits = onlyDigits(v)
    if (digits.length < 13 || digits.length > 19) return 'Número de cartão inválido'
    return luhnValid(digits) || 'Número de cartão inválido'
  },
  expiryDate: v => {
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(v)) return 'Data inválida (MM/AA)'
    const [monthStr, yearStr] = v.split('/')
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (month < 1 || month > 12) return 'Mês inválido'
    if (year < currentYear || (year === currentYear && month < currentMonth)) return 'Cartão expirado'
    return true
  },
  cvv: v => {
    const digits = onlyDigits(v)
    return (digits.length >= 3 && digits.length <= 4) || 'CVV inválido'
  },
  email: v => /^\S+@\S+\.\S+$/.test(String(v)) || 'E-mail inválido',
}

// --- Validação Geral ---
const isCardValid = computed(() => method.value === 'card' ? isCardFormValid.value : false)
const isPixValid = computed(() => method.value === 'pix')
const isBoletoValid = computed(() => method.value === 'boleto' ? !!boleto.value.email : false) // Simplificado

const isValid = computed(() => {
  if (method.value === 'card') return isCardValid.value
  if (method.value === 'pix') return isPixValid.value
  if (method.value === 'boleto') return isBoletoValid.value
  return false
})

watch([method, card, boleto, isCardFormValid], () => emit('valid', isValid.value), { deep: true, immediate: true })

// --- Funções Expostas ---
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

async function concluirPagamento () {
  if (method.value === 'card') {
    const { valid } = await formCardRef.value.validate()
    return valid
  }
  emit('valid', isValid.value)
  return isValid.value
}

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

 <div v-if="method === 'card'">
      <VForm ref="formCardRef" v-model="isCardFormValid" validate-on="input">
        <v-text-field
          v-model="card.holderName"
          label="Nome impresso no cartão"
          variant="outlined"
          class="mb-3"
          :rules="[rules.required, rules.cardHolder]"
        />
        <v-text-field
          v-model="card.number"
          label="Número do cartão"
          variant="outlined"
          class="mb-3"
          v-mask="'card'"
          :rules="[rules.required, rules.cardNumber]"
        >
          <template #append-inner>
            <VIcon v-if="cardBrand" :icon="cardBrandIcon" />
          </template>
        </v-text-field>
        <div class="d-flex" style="gap:12px">
          <v-text-field
            v-model="card.expiry"
            label="Validade (MM/AA)"
            variant="outlined"
            v-mask="'expiry'"
            class="flex-grow-1"
            placeholder="MM/AA"
            :rules="[rules.required, rules.expiryDate]"
          />
          <v-text-field
            v-model="card.cvv"
            label="CVV"
            variant="outlined"
            class="flex-grow-1"
            maxlength="4"
            :rules="[rules.required, rules.cvv]"
          />
        </div>
      </VForm>
 </div>

 <div v-else-if="method === 'pix'">
 <v-alert variant="tonal">
 Pagamento instantâneo. Após confirmar, mostraremos o QR Code e aguardaremos a confirmação automática.
 </v-alert>
 </div>

 <div v-else-if="method === 'boleto'">
 <v-text-field
 v-model="boleto.email"
 label="E-mail para envio do boleto"
 variant="outlined"
 class="mb-3"
 :rules="[rules.required, rules.email]"
 />
 <v-alert variant="tonal">
 O boleto será gerado e você poderá abrir/baixar antes da compensação.
 </v-alert>
 </div>
 </div>
</template>