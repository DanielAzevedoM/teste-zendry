import { ref, watch } from 'vue'
import { cupons } from '~/utils/fakeApi/mock-data'

export function useCoupon (initialDiscount = 0) {
  const couponCode = ref('')
  const discountValue = ref(initialDiscount)

  watch(couponCode, (code) => {
    const found = cupons.find(c => c.code.toLowerCase() === String(code || '').toLowerCase())
    discountValue.value = found ? found.discount : 0
  })

  return { couponCode, discountValue }
}
