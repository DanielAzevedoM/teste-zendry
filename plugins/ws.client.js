import mitt from 'mitt'
import { setWs } from '@/services/paymentApi'

export default defineNuxtPlugin(() => {
  const bus = mitt()

  setWs(bus)
  return { provide: { ws: bus } }
})
