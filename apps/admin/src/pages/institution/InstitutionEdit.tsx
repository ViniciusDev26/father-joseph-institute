import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { api } from '@/lib/axios';
import {
  institutionSchema,
  updateInstitutionSchema,
  type Institution,
  type UpdateInstitutionForm,
} from '@/schemas/institution';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/FadeIn';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function InstitutionEdit() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<UpdateInstitutionForm>({ resolver: zodResolver(updateInstitutionSchema) });

  useEffect(() => {
    api
      .get('/institution')
      .then((res) => {
        const validated = institutionSchema.parse(res.data);
        setInstitution(validated);
        form.reset({
          instagram: validated.instagram ?? '',
          whatsapp: validated.whatsapp ?? '',
          pixKey: validated.pixKey ?? '',
        });
      })
      .catch(() => setFetchError('Erro ao carregar dados da instituição'))
      .finally(() => setLoading(false));
  }, [form]);

  const onSubmit = async (data: UpdateInstitutionForm) => {
    const body: Record<string, string> = {};
    if (data.instagram) body.instagram = data.instagram;
    if (data.whatsapp) body.whatsapp = data.whatsapp;
    if (data.pixKey) body.pixKey = data.pixKey;

    if (Object.keys(body).length === 0) {
      setApiError('Informe ao menos um campo para atualizar');
      return;
    }

    setSubmitting(true);
    setApiError(null);
    setSuccess(false);
    try {
      await api.patch('/institution', body);
      setSuccess(true);
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao salvar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4 md:p-8 text-sm text-muted-foreground">Carregando...</div>;
  if (fetchError) return <div className="p-4 md:p-8 text-sm text-destructive">{fetchError}</div>;

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Instituição</h1>
          <p className="text-sm text-muted-foreground mt-1">Atualize os dados de contato da instituição</p>
        </div>
      </FadeIn>

      {institution && (
        <FadeIn delay={60}>
          <div className="bg-muted/50 rounded-lg border border-border px-4 py-3 mb-6 space-y-1 max-w-xl">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Nome:</span> {institution.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Slug:</span> {institution.slug}
            </p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={120}>
        <div className="bg-card rounded-lg border border-border p-4 md:p-6 max-w-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 py-2 text-sm text-muted-foreground h-10">
                          @
                        </span>
                        <Input
                          className="rounded-l-none"
                          placeholder="institutopадrejose"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Apenas dígitos (ex: 85912345678)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pixKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave PIX</FormLabel>
                    <FormControl>
                      <Input placeholder="Telefone, CPF, e-mail ou chave aleatória" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {apiError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>
              )}
              {success && (
                <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                  Dados atualizados com sucesso.
                </p>
              )}

              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </FadeIn>
    </div>
  );
}
