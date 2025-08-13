<script setup>
import SettingsCard from '~/components/generator/SettingsCard.vue';
import CheckoutPreview from '~/components/generator/CheckoutPreview.vue';
</script>

<template>
  <VContainer fluid class="generator-page">

    <VRow class="main-content-row">
      <VCol md="4" sm="12" class="settings-col">
        
        <SettingsCard />
      </VCol>

      <VCol md="8" sm="12" class="preview-col">
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
/* Trava a página inteira e a organiza em uma coluna flexível */
.generator-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Ocupa 100% da altura da tela */
  overflow: hidden;
  /* Esconde o scroll da página principal */
  padding: 0;
}

/* Garante que a área de botões não encolha */
.header-actions {
  flex-shrink: 0;
}

/* Faz a linha principal (com as duas colunas) crescer para ocupar o espaço restante */
.main-content-row {
  flex-grow: 1;
  min-height: 0;
  /* Correção para flexbox em alguns navegadores */
}

/* Coluna de configurações agora tem altura definida pelo container e pode scrollar */
.settings-col {
  height: 100%;
  overflow-y: auto;
  /* Scroll apenas nesta coluna */
  padding: 0 1rem 1rem 1rem;
}

/* Centraliza o container do preview na coluna da direita */
.preview-col {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Container do preview com altura reduzida */
.preview-container {
  width: 100%;
  max-width: 950px;
  height: 95%;
  /* Altura reduzida para 95% da coluna */

  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: rgb(228, 228, 228);
  padding: 12px;

  display: flex;
}

/* Conteúdo interno do preview com scroll próprio */
.preview-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  /* Scroll apenas dentro do preview */
  border-radius: 6px;
}

/* Estilos de scroll discretos (mantidos da solicitação anterior) */
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