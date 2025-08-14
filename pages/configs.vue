<script setup>
import { ref, onMounted } from 'vue';
import { getConfigs, deleteConfig } from '~/services/configService';

useHead({
  title: 'Configurações de checkout'
});

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

function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text);
  alert(message);
}

onMounted(fetchData);
</script>

<template>
  <VContainer>
    <VRow justify="center" class="mt-8">
      <VCol md="10" sm="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Configurações de Checkout</h1>
          <VBtn @click="fetchData" icon="mdi-refresh" variant="tonal" title="Atualizar Lista" />
        </div>
        <div class="d-flex align-center mb-6">
          <NuxtLink to="/">
            <VBtn class="mr-2" color="indigo">Gerador</VBtn>
          </NuxtLink>
          <NuxtLink to="/orders">
            <VBtn class="mx-2" color="primary">Pedidos</VBtn>
          </NuxtLink>
          <NuxtLink to="/admin">
            <VBtn class="mx-2" color="green">Painel de Confirmação</VBtn>
          </NuxtLink>
        </div>

        <VCard class="mt-6">
          <VCardTitle>Configurações Salvas</VCardTitle>
          <VDataTable 
            :headers="headers" 
            :items="configs" 
            :loading="isLoading"
            no-data-text="Nenhuma configuração encontrada."
          >
            <template #item.actions="{ item }">
              <div class="d-flex gap-2 justify-end">
                <!-- <VBtn 
                  color="info" 
                  variant="tonal" 
                  size="small" 
                  @click="copyToClipboard(item.id, 'ID da configuração copiado!')"
                >
                  Copiar ID
                </VBtn> -->
                <VBtn 
                  color="error" 
                  variant="tonal" 
                  size="small" 
                  @click="openDeleteDialog(item)"
                >
                  Excluir
                </VBtn>
              </div>
            </template>
          </VDataTable>
        </VCard>

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