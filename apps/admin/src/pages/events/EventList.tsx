import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { listEventsResponseSchema, type Event } from '@/schemas/event';

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os eventos da instituição</p>
        </div>
        <Link
          to="/events/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Novo evento
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {events.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">Nenhum evento cadastrado.</p>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
