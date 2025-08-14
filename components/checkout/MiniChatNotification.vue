<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  message: { type: String, required: true },
  coupon: { type: String, default: '' },
  title: { type: String, default: 'Boas-vindas!' },
  iconColor: { type: String, default: 'primary' },
  // NOVAS PROPS
  buttonBgColor: { type: String, default: '#1E88E5' },
  buttonTextColor: { type: String, default: '#FFFFFF' },
});

const isVisible = ref(true);
const isMinimized = ref(false);

const buttonStyle = computed(() => ({
  backgroundColor: props.buttonBgColor,
  color: props.buttonTextColor,
}));

function copyCoupon() {
  if (props.coupon) {
    navigator.clipboard.writeText(props.coupon);
    alert(`Cupom "${props.coupon}" copiado!`);
  }
}
</script>

<template>
  <div v-if="isVisible" class="mini-chat-wrapper">
    <VSheet elevation="8" rounded="lg" class="mini-chat-card" :class="{ 'minimized': isMinimized }">
      <div class="d-flex align-center pa-2">
        <VAvatar :color="iconColor" size="32" class="mr-3">
          <VIcon icon="mdi-message-text-outline" />
        </VAvatar>
        <span class="font-weight-medium">{{ title }}</span>
        <VSpacer />
        <VBtn icon variant="text" size="x-small" @click="isMinimized = !isMinimized" class="mr-1">
          <VIcon :icon="isMinimized ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </VBtn>
        <VBtn icon variant="text" size="x-small" @click="isVisible = false">
          <VIcon icon="mdi-close" />
        </VBtn>
      </div>

      <VDivider v-if="!isMinimized" />

      <div v-if="!isMinimized" class="pa-4">
        <p class="mb-4">{{ message }}</p>
        <VBtn v-if="coupon" block variant="elevated" @click="copyCoupon" :style="buttonStyle">
          Copiar Cupom: {{ coupon }}
        </VBtn>
      </div>
    </VSheet>
  </div>
</template>

<style scoped>
.mini-chat-wrapper {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1010;
  max-width: 320px;
  width: 100%;
}

.mini-chat-card {
  transition: all 0.3s ease-in-out;
}

.mini-chat-card.minimized .pa-4,
.mini-chat-card.minimized .v-divider {
  display: none;
}
</style>