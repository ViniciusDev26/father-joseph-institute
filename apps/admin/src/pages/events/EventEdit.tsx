import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
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
import { eventSchema, type UpdateEventForm, updateEventSchema } from '@/schemas/event';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: number; url: string }[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState<string | null>(null);

  const form = useForm<UpdateEventForm>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: { name: '', description: '', date: '' },
  });

  useEffect(() => {
    if (!id) return;
    api
      .get(`/events/${id}`)
      .then(res => {
        const event = eventSchema.parse(res.data);
        form.reset({
          name: event.name,
          description: event.description ?? '',
          date: toLocalInputValue(event.date),
        });
        setPhotos(event.photos);
      })
      .catch(() => setLoadError('Evento não encontrado'))
      .finally(() => setLoading(false));
  }, [id, form]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const invalid = files.filter(f => !ALLOWED_MIME_TYPES.includes(f.type));
    if (invalid.length > 0) {
      setFilesError('Apenas PNG ou JPEG são aceitos');
      setNewFiles([]);
    } else {
      setFilesError(null);
      setNewFiles(files);
    }
  };

  const onSubmit = async (data: UpdateEventForm) => {
    setSubmitting(true);
    setApiError(null);
    try {
      await api.patch(`/events/${id}`, {
        name: data.name,
        description: data.description ? data.description : null,
        date: new Date(data.date).toISOString(),
      });

      if (newFiles.length > 0) {
        const { data: created } = await api.post(`/events/${id}/photos`, {
          photos: newFiles.map(f => ({ name: f.name, mimeType: f.type })),
        });

        await Promise.all(
          (created.photos as Array<{ presignedUrl: string }>).map((photo, i) =>
            fetch(photo.presignedUrl, {
              method: 'PUT',
              body: newFiles[i],
              headers: { 'Content-Type': newFiles[i].type },
            }),
          ),
        );
      }

      navigate('/events');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao atualizar evento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link to="/events" className="text-sm text-primary hover:underline">
            ← Voltar para eventos
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Editar evento</h1>
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
                        <Input placeholder="Nome do evento" {...field} />
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
                        <Textarea
                          rows={3}
                          placeholder="Descrição opcional do evento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Data e hora <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Adicionar novas fotos
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    multiple
                    onChange={handleFilesChange}
                    className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
                  />
                  {filesError && (
                    <p className="text-sm font-medium text-destructive">{filesError}</p>
                  )}
                  {newFiles.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {newFiles.length} nova(s) foto(s) selecionada(s)
                    </p>
                  )}
                </div>

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
                    <Link to="/events">Cancelar</Link>
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
