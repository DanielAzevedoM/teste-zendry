<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNuxtApp } from '#app';
import { getOrders } from '~/services/orderService';
import { confirmPayment } from '~/services/adminService';

const orders = ref([]);
const isLoading = ref(true);
const { $ws } = useNuxtApp();

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'Em aguardo'));

async function fetchOrders() {
  isLoading.value = true;
  try {
    orders.value = await getOrders();
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    alert('Falha ao carregar pedidos.');
  } finally {
    isLoading.value = false;
  }
}

async function handleConfirmPayment(orderId) {
  if (!orderId) return;

  try {
    await confirmPayment(orderId, $ws);

    const orderIndex = orders.value.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'PAGO';
    }

    alert(`Confirmação de pagamento para o pedido ${orderId} foi enviada!`);

  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    alert('Falha ao confirmar o pagamento. Verifique o console.');
  }
}

onMounted(fetchOrders);
</script>

<template>
  <VContainer>
    <VRow justify="center" class="mt-8">
      <VCol md="10" sm="12">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Painel de Confirmação</h1>
          <VBtn @click="fetchOrders" icon="mdi-refresh" variant="tonal" />
        </div>
        <div class="d-flex align-center mb-6">
          <NuxtLink to="/">
            <VBtn class="mx-2" color="indigo">Gerador</VBtn>
          </NuxtLink>
          <NuxtLink to="/orders">
            <VBtn class="mx-2" color="green">Pedidos</VBtn>
          </NuxtLink>
        </div>

        <VCard class="mt-6">
          <VCardTitle>Pedidos Pendentes</VCardTitle>
          <VDataTable :headers="[
            { title: 'ID do Pedido', key: 'id' },
            { title: 'Valor Total', key: 'amount' },
            { title: 'Criado em', key: 'createdAt' },
            { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
          ]" :items="pendingOrders" :loading="isLoading" no-data-text="Nenhum pedido pendente.">
            <template #item.amount="{ item }">
              <span>{{ (item.amount - (item.discount || 0)).toLocaleString('pt-BR', {
                style: 'currency', currency:
                  'BRL'
              }) }}</span>
            </template>
            <template #item.createdAt="{ item }">
              <span>{{ new Date(item.createdAt).toLocaleString('pt-BR') }}</span>
            </template>
            <template #item.actions="{ item }">
              <VBtn color="success" variant="elevated" size="small" @click="handleConfirmPayment(item.id)">
                Confirmar Pagamento
              </VBtn>
            </template>
          </VDataTable>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>