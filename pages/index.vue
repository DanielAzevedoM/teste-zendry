<script setup>
import SettingsCard from '~/components/generator/SettingsCard.vue';
import CheckoutPreview from '~/components/generator/CheckoutPreview.vue';

useHead({
  title: 'Gerador'
});
</script>

<template>
  <VContainer fluid class="generator-page pa-0">
    <VRow class="main-content-row ma-0">
      

      <VCol md="5" cols="12" class="settings-col pa-4">
         <div class="d-flex justify-center flex-wrap align-center mb-6" style="gap: 0.5rem;">
         <NuxtLink to="/configs">
        <VBtn class="mx-2" color="teal">Configurações</VBtn>
      </NuxtLink>
      <NuxtLink to="/orders">
        <VBtn class="mx-2" color="indigo">Ver Pedidos</VBtn>
      </NuxtLink>
      <NuxtLink to="/admin">
        <VBtn class="mx-2" color="green">Painel de Confirmação</VBtn>
      </NuxtLink>
        </div>
        <SettingsCard />
      </VCol>

      <VCol md="7" cols="12" class="preview-col pa-4">
       
        <div class="preview-container">
          <div class="preview-content">
            <CheckoutPreview />
          </div>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
/*
  --- ESTILOS CORRIGIDOS PARA RESPONSIVIDADE ---
*/

.generator-page {
  /* Garante que a página ocupe no mínimo a altura da tela, mas permite crescer e rolar */
  min-height: 100vh;
 
}

/* Em telas de celular/tablet, as colunas terão altura automática */
.settings-col,
.preview-col {
  height: auto;
}

.preview-container {
  width: 100%;
  max-width: 950px;
  margin: 0 auto; /* Centraliza a prévia */
  height: 100%;
  min-height: 720px; /* Garante uma altura mínima para a prévia */
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden; /* Mantém o conteúdo dentro do container arredondado */
}

.preview-content {
  width: 100%;
  height: 100%;
  overflow-y: auto; /* Rolagem interna apenas para o conteúdo da prévia */
}


/* --- Estilos para Desktop (telas médias e maiores) --- */
@media (min-width: 960px) {
  .generator-page {
    /* Em desktop, travamos a altura e escondemos a rolagem da página */
    height: 100vh;
    overflow: hidden;
  }

  .main-content-row {
    height: 100%;
  }

  /* Em desktop, as colunas voltam a ter altura total com rolagem interna */
  .settings-col,
  .preview-col {
    height: 100%;
    overflow-y: auto;
  }

  .preview-container {
    height: 95%; /* Mantém o estilo original para desktop */
  }
}

/* Estilos da barra de rolagem para um visual mais limpo */
.settings-col::-webkit-scrollbar,
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.settings-col::-webkit-scrollbar-track,
.preview-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-col::-webkit-scrollbar-thumb,
.preview-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.settings-col::-webkit-scrollbar-thumb:hover,
.preview-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>