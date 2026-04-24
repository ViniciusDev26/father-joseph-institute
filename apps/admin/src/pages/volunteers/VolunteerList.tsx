import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/FadeIn';
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
      .then(res => {
        const validated = listVolunteersResponseSchema.parse(res.data);
        setVolunteers(validated.volunteers);
      })
      .catch(() => setError('Erro ao carregar voluntários'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Voluntários</h1>
          <p className="text-sm text-gray-500 mt-1">Voluntários cadastrados pelo site</p>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && volunteers.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhum voluntário cadastrado.</p>
      )}

      {!loading && !error && volunteers.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {volunteers.map((v, i) => (
              <FadeIn key={v.id} delay={i * 60}>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.profession}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs text-gray-400">
                      {v.availability.days.map(d => DAY_LABELS[d] ?? d).join(', ')}
                    </p>
                    <span className="text-xs text-gray-300">·</span>
                    <p className="text-xs text-gray-400">
                      {v.availability.startTime} – {v.availability.endTime}
                    </p>
                  </div>
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
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Profissão</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Dias</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Horário</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {volunteers.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{v.name}</td>
                      <td className="px-4 py-3 text-gray-600">{v.profession}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {v.availability.days.map(d => DAY_LABELS[d] ?? d).join(', ')}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {v.availability.startTime} – {v.availability.endTime}
                      </td>
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
