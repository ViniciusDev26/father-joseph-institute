import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/FadeIn';
import { api } from '@/lib/axios';
import type { AssistedPersonForm as AssistedPersonFormValues } from '@/schemas/assisted-person';
import { AssistedPersonForm } from './AssistedPersonForm';

export function AssistedPersonCreate() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: AssistedPersonFormValues) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const body: Record<string, unknown> = { name: data.name };
      if (data.description) body.description = data.description;
      await api.post('/assisted-people', body);
      navigate('/assisted-people');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao cadastrar morador. Tente novamente.');
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
          <h1 className="text-2xl font-bold text-foreground mt-2">Novo morador</h1>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 max-w-xl">
          <AssistedPersonForm
            submitting={submitting}
            apiError={apiError}
            submitLabel="Salvar"
            onSubmit={onSubmit}
          />
        </div>
      </FadeIn>
    </div>
  );
}
