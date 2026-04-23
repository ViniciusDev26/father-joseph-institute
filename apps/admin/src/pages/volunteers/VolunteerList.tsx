import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { listVolunteersResponseSchema, type Volunteer } from '@/schemas/volunteer';

const DAY_LABELS: Record<string, string> = {
  monday: 'Seg',
  tuesday: 'Ter',
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom',
};

export function VolunteerList() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/volunteers')
      .then((res) => {
        const validated = listVolunteersResponseSchema.parse(res.data);
        setVolunteers(validated.volunteers);
      })
      .catch(() => setError('Erro ao carregar voluntários'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Voluntários</h1>
        <p className="text-sm text-gray-500 mt-1">Voluntários cadastrados pelo site</p>
      </div>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {volunteers.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">Nenhum voluntário cadastrado.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Profissão</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Dias</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                    <td className="px-4 py-3 text-gray-600">{v.profession}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {v.availability.days.map((d) => DAY_LABELS[d] ?? d).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {v.availability.startTime} – {v.availability.endTime}
                    </td>
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
