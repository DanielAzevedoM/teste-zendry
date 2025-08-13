import { checkAndExpireOrders } from '@/server/utils/expirationManager.js';

export default defineNitroPlugin(() => {
  // Inicia a verificação assim que o servidor sobe
  checkAndExpireOrders();

  // Configura a tarefa para rodar a cada 60 segundos (60000 milissegundos)
  setInterval(() => {
    checkAndExpireOrders();
  }, 15000); 

  console.log('✅ [NITRO] "Cron Job" de expiração de pedidos iniciado.');
});