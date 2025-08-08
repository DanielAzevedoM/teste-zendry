<script setup>
import AppStepper from '~/@core/components/AppStepper.vue';
import AccountForm from '~/components/forms/AccountForm.vue';
import { useRoute } from 'vue-router';
import { buscarCep } from '~/services/cepService';
import { userMe } from '~/services/userService';
import { getPaymentById } from '~/services/paymentService';
import { cupons } from '~/utils/fakeApi/mock-data';

definePageMeta({
  middleware: 'check-payment-exists', // chama /middleware/check-payment.js
  layout: 'checkout' // opcional, define layout diferente
})

const route = useRoute()
const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const userData = userMe()
const paymentData = await getPaymentById(route.params.id)

const couponCode = ref('')
const discountValue = ref(paymentData.data.discount) 

const steps = [
  { title: 'Detalhes da conta', subtitle: 'Conta' },
  { title: 'Meio de pagamento', subtitle: 'Pagamento' },
  { title: 'Confirmação do pagamento', subtitle: 'Confirmação' },
];

const formData = reactive({
  name: userData ? userData.name : '',
  email: userData ? userData.email : '',
  cpf: userData ? userData.cpf : '',
  phone: userData ? userData.phone : '',
  address: {
    city: userData ? userData.address.city : '',
    state: userData ? userData.address.state : '',
    country: userData ? userData.address.country : '',
    zip: userData ? userData.address.zip : '',
    neighborhood: userData ? userData.address.neighborhood : '',
    complement: userData ? userData.address.complement : '',
    street: userData ? userData.address.street : '',
  },
  checkbox: userData ? userData.checkbox : false,
})

watch(couponCode, (newCode) => {
  const found = cupons.find(c => c.code.toLowerCase() === newCode.toLowerCase())
  if (found) {
    discountValue.value = found.discount
  } else {
    discountValue.value = 0
  }
})

watch(() => formData.address.zip, async (novoCep) => {
  if (novoCep && novoCep.length === 8) {
    const dados = await buscarCep(novoCep)
    if (dados) {
      formData.address.street = dados.street
      formData.address.neighborhood = dados.neighborhood
      formData.address.city = dados.city
      formData.address.state = dados.state
    }
  }
})

watch(currentStep, (newStep) => {
  if (newStep < 0) {
    currentStep.value = 0; 
    isCurrentStepValid.value = true;
  } else if (newStep > 2) {
    currentStep.value = 2; 
    isCurrentStepValid.value = true;
  }
});



</script>

<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0">
      <v-col cols="12" md="7" class="pa-0" style="background-color: white; height: 100vh">
        <v-container class="pa-0" style="max-width: 49rem;">
          <v-container class="px-4">
            <AppStepper
              class="mt-6"
              :items="steps"
              :current-step="currentStep"
              :is-active-step-valid="isCurrentStepValid"
            />

            <AccountForm v-if="currentStep === 0" :form-data="formData" />

            <v-container class="d-flex pa-0">
              <span
                v-if="currentStep > 0 && currentStep < 2"
                class="text-button-style pt-5"
                @click="currentStep--"
              >
                <v-icon size="18" class="mb-1">mdi-chevron-left</v-icon> Voltar
              </span>

              <v-spacer />

              <v-btn
                v-if="currentStep < 1"
                class="mt-5"
                color="primary"
                @click="currentStep++"
                :disabled="!isCurrentStepValid"
              >
                Próximo
              </v-btn>

              <v-btn
                v-if="currentStep == 1"
                class="mt-5"
                color="primary"
                @click="currentStep++"
                :disabled="!isCurrentStepValid"
              >
                Concluir Pagamento
              </v-btn>
            </v-container>
          </v-container>
        </v-container>
      </v-col>

      <!-- COLUNA DO RESUMO: 12 no mobile, 5 no >= md -->
      <v-col cols="12" md="5" class="pa-0" style="background: rgb(216, 216, 230); height: 100vh;">
        <v-container class="px-4 py-6" style="max-width: 24rem;">
         
          <VTextField
            v-model="couponCode"
            class="pt-5 cupom-input-style"
            label="Cupom"
            variant="outlined"
            />

          <v-row class="pt-5">
            <v-col><p>Valor:</p></v-col>
            <v-col class="text-right"><p>R$ {{ paymentData.data.amount }}</p></v-col>
          </v-row>

            <v-row class="px-1 mt-0">
                <v-col><p>Desconto:</p></v-col>
                <v-col class="text-right"><p>R$ {{ discountValue }}</p></v-col>
            </v-row>

          <v-divider class="my-4" />

          <v-row class="px-1">
            <v-col><p>Valor a pagar:</p></v-col>
            <v-col class="text-right"><h2>R$ {{ paymentData.data.amount - discountValue }}</h2></v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

   
<style scoped>



.paymentData-container {
    max-width: 24vw;
    margin-top: 5vh;
}

.cupom-input-style{

  border-bottom: 1px solid gray; border-top: 1px solid gray;
}

.text-button-style {
    text-transform: none;
    color: #0066cc;
    cursor: pointer;
    font-weight: 500;
    background-color: transparent;
}
</style>