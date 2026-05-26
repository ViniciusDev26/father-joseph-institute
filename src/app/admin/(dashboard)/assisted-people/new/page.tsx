'use client';

import { isApiError } from '@/lib/admin-api';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FadeIn } from '@/components/admin-fade-in';
import { api } from '@/lib/admin-api';
import type { AssistedPersonForm as AssistedPersonFormValues } from '@/admin-schemas/assisted-person';
import { AssistedPersonForm } from '../assisted-person-form';

export default function AssistedPersonCreate() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: AssistedPersonFormValues) => {
    setSubmitting(true);
    setApiError(null);
    try {
      const body: Record<string, unknown> = { name: data.name };
      if (data.description) body.description = data.description;
      await api.post('/assisted-people', body);
      router.push('/admin/assisted-people');
    } catch (err) {
      const msg = isApiError(err) && err.data?.message;
      setApiError(msg || 'Erro ao cadastrar morador. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link href="/admin/assisted-people" className="text-sm text-primary hover:underline">
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
