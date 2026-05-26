'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    const token = btoa(`${data.username}:${data.password}`);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { Authorization: `Basic ${token}` },
    });

    if (!res.ok) {
      form.setError('root', { message: 'Credenciais inválidas. Verifique usuário e senha.' });
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: '#2d2418' }}
      >
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-terracotta text-cream font-bold text-xl">
            IPJ
          </div>
        </div>

        <div className="space-y-4">
          <blockquote className="text-2xl font-light leading-relaxed" style={{ color: '#fbf7f1' }}>
            "Cuidando de quem precisa, valorizando quem cria."
          </blockquote>
          <p className="text-sm" style={{ color: '#c99a2e' }}>
            Instituto Padre José — Painel Administrativo
          </p>
        </div>

        <p className="text-xs" style={{ color: '#6b5a48' }}>
          Acesso restrito a colaboradores autorizados.
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-cream">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-terracotta text-cream font-bold text-xl mb-4">
              IPJ
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-bark">Bom te ver!</h1>
            <p className="mt-1 text-sm text-bark-light">Entre com suas credenciais para continuar</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" placeholder="admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="rounded-md bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-sm text-red-700">{form.formState.errors.root.message}</p>
                </div>
              )}

              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
