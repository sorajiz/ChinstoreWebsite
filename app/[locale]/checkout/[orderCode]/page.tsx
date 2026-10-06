import { redirect } from '@/navigation';

export default function CheckoutRedirectPage({
  params,
}: {
  params: { orderCode: string };
}) {
  redirect(`/order/${params.orderCode}`);
}
