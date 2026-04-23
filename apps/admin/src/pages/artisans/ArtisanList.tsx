import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { listArtisansResponseSchema, type Artisan } from '@/schemas/artisan';
import { FadeIn } from '@/components/FadeIn';

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
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Artesãs</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os perfis das artesãs cadastradas</p>
          </div>
          <Link
            to="/artisans/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Nova artesã
          </Link>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && artisans.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhuma artesã cadastrada.</p>
      )}

      {!loading && !error && artisans.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {artisans.map((a, i) => (
              <FadeIn key={a.id} delay={i * 60}>
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 items-start">
                  <img
                    src={a.photoUrl}
                    alt={a.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                    {a.phone && <p className="text-xs text-gray-500 mt-0.5">{a.phone}</p>}
                    {a.email && <p className="text-xs text-gray-500">{a.email}</p>}
                    {a.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.description}</p>
                    )}
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
            </div>
          </FadeIn>
        </>
      )}
    </div>
  );
}
