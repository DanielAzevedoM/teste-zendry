// stores/payment.js
import { defineStore } from 'pinia'
// (opcional) mock; troque por chamada real ao seu backend
import { findCouponByCode, calcCouponValue } from '~/utils/fakeApi/mock-data'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payment: null,        // { id, amount, discount, currency, ... }
    method: null,
    status: 'idle',
    serverData: {},
    lastEvent: null,

    // espelho do cupom ativo do Summary
    couponCode: '',       // código do cupom ativo (vindo do Summary)
    couponMeta: null,     // objeto do mock (para recalcular quando amount muda)
    coupon: 0,            // valor do cupom em centavos já calculado
  }),

  getters: {
    total (state) {
      const a = Number(state.payment?.amount || 0)
      const d = Number(state.payment?.discount || 0)
      const c = Number(state.coupon || 0) // <- usa o espelho do Summary
      return Math.max(0, a - d - c)
    },
  },

  actions: {
    setPayment (payment) {
      this.payment = payment 
      // sempre que amount/discount mudar, recalcula o cupom já ativo
      this._recalcCoupon()
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

    // ===== Cupom vindo do OrderSummary =====
    // Chame isto no momento que o Summary ativar/trocar o cupom
    setCouponFromOrderSummary (code) {
      const clean = String(code || '').trim()
      this.couponCode = clean
      this.couponMeta = clean ? findCouponByCode(clean) : null
      this._recalcCoupon()
    },

    // Se o Summary limpar o cupom, chame isto
    clearCouponFromOrderSummary () {
      this.couponCode = ''
      this.couponMeta = null
      this.coupon = 0
    },

    // Recalcula com base no amount atual + metadados do mock
    _recalcCoupon () {
      if (!this.payment) return
      this.coupon = calcCouponValue(this.couponMeta, this.payment.amount)
    },

    clear () {
      this.payment = null
      this.method = null
      this.status = 'idle'
      this.serverData = {}
      this.lastEvent = null
      this.couponCode = ''
      this.couponMeta = null
      this.coupon = 0
    },
  },
})

