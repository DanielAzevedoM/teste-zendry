<script setup>
import { usePayment } from '@/composables/usePayment'
import { luhnValid, onlyDigits } from '@/utils/cardBrand'
import { useCardBrand } from '@/composables/useCardBrand'

const emit = defineEmits(['valid'])

const {
  method,        
  card, pix, boleto,
  rules,
  isValid,
  pay,
} = usePayment()

watch(isValid, v => emit('valid', v))

// bandeira baseada no número digitado
const { getBrand, brandIcon } = useCardBrand()
const brand = computed(() => getBrand(card.number))

// expõe pay() pro pai
defineExpose({ pay })
</script>

<template>
  <div class="space-y-4">
    <v-row>
      <v-col cols="4" class="px-2">
        <VCard
          class="pa-3 payment-card"
          :class="{ selected: method === 'card' }"
          @click="method='card'"
        >
          <div class="font-weight-medium">Cartão de crédito</div>
          <small>Visa, MasterCard, Hipercard…</small>
        </VCard>
      </v-col>

      <v-col cols="4" class="px-2">
        <VCard
          class="pa-3 payment-card"
          :class="{ selected: method === 'pix' }"
          @click="method='pix'"
        >
          <div class="font-weight-medium">Pix</div>
          <small>Pagamento instantâneo</small>
        </VCard>
      </v-col>

      <v-col cols="4" class="px-2">
        <VCard
          class="pa-3 payment-card"
          :class="{ selected: method === 'boleto' }"
          @click="method='boleto'"
        >
          <div class="font-weight-medium">Boleto</div>
          <small>Compensação em 1–3 dias úteis</small>
        </VCard>
      </v-col>
    </v-row>

    <!-- CARTÃO -->
    <VForm v-if="method==='card'" v-model="card._valid" validate-on="input lazy" class="mt-5">
      <VTextField
        v-model="card.holder"
        label="Nome impresso no cartão"
        variant="outlined"
        :rules="[rules.required('Nome no cartão'), rules.minLen('Nome no cartão', 5)]"
      />

      <VTextField
        class="mt-2"
        v-model="card.number"
        label="Número do cartão"
        variant="outlined"
        inputmode="numeric"
        :maxlength="19"
        :rules="[
          rules.required('Número do cartão'),
          v => luhnValid(onlyDigits(v)) || 'Cartão inválido'
        ]"
        hint="Aceitamos Visa, MasterCard, Amex, Elo, Hipercard…"
        persistent-hint
      >
        <!-- Ícone da bandeira no input -->
        <template #prepend-inner>
          <VIcon v-if="brand" :icon="brandIcon(brand)" />
        </template>
      </VTextField>

      <v-row class="mt-1">
        <v-col>
          <VTextField
            v-model="card.exp"
            v-mask="'expiry'"
            label="Validade (MM/AA)"
            variant="outlined"
            placeholder="MM/AA"
            maxlength="5"
            :rules="[rules.required('Validade'), rules.expDate]"
          />
        </v-col>
        <v-col>
          <VTextField
            v-model="card.cvv"
            label="CVV"
            variant="outlined"
            inputmode="numeric"
            :maxlength="4"
            :rules="[rules.required('CVV'), rules.onlyDigits('CVV'), rules.lenBetween('CVV', 3, 4)]"
          />
        </v-col>
      </v-row>
    </VForm>

    <!-- PIX -->
    <VForm v-if="method==='pix'" v-model="pix._valid" validate-on="input lazy" class="mt-5">
      <VTextField
        v-model="pix.key"
        label="Chave Pix (CPF/CNPJ, e-mail, telefone ou aleatória)"
        variant="outlined"
        :rules="[rules.required('Chave Pix')]"
      />
      <VTextField
        class="mt-2"
        v-model="pix.payerName"
        label="Nome do pagador"
        variant="outlined"
        :rules="[rules.required('Nome do pagador'), rules.minLen('Nome do pagador', 5)]"
      />
    </VForm>

    <!-- BOLETO -->
    <VForm v-if="method==='boleto'" v-model="boleto._valid" validate-on="input lazy" class="mt-5">
      <VTextField
        v-model="boleto.payerName"
        label="Nome do pagador"
        variant="outlined"
        :rules="[rules.required('Nome do pagador'), rules.minLen('Nome do pagador', 5)]"
      />
      <VTextField
        class="mt-2"
        v-model="boleto.cpf"
        label="CPF"
        variant="outlined"
        inputmode="numeric"
        :maxlength="14"
        :rules="[
          rules.required('CPF'),
          rules.onlyDigits('CPF'),
          rules.len('CPF', 11),
          rules.cpf
        ]"
      />
      <VTextField
        class="mt-2"
        v-model="boleto.email"
        label="E-mail para envio do boleto"
        variant="outlined"
        :rules="[rules.required('E-mail'), rules.email]"
      />
    </VForm>
  </div>
</template>

<style scoped>
.payment-card {
  min-width: 0;
  cursor: pointer;
  background-color: #d8d8e6 !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(0,0,0,0.08) !important;
  transition: background-color .2s, border-color .2s, color .2s;
}
.payment-card:hover:not(.selected) {
  background-color: #c9c9d8 !important;
}
.payment-card.selected {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
