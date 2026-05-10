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
import { type Artisan, listArtisansResponseSchema } from '@/schemas/artisan';
import { productSchema, type UpdateProductForm, updateProductSchema } from '@/schemas/product';

export function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [selectedArtisanIds, setSelectedArtisanIds] = useState<number[]>([]);
  const [artisanError, setArtisanError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: number; url: string }[]>([]);

  const form = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: { name: '', description: '', price: 0 },
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([api.get(`/products/${id}`), api.get('/artisans')])
      .then(([productRes, artisansRes]) => {
        const product = productSchema.parse(productRes.data);
        const artisansList = listArtisansResponseSchema.parse(artisansRes.data).artisans;
        form.reset({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
        });
        setSelectedArtisanIds(product.artisans.map(a => a.id));
        setPhotos(product.photos);
        setArtisans(artisansList);
      })
      .catch(() => setLoadError('Produto não encontrado'))
      .finally(() => setLoading(false));
  }, [id, form]);

  const toggleArtisan = (artisanId: number) => {
    setSelectedArtisanIds(prev =>
      prev.includes(artisanId) ? prev.filter(x => x !== artisanId) : [...prev, artisanId],
    );
    setArtisanError(null);
  };

  const onSubmit = async (data: UpdateProductForm) => {
    if (selectedArtisanIds.length === 0) {
      setArtisanError('Selecione ao menos uma artesã');
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      await api.patch(`/products/${id}`, {
        name: data.name,
        description: data.description ? data.description : null,
        price: data.price,
        artisanIds: selectedArtisanIds,
      });
      navigate('/products');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao atualizar produto. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link to="/products" className="text-sm text-primary hover:underline">
            ← Voltar para produtos
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Editar produto</h1>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!loading && !loadError && (
        <FadeIn delay={80}>
          <div className="bg-card rounded-lg border border-border p-4 md:p-6 max-w-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do produto" {...field} />
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
                        <Textarea rows={3} placeholder="Descrição opcional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Preço (R$) <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0,00"
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Artesãs <span className="text-destructive">*</span>
                  </label>
                  {artisans.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhuma artesã disponível.</p>
                  ) : (
                    <div
                      className={`space-y-2 max-h-40 overflow-y-auto rounded-md border p-3 ${
                        artisanError ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      {artisans.map(a => (
                        <label key={a.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedArtisanIds.includes(a.id)}
                            onChange={() => toggleArtisan(a.id)}
                            className="rounded border-input text-primary"
                          />
                          <span className="text-sm text-foreground">{a.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {artisanError && (
                    <p className="text-sm font-medium text-destructive">{artisanError}</p>
                  )}
                </div>

                {photos.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Fotos atuais</label>
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map(photo => (
                        <img
                          key={photo.id}
                          src={photo.url}
                          alt=""
                          className="aspect-square w-full rounded-md object-cover"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      As fotos não podem ser editadas por aqui.
                    </p>
                  </div>
                )}

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
                    <Link to="/products">Cancelar</Link>
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
