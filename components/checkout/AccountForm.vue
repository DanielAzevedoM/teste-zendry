// components/checkout/AccountForm.vue

<script setup>
import { useAuthStore } from '~/stores/authStore'
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
})
const emit = defineEmits(['valid'])

const authStore = useAuthStore()
const formData = props.formData

const onlyDigits = v => (v || '').toString().replace(/\D/g, '')
const digitsMax = (v, max) => onlyDigits(String(v ?? '')).slice(0, max)
const countLetters = v => (String(v || '').match(/[A-Za-zÀ-ÿ]/g) || []).length

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

const rules = {
  required: label => v => (v ?? '').toString().trim() !== '' || `${label} é obrigatório`,
  email: v => /^\S+@\S+\.\S+$/.test(String(v)) || 'E-mail inválido',
  onlyDigits: label => v => /^\d+$/.test(onlyDigits(v)) || `${label} deve conter apenas números`,
  len: (label, n) => v => onlyDigits(v).length === n || `${label} deve ter ${n} dígitos`,
  lenBetween: (label, min, max) => v => {
    const d = onlyDigits(v).length
    return (d >= min && d <= max) || `${label} deve ter entre ${min} e ${max} dígitos`
  },
  cpf: v => (onlyDigits(v).length === 11 && isValidCPF(v)) || 'CPF inválido',
  minLetters: n => v => countLetters(v) >= n || `Nome precisa de pelo menos ${n} letras`,
}

const formRef = ref(null)
const isFormValid = ref(false)

watch(isFormValid, v => emit('valid', !!v))

onMounted(() => {
  // Valida o formulário assim que ele é montado
  setTimeout(() => formRef.value?.validate(), 100);
})

watch(() => props.isActive, (isActive) => {
  if (isActive) {
    setTimeout(() => {
      formRef.value?.validate();
    }, 100);
  }
});
</script>

<template>
  <VForm ref="formRef" v-model="isFormValid" validate-on="input" class="v-form-style mt-5">
    <v-row>
      <v-col cols="7">
        <p class="pt-5 pb-5 text-h6">Informações da conta:</p>
      </v-col>
      <v-col v-if="!authStore.isAuthenticated">
        <p class="pt-5 pb-5">
          Você já tem uma conta?
          <span class="text-button-style">Entrar</span>
        </p>
      </v-col>
    </v-row>

    <VTextField v-model="formData.email" label="Email" variant="outlined"
      :rules="[rules.required('Email'), rules.email]" />

    <v-row class="pt-2">
      <v-col>
        <VTextField v-model="formData.cpf" v-mask="'cpf'" label="CPF" variant="outlined" maxlength="14"
          :rules="[rules.required('CPF'), rules.onlyDigits('CPF'), rules.len('CPF', 11), rules.cpf]" />
      </v-col>
      <v-col>
        <VTextField v-model="formData.phone" label="Número de telefone" v-mask="'phone'" variant="outlined" type="tel"
          inputmode="numeric" :maxlength="15" @update:model-value="val => formData.phone = digitsMax(val, 15)" :rules="[
            rules.required('Telefone'),
            rules.onlyDigits('Telefone'),
            rules.lenBetween('Telefone', 10, 11)
          ]" />
      </v-col>
    </v-row>

    <VTextField class="pt-2" v-model="formData.name" label="Nome completo" variant="outlined" :rules="[
      rules.required('Nome completo'),
      rules.minLetters(10)
    ]" />

    <VCheckbox v-model="formData.checkbox" :label="'Deseja receber notificações por email?'" />
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