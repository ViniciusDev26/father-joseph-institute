import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FadeIn } from '@/components/FadeIn';
import { api } from '@/lib/axios';
import {
  type AssistedPersonForm as AssistedPersonFormValues,
  assistedPersonSchema,
} from '@/schemas/assisted-person';
import { AssistedPersonForm } from './AssistedPersonForm';

export function AssistedPersonEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<AssistedPersonFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/assisted-people/${id}`)
      .then(res => {
        const validated = assistedPersonSchema.parse(res.data);
        setDefaultValues({
          name: validated.name,
          description: validated.description ?? '',
        });
      })
      .catch(() => setLoadError('Morador não encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: AssistedPersonFormValues) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await api.patch(`/assisted-people/${id}`, {
        name: data.name,
        description: data.description ? data.description : null,
      });
      navigate('/assisted-people');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao atualizar morador. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link to="/assisted-people" className="text-sm text-primary hover:underline">
            ← Voltar para moradores
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Editar morador</h1>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!loading && !loadError && defaultValues && (
        <FadeIn delay={80}>
          <div className="bg-card rounded-lg border border-border p-4 md:p-6 max-w-xl">
            <AssistedPersonForm
              defaultValues={defaultValues}
              submitting={submitting}
              apiError={apiError}
              submitLabel="Salvar alterações"
              onSubmit={onSubmit}
            />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
