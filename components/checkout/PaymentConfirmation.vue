// MODIFICATION BASED ON: /home/daniel/Downloads/zendry-checkout/components/checkout/PurchaseStatusCard.vue
<script setup>
const props = defineProps({
  purchase: {
    type: Object,
    required: true,
    // expected:
    // purchase: {
    //   user: { name, cpf, email },
    //   payment: { id, amount, discount, total, method }
    // }
  },
  status: {
    type: String,
    default: 'processing',
  },
})

const nf = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtMoney = v => (v != null ? nf.format(v) : '-')

const u = props.purchase?.user || {}
const p = props.purchase?.payment || {}
</script>

<template>
  <div>
    <v-alert
      :type="status === 'approved' ? 'success' : 'info'"
      variant="tonal"
      border="start"
      class="mb-4"
    >
      <template #default>
        <span v-if="status === 'approved'">Pagamento aprovado!</span>
        <span v-else>Aguardando confirmação do pagamento...</span>
      </template>
    </v-alert>

    <v-card variant="outlined">
      <v-card-title class="text-h6">
        {{ status === 'approved' ? 'Resumo da compra' : 'Dados da compra' }}
      </v-card-title>

      <v-card-text>
        <div class="mb-4">
          <div class="text-subtitle-2 mb-1">Usuário</div>
          <div>Nome: <strong>{{ u?.name || '-' }}</strong></div>
          <div>CPF: <strong>{{ u?.cpf || '-' }}</strong></div>
          <div>Email: <strong>{{ u?.email || '-' }}</strong></div>
        </div>

        <v-divider class="my-3" />

        <div>
          <div class="text-subtitle-2 mb-1">Pagamento</div>
          <div>ID: <strong>{{ p?.id || '-' }}</strong></div>
          <div>Tipo: <strong>{{ p?.method || '-' }}</strong></div>
          <div>Valor: <strong>{{ fmtMoney(p?.amount) }}</strong></div>
          <div>Desconto: <strong>{{ fmtMoney(p?.discount) }}</strong></div>
          <div>Total: <strong>{{ fmtMoney(p?.total) }}</strong></div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
