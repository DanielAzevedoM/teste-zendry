export const users = [
  {
    id: '2f1e7b6a-7ec6-4f56-9480-3a3e9e7e6f8e',
    name: 'Daniel Azevêdo',
    email: 'daniel@example.com',
    cpf: '05782615532',
    phone: '82999999999',
    address: {
      city: 'Maceió',
      state: 'AL',
      country: 'BR',
      zip: '57000000',
      neighborhood: 'Ponta Verde',
      complement: 'Apt 301',
      street: 'Av. Álvaro Otacílio',
    },
    checkbox: true
  },
  {
    id: '0a8f3f92-2c97-40ad-a69e-93a3c387dfd0',
    name: 'Joana Silva',
    email: 'joana@example.com',
    cpf: '05782615532',
    phone: '21988888888',
    address: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'BR',
      zip: '20000000',
      neighborhood: 'Copacabana',
      complement: 'Casa 2',
      street: 'Rua Barata Ribeiro',
    },
    checkbox: false
  },
  {
    id: 'd7e2cf7f-06f1-4370-894f-858b517e7741',
    name: 'Carlos Souza',
    email: 'carlos@example.com',
    cpf: '05782615532',
    phone: '1133333333',
    address: {
      city: 'São Paulo',
      state: 'SP',
      country: 'BR',
      zip: '01000000',
      neighborhood: 'Sé',
      complement: '',
      street: 'Praça da Sé',
    },
    checkbox: false
  }
]

export const paymentsMock = [
  {
    id: "pay_001",
    type: "", // pix | cartao | boleto
    amount: 150.10, // valor original
    discount:0,
    currency: "BRL",
    expiresAt: "2025-08-07T20:30:00Z",
    isCompleted: false,
    qrCode: "00020101021226850014BR.GOV.BCB.PIX2560pixcodeexemplodepagamentofintech.com/pix/1234567890", // PIX
    qrCodeImage: "https://fakeimg.pl/300x300/?text=QR+Code",
    customer: {
      id:""
    }
  },
  {
    id: "pay_002",
    type: "cartao",
    amount: 89.90,
    discount: 0,
    currency: "BRL",
    expiresAt: null, // cartão geralmente não expira o checkout
    isCompleted: true,
    customer: {
      id:""
    },
    cardLastDigits: "1234",
    authorizationCode: "A1B2C3"
  },
  {
    id: "pay_003",
    type: "boleto",
    amount: 250.00,
    discount: 0,
    currency: "BRL",
    expiresAt: "2025-08-10T23:59:59Z",
    isCompleted: false,
    boletoUrl: "https://example.com/boleto/123456",
    customer: {
      id:""
    }
  }
]

export const cupons = [
    {
        code: "BLACKFRIDAY",
        discount: 20,
        expiresAt: "2025-11-30T23:59:59Z"
    },
    {
        code: "NATAL2025",
        discount: 15,
        expiresAt: "2025-12-25T23:59:59Z"
    },
    {
        code: "VERAO2026",
        discount: 10,
        expiresAt: "2026-01-31T23:59:59Z"
    }
]