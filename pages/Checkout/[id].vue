<script setup>
import AppStepper from '~/@core/components/AppStepper.vue'
import AccountForm from '@/components/checkout/AccountForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import PaymentMethod from '@/components/checkout/PaymentMethod.vue'

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
  start,                    // << do Passo 4
} = useCheckout()

await loadPayment(route.params.id)

// só o código do cupom no front; desconto vem no payment do back
const { couponCode } = useCoupon()

const paymentRef = ref(null)

async function concluirPagamento () {
  // valida step atual de pagamento
  if (!step2Valid.value) return

  // pega dados do filho
  const isValid = paymentRef.value?.isValid?.value
  const method = paymentRef.value?.method?.value
  const payload = paymentRef.value?.getPayload?.()

  if (!isValid || !method || !payload) return

  // chama o flow (back calcula desconto / retorna dados / dispara websocket)
  await start(route.params.id, method, { ...payload, couponCode: couponCode.value })

  // vai pra tela de confirmação
  router.push(`/checkout/${route.params.id}/confirm`)
}
</script>


<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0">
      <v-col cols="12" md="7" class="pa-0" style="background:#fff;height:100vh">
        <v-container class="pa-0" style="max-width:49rem">
          <v-container class="px-4">
            <AppStepper
              class="mt-6"
              :items="steps"
              :current-step="currentStep"
              :is-active-step-valid="true"
            />

            <AccountForm
              v-if="currentStep === 0"
              :form-data="formData"
              @valid-step1="val => step1Valid = val"
              @valid-step2="val => step2Valid = val"
            />

            <PaymentMethod
                v-if="currentStep === 1"
                ref="paymentRef"
                class="mt-10"
                :coupon-code="couponCode"
                @valid="val => step2Valid = val"
                />

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
                @click="paymentRef?.concluirPagamento?.()"
                >
                Concluir Pagamento
                </v-btn>
            </v-container>
          </v-container>
        </v-container>
      </v-col>

      <v-col cols="12" md="5" class="pa-0" style="background:#d8d8e6;height:100vh;">
        
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
.text-button-style{ text-transform:none;color:#06c;cursor:pointer;font-weight:500;background:transparent }
</style>
