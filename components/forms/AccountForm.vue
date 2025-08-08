<script setup>
import { Country, State } from 'country-state-city'
import { useAuthStore } from '~/stores/authStore'

const props = defineProps({
  formData: { type: Object, required: true }
})
const emit = defineEmits(['update:valid'])

const authStore = useAuthStore()
const formData = props.formData

// Helpers
const onlyDigits = v => (v || '').toString().replace(/\D/g, '')
function isValidCPF(cpf) {
  const s = onlyDigits(cpf)
  if (s.length !== 11) return false
  if (/^(\d)\1+$/.test(s)) return false
  const calc = base => {
    let sum = 0
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i]) * (base.length + 1 - i)
    const mod = (sum * 10) % 11
    return mod === 10 ? 0 : mod
  }
  const d1 = calc(s.slice(0, 9))
  const d2 = calc(s.slice(0, 10))
  return d1 === parseInt(s[9]) && d2 === parseInt(s[10])
}

// Rules com mensagens
const rules = {
  required: label => v => (v ?? '').toString().trim() !== '' || `${label} é obrigatório`,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'E-mail inválido',
  onlyDigits: label => v => /^\d+$/.test(onlyDigits(v)) || `${label} deve conter apenas números`,
  len: (label, n) => v => onlyDigits(v).length === n || `${label} deve ter ${n} dígitos`,
  lenBetween: (label, min, max) => v => {
    const d = onlyDigits(v).length
    return (d >= min && d <= max) || `${label} deve ter entre ${min} e ${max} dígitos`
  },
  cpf: v => (onlyDigits(v).length === 11 && isValidCPF(v)) || 'CPF inválido',
}

// Países/Estados
const countryOptions = Country.getAllCountries().map(c => ({ name: c.name, code: c.isoCode }))
const stateOptions = computed(() => {
  const cc = formData.address?.country
  if (!cc) return []
  return State.getStatesOfCountry(cc).map(s => ({ name: s.name, code: s.isoCode }))
})

watch(() => formData.address.country, () => {
  formData.address.state = ''
  formData.address.city = ''
})

// Validity up para o pai
const formRef1 = ref(null)
const formRef2 = ref(null)  
const isForm1Valid = ref(false)
const isForm2Valid = ref(false)

watch([isForm1Valid, isForm2Valid], () => {
  emit('update:valid', isForm1Valid.value && isForm2Valid.value)
})
</script>

<template>
  <!-- FORM 1 -->
  <VForm class="v-form-style mt-5" ref="formRef1" v-model="isForm1Valid" validate-on="input lazy">
    <v-row>
      <v-col cols="8">
        <p class="pt-5 pb-5">Informações da conta:</p>
      </v-col>
      <v-col v-if="!authStore.isAuthenticated">
        <p class="pt-5 pb-5">
          Você já tem uma conta?
          <span class="text-button-style">Entrar</span>
        </p>
      </v-col>
    </v-row>

    <VTextField
      v-model="formData.email"
      label="Email"
      variant="outlined"
      :rules="[rules.required('Email'), rules.email]"
    />

    <v-row class="pt-2">
      <v-col>
        <VTextField
          v-model="formData.cpf"
          label="CPF"
          variant="outlined"
          inputmode="numeric"
          :rules="[
            rules.required('CPF'),
            rules.onlyDigits('CPF'),
            rules.len('CPF', 11),
            rules.cpf
          ]"
        />
      </v-col>
      <v-col>
        <VTextField
          v-model="formData.phone"
          label="Número de telefone"
          variant="outlined"
          inputmode="numeric"
          :rules="[
            rules.required('Telefone'),
            rules.onlyDigits('Telefone'),
            rules.lenBetween('Telefone', 10, 11)
          ]"
        />
      </v-col>
    </v-row>

    <VTextField
    class="pt-2"
      v-model="formData.name"
      label="Nome completo"
      variant="outlined"
      :rules="[rules.required('Nome completo')]"
    />

    <VCheckbox v-model="formData.checkbox" :label="'Deseja receber notificações por email?'" />
  </VForm>

  <!-- FORM 2 -->
  <VForm class="v-form-style mt-5" ref="formRef2" v-model="isForm2Valid" validate-on="input lazy">
    <p class="pt-5 pb-5">Endereço do pagamento:</p>

    <v-row>
      <v-col cols="8">
        <VSelect
          v-model="formData.address.country"
          label="País/região"
          :items="countryOptions"
          item-title="name"
          item-value="code"
          variant="underlined"
          density="comfortable"
          :rules="[rules.required('País/região')]"
        />
      </v-col>
      <v-col>
        <VSelect
          v-model="formData.address.state"
          label="Estado"
          :items="stateOptions"
          item-title="name"
          item-value="code"
          :disabled="!formData.address.country || stateOptions.length === 0"
          variant="underlined"
          density="comfortable"
          :rules="[rules.required('Estado')]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <VTextField
          v-model="formData.address.zip"
          label="CEP"
          variant="outlined"
          inputmode="numeric"
          :rules="[
            rules.required('CEP'),
            rules.onlyDigits('CEP'),
            rules.len('CEP', 8)
          ]"
        />
      </v-col>
      <v-col>
        <VTextField
          v-model="formData.address.city"
          label="Cidade"
          variant="outlined"
          :rules="[rules.required('Cidade')]"
        />
      </v-col>
      <v-col>
        <VTextField
          v-model="formData.address.neighborhood"
          label="Bairro"
          variant="outlined"
          :rules="[rules.required('Bairro')]"
        />
      </v-col>
      <v-col>
        <VTextField
          v-model="formData.address.complement"
          label="Complemento"
          variant="outlined"
          :rules="[]"
        />
      </v-col>
    </v-row>

    <VTextField
      v-model="formData.address.street"
      label="Rua"
      variant="outlined"
      :rules="[rules.required('Rua')]"
    />
  </VForm>
</template>

<style scoped>
.text-button-style {
  text-transform: none;
  color: #0066cc;
  cursor: pointer;
  font-weight: 500;
  background-color: transparent;
}
</style>
