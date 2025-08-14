<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDisplay } from 'vuetify'; // Importa o composable de display
import { useNuxtApp } from '#app';
import { getOrders } from '~/services/orderService';
import { confirmPayment } from '~/services/adminService';

useHead({
  title: 'Painel de confirmação'
});

// Lógica para responsividade
const { mdAndUp } = useDisplay();

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
      <VCol cols="12" lg="10">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4">Painel de Confirmação</h1>
          <VBtn @click="fetchOrders" icon="mdi-refresh" variant="tonal" />
        </div>
        <div class="d-flex flex-wrap align-center mb-6" style="gap: 0.5rem;">
          <NuxtLink to="/configs">
            <VBtn color="teal">Configurações</VBtn>
          </NuxtLink>
          <NuxtLink to="/">
            <VBtn color="indigo">Gerador</VBtn>
          </NuxtLink>
          <NuxtLink to="/orders">
            <VBtn color="primary">Pedidos</VBtn>
          </NuxtLink>
        </div>

        <VCard v-if="mdAndUp" class="mt-6">
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

        <div v-else>
          <h2 class="text-h5 mb-4 mt-6">Pedidos Pendentes</h2>
          <VProgressLinear v-if="isLoading" indeterminate />
          <div v-if="!pendingOrders.length && !isLoading" class="text-center text-grey">
            Nenhum pedido pendente.
          </div>
          <VRow>
            <VCol v-for="item in pendingOrders" :key="item.id" cols="12">
              <VCard>
                 <VCardText>
                    <div><strong>ID:</strong> {{ item.id }}</div>
                    <div><strong>Valor:</strong> {{ (item.amount - (item.discount || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</div>
                    <div><strong>Criado em:</strong> {{ new Date(item.createdAt).toLocaleString('pt-BR') }}</div>
                 </VCardText>
                 <VDivider />
                 <VCardActions>
                    <VBtn color="success" variant="elevated" block @click="handleConfirmPayment(item.id)">
                      Confirmar Pagamento
                    </VBtn>
                 </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>