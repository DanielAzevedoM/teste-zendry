<script setup>
import { ref } from 'vue';
import { useGeneratorStore } from '~/stores/generatorStore';

const generatorStore = useGeneratorStore();
const { newsletter } = generatorStore;

const email = ref('');
const isSubmitted = ref(false);

function subscribe() {
  if (email.value) {
    console.log(`Email para newsletter: ${email.value}`);
    isSubmitted.value = true;
   
  }
}
</script>

<template>
  <VDialog :model-value="true" persistent max-width="500px">
    <VCard>
      <VCardTitle class="text-h5 text-center pt-4">{{ isSubmitted ? 'Obrigado!' : newsletter.title }}</VCardTitle>
      <VCardText class="text-center">
        <div v-if="!isSubmitted">
          <p>{{ newsletter.subtitle }}</p>
          <VTextField
            v-model="email"
            label="Seu melhor e-mail"
            variant="outlined"
            class="mt-4"
            type="email"
          />
        </div>
        <p v-else>Inscrição realizada com sucesso!</p>
      </VCardText>
      <VCardActions class="pb-4">
        <VSpacer />
        <VBtn v-if="!isSubmitted" color="primary" variant="elevated" @click="subscribe">{{ newsletter.buttonText }}</VBtn>
        <VBtn color="secondary" variant="text" @click="$emit('close')">
          {{ isSubmitted ? 'Fechar' : 'Não, obrigado' }}
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>