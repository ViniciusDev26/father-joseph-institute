import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
import { api } from '@/lib/axios';
import {
  listOrdersResponseSchema,
  type Order,
  type OrderStatus,
  updateOrderObservationsResponseSchema,
  updateOrderStatusResponseSchema,
} from '@/schemas/order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  delivered: 'Entregue',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
};

const STATUSES: OrderStatus[] = ['pending', 'paid', 'delivered'];

function formatCurrency(value: number) {
  return value.toFixed(2).replace('.', ',');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [observationsDraft, setObservationsDraft] = useState<Record<number, string>>({});
  const [savingObsId, setSavingObsId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get('/orders')
      .then(res => {
        const validated = listOrdersResponseSchema.parse(res.data);
        setOrders(validated.orders);
      })
      .catch(() => setError('Erro ao carregar pedidos'))
      .finally(() => setLoading(false));
  }, []);

  async function handleObservationsSave(id: number) {
    const value = observationsDraft[id] ?? '';
    setSavingObsId(id);
    try {
      const res = await api.patch(`/orders/${id}/observations`, {
        observations: value.trim() === '' ? null : value,
      });
      const updated = updateOrderObservationsResponseSchema.parse(res.data);
      setOrders(prev =>
        prev.map(o => (o.id === updated.id ? { ...o, observations: updated.observations } : o)),
      );
      setObservationsDraft(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      setError('Erro ao salvar observações');
    } finally {
      setSavingObsId(null);
    }
  }

  async function handleStatusChange(id: number, status: OrderStatus) {
    setUpdatingId(id);
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      const updated = updateOrderStatusResponseSchema.parse(res.data);
      setOrders(prev =>
        prev.map(o => (o.id === updated.id ? { ...o, status: updated.status } : o)),
      );
    } catch {
      setError('Erro ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Pedidos gerados no checkout do site</p>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhum pedido registrado.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <FadeIn key={order.id} delay={i * 60}>
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">Pedido #{order.id}</p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      sessão: {order.sessionId.slice(0, 8)}…
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <p className="text-lg font-mono font-semibold text-primary">
                      R$ {formatCurrency(order.total)}
                    </p>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-sm rounded-md border border-gray-300 px-2 py-1 bg-white disabled:opacity-50"
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between gap-4">
                        <span>
                          {item.quantity}× {item.productName}
                        </span>
                        <span className="font-mono text-gray-500">
                          R$ {formatCurrency(item.unitPrice)} cada
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3">
                  <label
                    htmlFor={`observations-${order.id}`}
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Observações
                  </label>
                  <textarea
                    id={`observations-${order.id}`}
                    rows={2}
                    value={observationsDraft[order.id] ?? order.observations ?? ''}
                    onChange={e =>
                      setObservationsDraft(prev => ({ ...prev, [order.id]: e.target.value }))
                    }
                    placeholder="Anote qualquer observação sobre este pedido"
                    className="w-full text-sm rounded-md border border-gray-300 px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {observationsDraft[order.id] !== undefined &&
                    observationsDraft[order.id] !== (order.observations ?? '') && (
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setObservationsDraft(prev => {
                              const next = { ...prev };
                              delete next[order.id];
                              return next;
                            })
                          }
                          className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={savingObsId === order.id}
                          onClick={() => handleObservationsSave(order.id)}
                          className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 disabled:opacity-50"
                        >
                          {savingObsId === order.id ? 'Salvando…' : 'Salvar'}
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
