// Usando Broadcast Channel para comunicação entre abas
export default defineNuxtPlugin(() => {
  const channel = new BroadcastChannel('payment_channel');

  const bus = {
    emit(event, data) {
      channel.postMessage({ event, data });
    },
    on(event, callback) {
      channel.onmessage = (msg) => {
        if (msg.data && msg.data.event === event) {
          callback(msg.data.data);
        }
      };
    },
    off() {
      channel.onmessage = null;
    },
    close() {
        channel.close();
    }
  };

  return { provide: { ws: bus } };
});