import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '@/lib/axios';
import { createEventSchema, type CreateEventForm } from '@/schemas/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];

export function EventCreate() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<CreateEventForm>({ resolver: zodResolver(createEventSchema) });

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const invalid = files.filter((f) => !ALLOWED_MIME_TYPES.includes(f.type));
    if (invalid.length > 0) {
      setPhotosError('Apenas PNG ou JPEG são aceitos');
      setPhotoFiles([]);
    } else {
      setPhotosError(null);
      setPhotoFiles(files);
    }
  };

  const onSubmit = async (data: CreateEventForm) => {
    if (photoFiles.length === 0) {
      setPhotosError('Ao menos uma foto é obrigatória');
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const body: Record<string, unknown> = {
        name: data.name,
        date: new Date(data.date).toISOString(),
        photos: photoFiles.map((f) => ({ name: f.name, mimeType: f.type })),
      };
      if (data.description) body.description = data.description;

      const { data: created } = await api.post('/events', body);

      await Promise.all(
        (created.photos as Array<{ presignedUrl: string }>).map((photo, i) =>
          fetch(photo.presignedUrl, {
            method: 'PUT',
            body: photoFiles[i],
            headers: { 'Content-Type': photoFiles[i].type },
          }),
        ),
      );

      navigate('/events');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao cadastrar evento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link to="/events" className="text-sm text-primary hover:underline">
          ← Voltar para eventos
        </Link>
        <h1 className="text-2xl font-bold text-foreground mt-2">Novo evento</h1>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome <span className="text-destructive">*</span></FormLabel>
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
                    <Textarea rows={3} placeholder="Descrição opcional do evento" {...field} />
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
                  <FormLabel>Data e hora <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Fotos <span className="text-destructive">*</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleFilesChange}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
              />
              {photosError && <p className="text-sm font-medium text-destructive">{photosError}</p>}
              {photoFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">{photoFiles.length} foto(s) selecionada(s)</p>
              )}
            </div>

            {apiError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/events">Cancelar</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
