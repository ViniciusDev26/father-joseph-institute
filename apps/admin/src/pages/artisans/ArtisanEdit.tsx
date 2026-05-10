import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FadeIn } from '@/components/FadeIn';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/axios';
import { artisanSchema, type UpdateArtisanForm, updateArtisanSchema } from '@/schemas/artisan';

export function ArtisanEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const form = useForm<UpdateArtisanForm>({
    resolver: zodResolver(updateArtisanSchema),
    defaultValues: { name: '', phone: '', email: '', description: '' },
  });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/artisans/${id}`)
      .then(res => {
        const artisan = artisanSchema.parse(res.data);
        form.reset({
          name: artisan.name,
          phone: artisan.phone ?? '',
          email: artisan.email ?? '',
          description: artisan.description ?? '',
        });
        setPhotoUrl(artisan.photoUrl);
      })
      .catch(() => setLoadError('Artesã não encontrada'))
      .finally(() => setLoading(false));
  }, [id, form]);

  const onSubmit = async (data: UpdateArtisanForm) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await api.patch(`/artisans/${id}`, {
        name: data.name,
        phone: data.phone ? data.phone : null,
        email: data.email ? data.email : null,
        description: data.description ? data.description : null,
      });
      navigate('/artisans');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao atualizar artesã. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link to="/artisans" className="text-sm text-primary hover:underline">
            ← Voltar para artesãs
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Editar artesã</h1>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!loading && !loadError && (
        <FadeIn delay={80}>
          <div className="bg-card rounded-lg border border-border p-4 md:p-6 max-w-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {photoUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Foto atual</label>
                    <img src={photoUrl} alt="" className="w-24 h-24 rounded-full object-cover" />
                    <p className="text-xs text-muted-foreground">
                      A foto não pode ser editada por aqui.
                    </p>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="11 dígitos (apenas números)"
                          maxLength={11}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Bio ou descrição do trabalho" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {apiError && (
                  <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {apiError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                    {submitting ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link to="/artisans">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
