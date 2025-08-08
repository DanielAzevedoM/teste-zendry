// MODIFICATION BASED ON: /home/daniel/Downloads/zendry-checkout/pages/checkout/[id].vue
<script setup>
import AppStepper from '~/@core/components/AppStepper.vue'
import AccountForm from '@/components/checkout/AccountForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PaymentMethod from '@/components/checkout/PaymentMethod.vue'
import PurchaseStatusCard from '@/components/checkout/PaymentConfirmation.vue'
// Mantive os imports existentes para não quebrar nada do seu projeto


import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCheckout } from '@/composables/useCheckout'
import { useCoupon } from '@/composables/useCoupon'

definePageMeta({ middleware: 'check-payment-exists' })

const route = useRoute()
const router = useRouter()

const {
  currentStep, steps,
  step1Valid, step2Valid,
  formData, payment,
  next, prev, loadPayment,
  start, method, status, processing, serverData, setStep, // fluxo do Passo 4 (cria pagamento + dispara WS)
} = useCheckout()

await loadPayment(route.params.id)

// apenas o código do cupom no front; o desconto final vem do back
const { couponCode } = useCoupon()

const paymentRef = ref(null)

// guarda os dados que você quer ver no card
const purchase = ref(null)

// formatação simples em BRL
const nf = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// ---------------------------------------------------------------------------
// Concluir Pagamento — envia somente os dados solicitados
// (cpf, nome, email) + (id, amount, discount, total) e guarda em `purchase`
// ---------------------------------------------------------------------------
async function concluirPagamento () {
  if (!step2Valid.value) return

  let childOk = true
  try {
    if (paymentRef.value?.concluirPagamento) {
      childOk = await paymentRef.value.concluirPagamento()
    }
  } catch { /* ignore */ }
  if (childOk === false) return

  const rawIsValid = paymentRef.value?.isValid?.value
  const rawMethod  = paymentRef.value?.method?.value
  const payload    = paymentRef.value?.getPayload?.()

  const selectedMethod = rawMethod ?? payload?.method ?? payload?.type
  const isValid = (typeof rawIsValid === 'boolean') ? rawIsValid : !!childOk

  if (!payload || !selectedMethod || !isValid) return

  // Somente os campos solicitados
  const purchaseData = {
    user: {
      cpf: formData.cpf,
      name: formData.name,
      email: formData.email,
    },
    payment: {
      id: payment.value?.id,
        method: selectedMethod, //
      amount: payment.value?.amount,
      discount: payment.value?.discount,
      total: payment.value?.total,
    },
  }

  // salva localmente para renderizar no Step 2
  purchase.value = purchaseData

  // dispara o fluxo no back + WS
  await start(route.params.id, selectedMethod, {
    ...payload,
    couponCode: couponCode.value,
    purchase: purchaseData,
  })

  // exibe a área de confirmação dentro do mesmo layout
  setStep?.(2)
}

// Quando o WS aprovar, garantimos que o step 2 esteja visível para mostrar o sucesso
watch(status, (val) => {
  if (val === 'approved' && currentStep.value !== 2) {
    setStep?.(2)
  }
})
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0">
      <v-col :cols="12" :md="currentStep < 2 ? 7 : 12" class="pa-0" style="background:#fff;height:100vh">
        <v-container class="pa-0" style="max-width:49rem">
          <v-container class="px-4">
            <AppStepper
              class="mt-6"
              :items="steps"
              :current-step="currentStep"
              :is-active-step-valid="true"
            />

            <!-- STEP 0: Dados da conta -->
            <AccountForm
              v-if="currentStep === 0"
              :form-data="formData"
              @valid-step1="val => step1Valid = val"
              @valid-step2="val => step2Valid = val"
            />

            <!-- STEP 1: Método de pagamento -->
            <PaymentMethod
              v-if="currentStep === 1"
              ref="paymentRef"
              class="mt-10"
              :coupon-code="couponCode"
              @valid="val => step2Valid = val"
            />

            <PurchaseStatusCard
                v-if="currentStep === 2"
                class="mt-5"
                :purchase="purchase"
                :status="status"
            />


           
            <!-- Ações -->
            <v-container class="d-flex pa-0">
              <span v-if="currentStep>0 && currentStep<2" class="text-button-style pt-5" @click="prev">
                <v-icon size="18" class="mb-1">mdi-chevron-left</v-icon> Voltar
              </span>
              <v-spacer />
              <v-btn
                v-if="currentStep < 1"
                class="mt-5"
                color="primary"
                @click="next"
                :disabled="!(currentStep===0 ? step1Valid : step2Valid)"
              >
                Próximo
              </v-btn>
              <v-btn
                v-if="currentStep === 1"
                class="mt-5"
                color="primary"
                :disabled="!step2Valid"
                @click="concluirPagamento"
              >
                Concluir Pagamento
              </v-btn>
            </v-container>
          </v-container>
        </v-container>
      </v-col>

      <!-- Coluna direita some no step 2 -->
      <v-col v-if="currentStep < 2" cols="12" md="5" class="pa-0" style="background:#d8d8e6;height:100vh;">
        <OrderSummary
          v-if="payment"
          :amount="payment.amount"
          :discount="payment.discount"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-button-style{
  text-transform:none;
  color:#06c;
  cursor:pointer;
  font-weight:500;
  background:transparent
}
</style>
