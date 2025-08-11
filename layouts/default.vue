<template>
 <v-app>
  <v-main>
    <slot />
  </v-main>
 </v-app>
</template>

<script setup>
</script>

<style scoped>
/* Adicione este bloco de estilo corrigido */
.v-main {
  background-color: rgb(155, 155, 233);
  min-height: 100vh;
}
</style>