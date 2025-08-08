// plugins/mask.js
export default defineNuxtPlugin((nuxtApp) => {
  const onlyDigits = (s = '') => String(s).replace(/\D+/g, '')

  const formatters = {
    cpf(value = '') {
      const d = onlyDigits(value).slice(0, 11)
      return d
        .replace(/^(\d{3})(\d)/, '$1.$2')
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    },
    cep(value = '') {
      const d = onlyDigits(value).slice(0, 8)
      return d.replace(/^(\d{5})(\d)/, '$1-$2')
    },
    phone(value = '') {
      const d = onlyDigits(value).slice(0, 11)
      if (d.length <= 10) {
        return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
      }
      return d.replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    },
    expiry(value = '') {
      // MM/AA
      const d = onlyDigits(value).slice(0, 4)
      return d.replace(/^(\d{2})(\d)/, '$1/$2')
    },
    card(value = '') {
      // 4-4-4-4 (até 19 dígitos com espaços)
      const d = onlyDigits(value).slice(0, 19)
      return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    },
  }

  nuxtApp.vueApp.directive('mask', {
    getSSRProps() { return {} },

    mounted(el, binding) {
      if (!process.client) return

      const type = binding.value
      const fmt = formatters[type]
      if (!fmt) return

      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (!input) return

      // evita múltipla inscrição
      if (input._maskBound) return
      input._maskBound = true

      let running = false

      const handler = (e) => {
        // evita loop por reentrada e IME
        if (running || e?.isComposing) return

        const before = input.value ?? ''
        const masked = fmt(before)

        // nada mudou? não redispara
        if (masked === before) return

        running = true

        // posição básica do cursor
        const start = input.selectionStart
        const shift = masked.length - before.length

        input.value = masked

        // restaura caret de forma aproximada
        try {
          const pos = (start ?? masked.length) + shift
          input.setSelectionRange(pos, pos)
        } catch {}

        // dispara input ASSÍNCRONO para quebrar a callstack
        setTimeout(() => {
          input.dispatchEvent(new Event('input', { bubbles: true }))
          running = false
        }, 0)
      }

      input.addEventListener('input', handler)
      input._maskCleanup = () => input.removeEventListener('input', handler)

      // formata valor inicial uma vez (sem loop)
      const initial = fmt(input.value ?? '')
      if (initial !== (input.value ?? '')) {
        input.value = initial
        // notifica v-model fora da pilha atual
        setTimeout(() => {
          input.dispatchEvent(new Event('input', { bubbles: true }))
        }, 0)
      }
    },

    updated(el, binding) {
      if (!process.client) return

      const type = binding.value
      const fmt = formatters[type]
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (!fmt || !input) return

      // só re-formata se necessário; NÃO dispara input aqui para evitar cascata
      const before = input.value ?? ''
      const masked = fmt(before)
      if (masked !== before) {
        input.value = masked
      }
    },

    unmounted(el) {
      if (!process.client) return
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      input?._maskCleanup?.()
      if (input) {
        delete input._maskBound
        delete input._maskCleanup
      }
    },
  })
})
