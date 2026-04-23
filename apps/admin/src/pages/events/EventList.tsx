import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { listEventsResponseSchema, type Event } from '@/schemas/event';
import { FadeIn } from '@/components/FadeIn';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/events')
      .then((res) => {
        const validated = listEventsResponseSchema.parse(res.data);
        setEvents(validated.events);
      })
      .catch(() => setError('Erro ao carregar eventos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os eventos da instituição</p>
          </div>
          <Link
            to="/events/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Novo evento
          </Link>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhum evento cadastrado.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {events.map((e, i) => (
              <FadeIn key={e.id} delay={i * 60}>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900 text-sm">{e.name}</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{e.photos.length} foto(s)</span>
                  </div>
                  <p className="text-xs text-primary mt-1">{formatDate(e.date)}</p>
                  {e.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{e.description}</p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Desktop table */}
          <FadeIn delay={100} className="hidden md:block">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Fotos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(e.date)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {e.description ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{e.photos.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </>
      )}
    </div>
  );
}
