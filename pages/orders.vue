<script setup>
import { ref, onMounted, computed } from 'vue';
import { VRow } from 'vuetify/components';
import { getOrders, createOrder, updateOrder, deleteOrder } from '~/services/orderService';
import { getConfigs } from '~/services/configService';

const OrderStatus = {
  PAID: 'PAGO',
  PENDING: 'Em aguardo',
  EXPIRED: 'EXPIRADO'
};

const orders = ref([]);
const configs = ref([]);
const isLoading = ref(true);

const isCreateOrEditDialogVisible = ref(false);
const isDeleteDialogOpen = ref(false);
const editingOrder = ref(null);
const isEditing = computed(() => !!editingOrder.value?.id);

const newOrderDefaults = { amount: null, discount: null, customerIdentifier: '', configId: null };
const newOrder = ref({ ...newOrderDefaults });

const headers = [
  { title: 'ID do Pedido', key: 'id', width: '25%' },
  { title: 'Configuração', key: 'configId' },
  { title: 'Valor', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
];

async function fetchData() {
  isLoading.value = true;
  try {
    const [ordersData, configsData] = await Promise.all([
      getOrders(),
      getConfigs()
    ]);
    orders.value = ordersData;
    configs.value = configsData;
  } catch (error) {
    console.error("Erro ao buscar dados iniciais:", error);
    alert('Não foi possível carregar os dados da página.');
  } finally {
    isLoading.value = false;
  }
}

function openCreateDialog() {
  editingOrder.value = null;
  newOrder.value = { ...newOrderDefaults };
  isCreateOrEditDialogVisible.value = true;
}

function openEditDialog(item) {
  editingOrder.value = { ...item };
  newOrder.value = { amount: item.amount, discount: item.discount, customerIdentifier: item.customerIdentifier, configId: item.configId };
  isCreateOrEditDialogVisible.value = true;
}

function openDeleteDialog(item) {
  editingOrder.value = item;
  isDeleteDialogOpen.value = true;
}

function closeDialogs() {
  isCreateOrEditDialogVisible.value = false;
  isDeleteDialogOpen.value = false;
  editingOrder.value = null;
}

async function saveOrder() {
  try {
    if (isEditing.value) {
      const updatedOrder = await updateOrder(editingOrder.value.id, newOrder.value);
      const orderIndex = orders.value.findIndex(o => o.id === editingOrder.value.id);
      if (orderIndex !== -1) {
        orders.value[orderIndex] = updatedOrder;
      }
      alert('Pedido atualizado com sucesso!');
    } else {
      if (!newOrder.value.configId || newOrder.value.amount === null) {
        alert('Valor e Configuração são obrigatórios.');
        return;
      }
      const createdOrder = await createOrder(newOrder.value);
      orders.value.push(createdOrder);
      alert(`Pedido criado com sucesso! ID: ${createdOrder.id}`);
      generateCheckoutLink(createdOrder.id);
    }
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    alert(`Falha ao salvar o pedido: ${error.message || 'Erro desconhecido'}`);
  } finally {
    closeDialogs();
  }
}

async function performDeleteOrder() {
  try {
    await deleteOrder(editingOrder.value.id);
    orders.value = orders.value.filter(o => o.id !== editingOrder.value.id);
    alert('Pedido excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    alert('Falha ao excluir o pedido.');
  }
  closeDialogs();
}

function generateCheckoutLink(orderId) {
  const url = `${window.location.origin}/checkout/${orderId}`;
  navigator.clipboard.writeText(url);
  alert(`Link do checkout copiado!`);
}

const statusColor = (status) => {
  if (status === OrderStatus.PAID) return 'success';
  if (status === OrderStatus.EXPIRED) return 'error';
  return 'warning';
};

onMounted(fetchData);
</script>

<template>
  <VRow justify="center" class="mt-4">
    <VCol md="8" sm="11">
      <div class="d-flex align-center mb-6">
        <VBtn color="primary" @click="openCreateDialog" prepend-icon="mdi-plus">
          Criar Pedido
        </VBtn>
        <NuxtLink to="/">
          <VBtn class="mx-2" color="indigo">Gerador</VBtn>
        </NuxtLink>
        <NuxtLink to="/admin">
          <VBtn class="mx-2" color="green">Painel de Confirmação</VBtn>
        </NuxtLink>
      </div>

      <VCard>
        <VCardTitle>Pedidos Criados</VCardTitle>
        <VDataTable :headers="headers" :items="orders" :loading="isLoading"
          no-data-text="Nenhum pedido criado ainda.">
          <template #item.amount="{ item }">
            <span>{{ (item.amount - (item.discount || 0)).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }) }}</span>
          </template>
          <template #item.status="{ item }">
            <VChip :color="statusColor(item.status)" small>{{ item.status }}</VChip>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-end">
              <VBtn color="info" variant="tonal" size="small" @click="generateCheckoutLink(item.id)"
                :disabled="item.status !== OrderStatus.PENDING">Link</VBtn>
              <VBtn color="primary" variant="tonal" size="small" @click="openEditDialog(item)"
                :disabled="item.status !== OrderStatus.PENDING">Editar</VBtn>
              <VBtn color="error" variant="tonal" size="small" @click="openDeleteDialog(item)">
                Excluir
              </VBtn>
            </div>
          </template>
        </VDataTable>
      </VCard>

      <VDialog v-model="isCreateOrEditDialogVisible" max-width="600px" persistent>
        <VCard>
          <VCardTitle class="headline">{{ isEditing ? 'Editar Pedido' : 'Criar Novo Pedido' }}</VCardTitle>
          <VCardText class="mt-4">
            <VTextField v-model.number="newOrder.amount" label="Valor do Pedido*" type="number" prefix="R$"
              variant="outlined" class="mb-4" />
            <VTextField v-model.number="newOrder.discount" label="Desconto (opcional)" type="number"
              prefix="R$" variant="outlined" class="mb-4" />
            <VTextField v-model="newOrder.customerIdentifier" label="Email do Cliente (Opcional)"
              variant="outlined" class="mb-4" type="email" />
            <VSelect v-model="newOrder.configId" :items="configs" item-title="name" item-value="id"
              label="Configuração de Checkout*" placeholder="Selecione uma configuração"
              variant="outlined" no-data-text="Nenhuma configuração encontrada." />
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn text @click="closeDialogs">Cancelar</VBtn>
            <VBtn color="primary" variant="elevated" @click="saveOrder">{{ isEditing ? 'Salvar Alterações' :
              'Criar Pedido' }}</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VDialog v-model="isDeleteDialogOpen" max-width="500px" persistent>
        <VCard>
          <VCardTitle class="headline">Confirmar Exclusão</VCardTitle>
          <VCardText>
            Você tem certeza que deseja excluir o pedido <strong>{{ editingOrder?.id }}</strong>? Esta ação
            não pode ser
            desfeita.
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn text @click="closeDialogs">Cancelar</VBtn>
            <VBtn color="error" variant="elevated" @click="performDeleteOrder">Excluir</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCol>
  </VRow>
</template>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>