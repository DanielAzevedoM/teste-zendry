import { paymentsMock } from "~/utils/fakeApi/mock-data"// ou do seu service fakeApi

export default defineNuxtRouteMiddleware((to) => {
  const paymentId = to.params.id

  const exists = paymentsMock.some(p => p.id === paymentId)

  if (!exists) {
    return navigateTo('/404') 
  }
})
