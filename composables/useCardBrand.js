const BRANDS = [
  { name: 'visa',       re: /^4[0-9]{6,}$/ },
  { name: 'mastercard', re: /^(5[1-5][0-9]{5,}|2(2[2-9][0-9]{4,}|[3-6][0-9]{5,}|7[01][0-9]{4,}|720[0-9]{3,}))$/ },
  { name: 'amex',       re: /^3[47][0-9]{5,}$/ },
  { name: 'elo',        re: /^(4011(78|79)|431274|438935|451416|457(393|6)|504175|627780|636(297|368)|650\d{3}|6516\d{2}|6550\d{2})/ },
  { name: 'hipercard',  re: /^(606282|3841[046]{1})/ },
]

export function useCardBrand () {
  const getBrand = (num = '') => {
    const digits = (num || '').replace(/\D/g, '')
    const found = BRANDS.find(b => b.re.test(digits))
    return found?.name || null
  }

  const brandIcon = (brand) => {
    // use o pacote mdi que você já tem, ou mapeie pra imagens locais
    const map = {
      visa: 'mdi-visa', mastercard: 'mdi-mastercard', amex: 'mdi-american-express',
      elo: 'mdi-credit-card-outline', hipercard: 'mdi-credit-card-outline',
    }
    return map[brand] || 'mdi-credit-card-outline'
  }

  return { getBrand, brandIcon }
}
