export async function buscarCep(cep) {
  try {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return null

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const data = await response.json()

    if (data.erro) return null

    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.estado

    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return null
  }
}
  