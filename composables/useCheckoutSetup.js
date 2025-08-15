
import { usePaymentStore } from '@/stores/paymentStore';
import { useGeneratorStore } from '~/stores/generatorStore';
import { getOrder } from '~/services/orderService';
import { getConfig } from '~/services/configService';
import { getCustomer } from '~/services/customerService';

export function useCheckoutSetup(formData) {
  const paymentStore = usePaymentStore();
  const generatorStore = useGeneratorStore();
  const router = useRouter();

  const setupCheckout = async (orderId) => {
    if (!orderId) throw new Error("ID do pedido não fornecido.");

    const order = await getOrder(orderId);
    if (!order) throw new Error('Pedido não encontrado.');

    if (order.status === 'PAGO') {
      alert("Este pedido já foi pago. Redirecionando...");
      router.push('/orders');
      return { isReady: false };
    }

    if (order.status === 'EXPIRADO') {
      alert("Este pedido já está expirado. Redirecionando...");
      router.push('/orders');
      return { isReady: false };
    }

    const config = await getConfig(order.configId);
    generatorStore.setConfig(config);

    const paymentData = { id: order.id, amount: order.amount, discount: order.discount, paymentDetails: order.paymentDetails, customerIdentifier: order.customerIdentifier };
    paymentStore.setPayment(paymentData);

    const customer = await getCustomer(order.customerIdentifier);
    if (customer) {
      formData.name = customer.name || '';
      formData.email = customer.email || '';
      formData.cpf = customer.cpf || '';
      formData.phone = customer.phone || '';
      if (customer.address) {
        formData.address = { ...formData.address, ...customer.address };
      }
    } else if (order.customerIdentifier) {
      formData.email = order.customerIdentifier;
    }

    return { isReady: true, order, config };
  };

  return { setupCheckout };
}