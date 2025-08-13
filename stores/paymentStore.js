// stores/paymentStore.js

import { defineStore } from 'pinia'
import { findCouponByCode, calcCouponValue } from '~/utils/fakeApi/mock-data'

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payment: null,
    method: null,
    status: 'idle',
    serverData: {},
    lastEvent: null,

    couponCode: '',
    couponMeta: null,
    coupon: 0,
    
    // ADICIONADO
    currentStep: 0,
  }),

  getters: {
    total (state) {
      const a = Number(state.payment?.amount || 0)
      const d = Number(state.payment?.discount || 0)
      const c = Number(state.coupon || 0)
      return Math.max(0, a - d - c)
    },
  },

  actions: {
    // ADICIONADO
    setCurrentStep (step) {
      this.currentStep = step
    },

    setPayment (payment) {
      this.payment = payment
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

    setCouponFromOrderSummary (code) {
      const clean = String(code || '').trim()
      this.couponCode = clean
      this.couponMeta = clean ? findCouponByCode(clean) : null
      this._recalcCoupon()
    },

    clearCouponFromOrderSummary () {
      this.couponCode = ''
      this.couponMeta = null
      this.coupon = 0
    },

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
      this.currentStep = 0 // Resetar a etapa
    },
  },
})