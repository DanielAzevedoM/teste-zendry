// services/paymentApi.js

import { createTransaction } from '@/services/transactionService'
import { usePaymentStore } from '@/stores/paymentStore'

let _ws

export function setWs (ws) { _ws = ws }


export async function fetchPayment (id) {
 const payment = usePaymentStore()
 await new Promise(r => setTimeout(r, 300))

 return {
 id,
 amount: payment.amount,
 discount: 2990,
 total: 10000,
 currency: 'BRL',
 }
}


export async function createPayment ({ id, method, payload }) {
 
 await new Promise(r => setTimeout(r, 400))

 
 const tx = await createTransaction({
 orderId: id,
 method,
 ...payload, 
 })

 
 _ws?.emit('payment:status', {
 id, 
 status: 'processing',
 method,
 transactionId: tx.id, 
 createdAt: tx.createdAt,
 details: {
 orderId: tx.orderId,
 amount: tx.amount,
 discount: tx.discount,
 buyer: tx.buyer, 
 methodDetails: tx.details || null, 
 },
 })

 
 setTimeout(() => {
 _ws?.emit('payment:status', {
 id,
 status: 'approved',
 method,
 transactionId: tx.id,
 approvedAt: new Date().toISOString(),
 })
 }, 3200) 

 
 if (method === 'credit_card') {
 
 return { ok: true }
 }

 if (method === 'pix') {
 
 const expiresAt = Date.now() + 5 * 60 * 1000 
 const qrCode = "00020101021226850014BR.GOV.BCB.PIX2560pixcodeexemplodepagamentofintech.com/pix/1234567890"
 const qrCodeImage = "https://gerarqrcodepix.com.br/api/v1?brcode=00020126580014br.gov.bcb.pix0136a623122b-d341-4d1a-b850-9844a45a121552040000530398654041.005802BR5913APIDEMOPAGARME6009SAO%20PAULO62070503***6304E4A2&tamanho=256"
 return { ok: true, qrCode, qrCodeImage, expiresAt }
 }

 if (method === 'boleto') {
 
 const boletoUrl = "https://www.boletobancario.com/boletofacil/img/boleto-facil-exemplo.png"
 const linhaDigitavel = "34191.79001 01043.510047 91020.101014 1 93250000150000"
 return { ok: true, boletoUrl, linhaDigitavel }
 }

 
 return { ok: true }
}