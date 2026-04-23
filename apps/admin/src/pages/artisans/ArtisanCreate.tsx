import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '@/lib/axios';
import { createArtisanSchema, type CreateArtisanForm } from '@/schemas/artisan';
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

export function ArtisanCreate() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<CreateArtisanForm>({ resolver: zodResolver(createArtisanSchema) });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setPhotoError('Apenas PNG ou JPEG são aceitos');
      setPhotoFile(null);
    } else {
      setPhotoError(null);
      setPhotoFile(file);
    }
  };

  const onSubmit = async (data: CreateArtisanForm) => {
    if (!photoFile) {
      setPhotoError('Foto é obrigatória');
      return;
    }
    setSubmitting(true);
    setApiError(null);
    try {
      const body: Record<string, unknown> = {
        name: data.name,
        photo: { mimeType: photoFile.type },
      };
      if (data.phone) body.phone = data.phone;
      if (data.email) body.email = data.email;
      if (data.description) body.description = data.description;

      const { data: created } = await api.post('/artisans', body);

      await fetch(created.presignedUrl, {
        method: 'PUT',
        body: photoFile,
        headers: { 'Content-Type': photoFile.type },
      });

      navigate('/artisans');
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      setApiError(msg || 'Erro ao cadastrar artesã. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link to="/artisans" className="text-sm text-primary hover:underline">
          ← Voltar para artesãs
        </Link>
        <h1 className="text-2xl font-bold text-foreground mt-2">Nova artesã</h1>
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
                    <Input placeholder="11 dígitos (apenas números)" maxLength={11} {...field} />
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

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Foto <span className="text-destructive">*</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground hover:file:bg-secondary/80"
              />
              {photoError && <p className="text-sm font-medium text-destructive">{photoError}</p>}
              {photoFile && <p className="text-xs text-muted-foreground">{photoFile.name}</p>}
            </div>

            {apiError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{apiError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/artisans">Cancelar</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
