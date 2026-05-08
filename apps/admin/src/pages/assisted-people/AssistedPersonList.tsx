import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/FadeIn';
import { api } from '@/lib/axios';
import {
  type AssistedPerson,
  listAssistedPeopleResponseSchema,
} from '@/schemas/assisted-person';

export function AssistedPersonList() {
  const [people, setPeople] = useState<AssistedPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/assisted-people')
      .then(res => {
        const validated = listAssistedPeopleResponseSchema.parse(res.data);
        setPeople(validated.assistedPeople);
      })
      .catch(() => setError('Erro ao carregar moradores'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este morador?')) return;
    try {
      await api.delete(`/assisted-people/${id}`);
      setPeople(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) || 'Erro ao remover morador';
      window.alert(msg);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Moradores de rua
              {!loading && !error && (
                <span className="ml-2 text-base font-normal text-gray-500">({people.length})</span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os moradores assistidos pelo instituto
            </p>
          </div>
          <Link
            to="/assisted-people/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Novo morador
          </Link>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && people.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhum morador cadastrado.</p>
      )}

      {!loading && !error && people.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {people.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60}>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                  {p.description && (
                    <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                      {p.description}
                    </p>
                  )}
                  <div className="flex gap-3 mt-3">
                    <Link
                      to={`/assisted-people/${p.id}/edit`}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
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
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 w-40">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {people.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xl truncate">
                        {p.description ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link
                          to={`/assisted-people/${p.id}/edit`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
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
