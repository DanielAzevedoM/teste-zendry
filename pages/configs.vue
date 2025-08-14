<script setup>
import { ref, onMounted } from 'vue';
import { useDisplay } from 'vuetify'; // Importa o composable de display
import { getConfigs, deleteConfig } from '~/services/configService';

useHead({
  title: 'Configurações de checkout'
});

// Lógica para responsividade
const { mdAndUp } = useDisplay();

const configs = ref([]);
const isLoading = ref(true);

const isDeleteDialogOpen = ref(false);
const configToDelete = ref(null);

const headers = [
  { title: 'Nome da Configuração', key: 'name', width: '35%' },
  { title: 'ID', key: 'id', width: '35%' },
  { title: 'Template', key: 'template' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];

async function fetchData() {
  isLoading.value = true;
  try {
    configs.value = await getConfigs();
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    alert('Não foi possível carregar as configurações.');
  } finally {
    isLoading.value = false;
  }
}

function openDeleteDialog(item) {
  configToDelete.value = item;
  isDeleteDialogOpen.value = true;
}

function closeDeleteDialog() {
  isDeleteDialogOpen.value = false;
  configToDelete.value = null;
}

async function performDelete() {
  if (!configToDelete.value) return;
  try {
    await deleteConfig(configToDelete.value.id);
    configs.value = configs.value.filter(c => c.id !== configToDelete.value.id);
    alert('Configuração excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir configuração:', error);
    alert('Falha ao excluir a configuração.');
  }
  closeDeleteDialog();
}

onMounted(fetchData);
</script>

<template>
  <VContainer>
    <VRow justify="center" class="mt-8">
      <VCol cols="12" lg="10">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Configurações</h1>
          <VBtn @click="fetchData" icon="mdi-refresh" variant="tonal" title="Atualizar Lista" />
        </div>
        <div class="d-flex flex-wrap align-center mb-6" style="gap: 0.5rem;">
          <NuxtLink to="/">
            <VBtn color="indigo">Gerador</VBtn>
          </NuxtLink>
          <NuxtLink to="/orders">
            <VBtn color="primary">Pedidos</VBtn>
          </NuxtLink>
          <NuxtLink to="/admin">
            <VBtn color="green">Painel de Confirmação</VBtn>
          </NuxtLink>
        </div>

        <VCard v-if="mdAndUp" class="mt-6">
          <VCardTitle>Configurações Salvas</VCardTitle>
          <VDataTable :headers="headers" :items="configs" :loading="isLoading"
            no-data-text="Nenhuma configuração encontrada.">
            <template #item.actions="{ item }">
              <div class="d-flex gap-2 justify-end">
                <VBtn color="error" variant="tonal" size="small" @click="openDeleteDialog(item)">
                  Excluir
                </VBtn>
              </div>
            </template>
          </VDataTable>
        </VCard>

        <div v-else>
          <h2 class="text-h5 mb-4 mt-6">Configurações Salvas</h2>
          <VProgressLinear v-if="isLoading" indeterminate />
          <div v-if="!configs.length && !isLoading" class="text-center text-grey">
             Nenhuma configuração encontrada.
          </div>
          <VRow>
            <VCol v-for="item in configs" :key="item.id" cols="12">
              <VCard>
                <VCardTitle class="text-subtitle-1">{{ item.name }}</VCardTitle>
                <VCardText>
                  <div><strong>ID:</strong> {{ item.id }}</div>
                  <div><strong>Template:</strong> {{ item.template }}</div>
                </VCardText>
                <VDivider />
                <VCardActions class="justify-end">
                  <VBtn color="error" variant="tonal" size="small" @click="openDeleteDialog(item)">
                    Excluir
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </div>


        <VDialog v-model="isDeleteDialogOpen" max-width="500px" persistent>
          <VCard>
            <VCardTitle class="headline">Confirmar Exclusão</VCardTitle>
            <VCardText>
              Você tem certeza que deseja excluir a configuração
              <strong>{{ configToDelete?.name }}</strong> (ID: {{ configToDelete?.id }})?
              <br><br>
              Esta ação não pode ser desfeita.
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn text @click="closeDeleteDialog">Cancelar</VBtn>
              <VBtn color="error" variant="elevated" @click="performDelete">Excluir</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>