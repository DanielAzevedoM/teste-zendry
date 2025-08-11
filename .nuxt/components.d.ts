
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'CheckoutAccountForm': typeof import("../components/checkout/AccountForm.vue")['default']
    'CheckoutCountdownTimer': typeof import("../components/checkout/CountdownTimer.vue")['default']
    'CheckoutMiniChatNotification': typeof import("../components/checkout/MiniChatNotification.vue")['default']
    'CheckoutOrderSummary': typeof import("../components/checkout/OrderSummary.vue")['default']
    'CheckoutPaymentConfirmation': typeof import("../components/checkout/PaymentConfirmation.vue")['default']
    'CheckoutPaymentMethod': typeof import("../components/checkout/PaymentMethod.vue")['default']
    'GeneratorSettingsCard': typeof import("../components/generator/SettingsCard.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'NuxtPage': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyCheckoutAccountForm': LazyComponent<typeof import("../components/checkout/AccountForm.vue")['default']>
    'LazyCheckoutCountdownTimer': LazyComponent<typeof import("../components/checkout/CountdownTimer.vue")['default']>
    'LazyCheckoutMiniChatNotification': LazyComponent<typeof import("../components/checkout/MiniChatNotification.vue")['default']>
    'LazyCheckoutOrderSummary': LazyComponent<typeof import("../components/checkout/OrderSummary.vue")['default']>
    'LazyCheckoutPaymentConfirmation': LazyComponent<typeof import("../components/checkout/PaymentConfirmation.vue")['default']>
    'LazyCheckoutPaymentMethod': LazyComponent<typeof import("../components/checkout/PaymentMethod.vue")['default']>
    'LazyGeneratorSettingsCard': LazyComponent<typeof import("../components/generator/SettingsCard.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const CheckoutAccountForm: typeof import("../components/checkout/AccountForm.vue")['default']
export const CheckoutCountdownTimer: typeof import("../components/checkout/CountdownTimer.vue")['default']
export const CheckoutMiniChatNotification: typeof import("../components/checkout/MiniChatNotification.vue")['default']
export const CheckoutOrderSummary: typeof import("../components/checkout/OrderSummary.vue")['default']
export const CheckoutPaymentConfirmation: typeof import("../components/checkout/PaymentConfirmation.vue")['default']
export const CheckoutPaymentMethod: typeof import("../components/checkout/PaymentMethod.vue")['default']
export const GeneratorSettingsCard: typeof import("../components/generator/SettingsCard.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyCheckoutAccountForm: LazyComponent<typeof import("../components/checkout/AccountForm.vue")['default']>
export const LazyCheckoutCountdownTimer: LazyComponent<typeof import("../components/checkout/CountdownTimer.vue")['default']>
export const LazyCheckoutMiniChatNotification: LazyComponent<typeof import("../components/checkout/MiniChatNotification.vue")['default']>
export const LazyCheckoutOrderSummary: LazyComponent<typeof import("../components/checkout/OrderSummary.vue")['default']>
export const LazyCheckoutPaymentConfirmation: LazyComponent<typeof import("../components/checkout/PaymentConfirmation.vue")['default']>
export const LazyCheckoutPaymentMethod: LazyComponent<typeof import("../components/checkout/PaymentMethod.vue")['default']>
export const LazyGeneratorSettingsCard: LazyComponent<typeof import("../components/generator/SettingsCard.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.2.0_@vue+compiler-_f712703ffc624a46e3c4a9a36213b2e7/node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
