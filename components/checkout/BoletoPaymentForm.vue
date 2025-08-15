<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true }
});
const emit = defineEmits(['update:modelValue', 'valid']);

const boleto = ref({ ...props.modelValue });
const formBoletoRef = ref(null);
const isBoletoFormValid = ref(false);

const rules = {
  required: v => !!(v || '').toString().trim() || 'Campo obrigatório',
  email: v => /^\S+@\S+\.\S+$/.test(String(v)) || 'E-mail inválido',
};

watch(boleto, (newVal) => {
  emit('update:modelValue', newVal);
}, { deep: true });

watch(isBoletoFormValid, (v) => emit('valid', !!v));
</script>

<template>
  <VForm ref="formBoletoRef" v-model="isBoletoFormValid" validate-on="blur">
    <v-text-field v-model="boleto.email" label="E-mail para envio do boleto*" :rules="[rules.required, rules.email]" variant="outlined" class="mb-3" />
    <v-alert variant="tonal">O boleto será gerado e você poderá abrir/baixar antes da compensação.</v-alert>
  </VForm>
</template>