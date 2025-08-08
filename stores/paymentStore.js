// MODIFICATION BASED ON: /home/daniel/Downloads/zendry-checkout/stores/payment.js
import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    // snapshot da compra atual
    payment: null,        // { id, amount, discount, ... } (mock do back)
    method: null,         // 'card' | 'pix' | 'boleto'
    status: 'idle',       // 'idle' | 'processing' | 'approved' | 'failed' | 'expired' | 'canceled'
    serverData: {},       // dados complementares vindos do back (qrcode, boletoUrl, authId, etc.)
    lastEvent: null,      // último evento recebido pelo “websocket” (debug)
  }),

  getters: {
    total (state) {
      const a = Number(state.payment?.amount || 0)
      const d = Number(state.payment?.discount || 0)
      return Math.max(0, a - d)
    },
  },

  actions: {
    setPayment (payment) {
      this.payment = payment ?? null
    },
    setMethod (method) {
      this.method = method ?? null
    },
    setStatus (status) {
      this.status = status ?? 'idle'
    },
    mergeServerData (obj = {}) {
      this.serverData = { ...this.serverData, ...obj }
    },
    setLastEvent (evt) {
      this.lastEvent = evt
    },
    clear () {
      this.payment = null
      this.method = null
      this.status = 'idle'
      this.serverData = {}
      this.lastEvent = null
    },
  },
})
