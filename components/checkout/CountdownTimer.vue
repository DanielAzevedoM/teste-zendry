<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  minutes: { type: Number, required: true },
  countdownText: { type: String, default: 'Oferta termina em' },
  
  // Propriedade para a cor do texto "Oferta termina em"
  textColor: { type: String, default: 'inherit' },
  
  // Propriedade para a cor dos números do cronômetro
  countdownColor: { type: String, default: '#000000' }
});

const totalSeconds = ref(props.minutes * 60);
let intervalId;

const formattedTime = computed(() => {
  if (totalSeconds.value <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds.value / 3600);
  const mins = Math.floor((totalSeconds.value % 3600) / 60);
  const secs = totalSeconds.value % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

onMounted(() => {
  if (props.minutes > 0) {
    intervalId = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="d-flex align-center justify-center">
    <span :style="{ color: textColor }">{{ countdownText }}&nbsp;</span>
    
    <span :style="{ color: countdownColor, fontWeight: 'bold' }">{{ formattedTime }}</span>
  </div>
</template>