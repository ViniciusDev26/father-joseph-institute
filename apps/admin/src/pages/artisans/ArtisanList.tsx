import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { listArtisansResponseSchema, type Artisan } from '@/schemas/artisan';

export function ArtisanList() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/artisans')
      .then((res) => {
        const validated = listArtisansResponseSchema.parse(res.data);
        setArtisans(validated.artisans);
      })
      .catch(() => setError('Erro ao carregar artesãs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artesãs</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os perfis das artesãs cadastradas</p>
        </div>
        <Link
          to="/artisans/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Nova artesã
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {artisans.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">Nenhuma artesã cadastrada.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Foto</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Telefone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artisans.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={a.photoUrl}
                        alt={a.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{a.email ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {a.description ?? '—'}
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
