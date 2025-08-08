// utils/cardBrand.js
export const onlyDigits = v => (v || '').toString().replace(/\D/g, '')

export function detectCardBrand (num) {
  // bem simplificado (cobre os principais)
  if (/^4\d{6,}/.test(num)) return 'Visa'
  if (/^5[1-5]\d{5,}/.test(num) || /^2(2[2-9]|[3-7]\d)\d{4,}/.test(num)) return 'MasterCard'
  if (/^3[47]\d{5,}/.test(num)) return 'Amex'
  if (/^((606282|3841(?![0|1]))|50(3|6|7|9)\d|627780|636297|636368)\d+/.test(num)) return 'Elo'
  if (/^(606282|3841)\d+/.test(num)) return 'Hipercard'
  return 'Desconhecida'
}

// Luhn
export function luhnValid (num) {
  const s = onlyDigits(num)
  let sum = 0; let alt = false
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i])
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n
    alt = !alt
  }
  return (sum % 10) === 0 && s.length >= 13
}

// CPF
export function isValidCPF (cpf) {
  const s = onlyDigits(cpf)
  if (s.length !== 11) return false
  if (/^(\d)\1+$/.test(s)) return false
  const calc = base => {
    let sum = 0
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i]) * (base.length + 1 - i)
    const mod = (sum * 10) % 11
    return mod === 10 ? 0 : mod
  }
  const d1 = calc(s.slice(0, 9))
  const d2 = calc(s.slice(0, 10))
  return d1 === parseInt(s[9]) && d2 === parseInt(s[10])
}
