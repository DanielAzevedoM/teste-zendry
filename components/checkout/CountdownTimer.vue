<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  minutes: { type: Number, default: 0 },
  initialSeconds: { type: Number, default: 0 }, // Nova propriedade
  countdownText: { type: String, default: 'Oferta termina em' },
  textColor: { type: String, default: 'inherit' },
  countdownColor: { type: String, default: '#000000' }
});

const totalSeconds = ref(0);
let intervalId;

function setupTimer() {
  clearInterval(intervalId);
  totalSeconds.value = props.initialSeconds > 0
    ? Math.floor(props.initialSeconds)
    : Math.floor(props.minutes * 60);

  if (totalSeconds.value > 0) {
    intervalId = setInterval(() => {
      if (totalSeconds.value > 0) {
        totalSeconds.value--;
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }
}

const formattedTime = computed(() => {
  if (totalSeconds.value <= 0) return '00:00';
  const mins = Math.floor(totalSeconds.value / 60);
  const secs = totalSeconds.value % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

onMounted(setupTimer);

// Se o tempo inicial mudar (por exemplo, em um popup), reinicia o timer
watch(() => props.initialSeconds, setupTimer);

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