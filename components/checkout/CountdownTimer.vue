// components/checkout/CountdownTimer.vue

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
 minutes: { type: Number, required: true },
 countdownText: { type: String, default: 'Oferta termina em' },
 textColor: { type: String, default: 'inherit' },
 countdownColor: { type: String, default: '#000000' }
});

// LINHA MODIFICADA: Adicionado Math.floor para garantir que os segundos sejam inteiros
const totalSeconds = ref(Math.floor(props.minutes * 60));
let intervalId;

const formattedTime = computed(() => {
 if (totalSeconds.value <= 0) return '00:00';
 const mins = Math.floor(totalSeconds.value / 60);
 const secs = totalSeconds.value % 60;
 return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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