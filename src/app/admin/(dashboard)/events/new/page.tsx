'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from '@/lib/admin-api';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FadeIn } from '@/components/admin-fade-in';
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
import { api } from '@/lib/admin-api';
import { type CreateEventForm, createEventSchema } from '@/admin-schemas/event';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];

export default function EventCreate() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photosError, setPhotosError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<CreateEventForm>({ resolver: zodResolver(createEventSchema) });

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const invalid = files.filter(f => !ALLOWED_MIME_TYPES.includes(f.type));
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
        photos: photoFiles.map(f => ({ name: f.name, mimeType: f.type })),
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

      router.push('/admin/events');
    } catch (err) {
      const msg = isApiError(err) && err.data?.message;
      setApiError(msg || 'Erro ao cadastrar evento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="mb-6">
          <Link href="/admin/events" className="text-sm text-primary hover:underline">
            ← Voltar para eventos
          </Link>
          <h1 className="text-2xl font-bold text-foreground mt-2">Novo evento</h1>
        </div>
      </FadeIn>

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
                {photosError && (
                  <p className="text-sm font-medium text-destructive">{photosError}</p>
                )}
                {photoFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {photoFiles.length} foto(s) selecionada(s)
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
                  {submitting ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/admin/events">Cancelar</Link>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </FadeIn>
    </div>
  );
}
