// utils/mask.js


export function formatCPF(value = '') {
  const v = onlyDigits(value).slice(0, 11)
  if (v.length <= 3) return v
  if (v.length <= 6) return `${v.slice(0,3)}.${v.slice(3)}`
  if (v.length <= 9) return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`
  return `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`
}

export function formatCEP(value = '') {
  const v = onlyDigits(value).slice(0, 8)
  if (v.length <= 5) return v
  return `${v.slice(0,5)}-${v.slice(5)}`
}

export function formatExpiry(value = '') {
  const v = onlyDigits(value).slice(0, 4) // MMYY
  if (v.length <= 2) return v
  return `${v.slice(0,2)}/${v.slice(2)}`
}
