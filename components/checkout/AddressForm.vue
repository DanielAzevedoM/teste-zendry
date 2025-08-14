<script setup>
import { Country, State } from 'country-state-city'
import { ref, watch, computed, onMounted } from 'vue'
import { buscarCep } from '~/services/cepService';

const props = defineProps({
  formData: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
})
const emit = defineEmits(['valid'])

const formData = props.formData

const onlyDigits = v => (v || '').toString().replace(/\D/g, '')

const rules = {
  required: label => v => (v ?? '').toString().trim() !== '' || `${label} é obrigatório`,
  len: (label, n) => v => onlyDigits(v).length === n || `${label} deve ter ${n} dígitos`,
  cepValido: async (v) => {
    const cep = onlyDigits(v);
    if (cep.length !== 8) return true;
    const dados = await buscarCep(cep);
    return dados ? true : 'CEP inválido ou não encontrado';
  },
}

const countryOptions = Country.getAllCountries().map(c => ({ name: c.name, code: c.isoCode }))
const stateOptions = computed(() => {
  const cc = formData.country
  if (!cc) return []
  return State.getStatesOfCountry(cc).map(s => ({ name: s.name, code: s.isoCode }))
})
watch(() => formData.country, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    formData.state = '';
  }
})

const formRef = ref(null)
const isFormValid = ref(false)
watch(isFormValid, v => emit('valid', !!v))

onMounted(() => {
  if (!formData.country) {
    formData.country = 'BR';
  }
});

watch(() => formData.zip, async (novoCep) => {
  const cep = (novoCep || '').replace(/\D/g, '');
  if (cep.length === 8) {
    try {
      const dados = await buscarCep(cep);
      if (dados) {
        formData.street = dados.street || '';
        formData.neighborhood = dados.neighborhood || '';
        formData.city = dados.city || '';
        formData.state = dados.state || '';
      }
    } catch (error) {
      console.error('Erro ao buscar CEP no formulário de endereço:', error);
    }
  }
});
</script>

<template>
  <VForm ref="formRef" v-model="isFormValid" validate-on="input" class="v-form-style mt-5">
    <p class="pb-5 text-h6">Endereço do pagamento:</p>
    <v-row class="">
      <v-col>
        <VTextField v-model="formData.zip" v-mask="'cep'" label="CEP*" variant="outlined" maxlength="9"
          :rules="[rules.required('CEP'), rules.len('CEP', 8), rules.cepValido]" />
      </v-col>
      <v-col>
        <VTextField v-model="formData.city" label="Cidade*" variant="outlined" :rules="[rules.required('Cidade')]" />
      </v-col>
    </v-row>
    <v-row class="mt-0 mb-1">
      <v-col>
        <VTextField v-model="formData.neighborhood" label="Bairro*" variant="outlined"
          :rules="[rules.required('Bairro')]" />
      </v-col>
      <v-col>
        <VTextField v-model="formData.complement" label="Complemento" variant="outlined" :rules="[]" />
      </v-col>
    </v-row>
    <VTextField class="mb-3" v-model="formData.street" label="Rua*" variant="outlined"
      :rules="[rules.required('Rua')]" />

    <v-row>
      <v-col cols="8">
        <VSelect v-model="formData.country" label="País/região*" :items="countryOptions" item-title="name"
          item-value="code" variant="outlined" density="comfortable" :rules="[rules.required('País/região')]" />
      </v-col>
      <v-col>
        <VSelect v-model="formData.state" label="Estado*" :items="stateOptions" item-title="name" item-value="code"
          :disabled="!formData.country || stateOptions.length === 0" variant="outlined" density="comfortable"
          :rules="formData.country ? [rules.required('Estado')] : []" />
      </v-col>
    </v-row>
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