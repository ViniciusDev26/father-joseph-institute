import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginData = z.infer<typeof loginSchema>;

export function Login() {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const form = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    try {
      const token = btoa(`${data.username}:${data.password}`);
      await api.post('/auth/validate', {}, {
        headers: { Authorization: `Basic ${token}` },
      });
      setToken(token);
      navigate('/');
    } catch {
      form.setError('root', { message: 'Credenciais inválidas. Verifique usuário e senha.' });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Painel esquerdo — identidade */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ backgroundColor: '#3d2b1f' }}
      >
        <div>
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-xl"
            style={{ backgroundColor: '#c8855a' }}
          >
            IPJ
          </div>
        </div>

        <div className="space-y-4">
          <blockquote className="text-2xl font-light leading-relaxed" style={{ color: '#f5e6d3' }}>
            "Cuidando de quem precisa, valorizando quem cria."
          </blockquote>
          <p className="text-sm" style={{ color: '#a08070' }}>
            Instituto Padre José — Painel Administrativo
          </p>
        </div>

        <p className="text-xs" style={{ color: '#6b5040' }}>
          Acesso restrito a colaboradores autorizados.
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          {/* Header mobile */}
          <div className="lg:hidden text-center">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-xl mb-4"
              style={{ backgroundColor: '#c8855a' }}
            >
              IPJ
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bom te ver!</h1>
            <p className="mt-1 text-sm text-gray-500">
              Entre com suas credenciais para continuar
            </p>
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
                      <Input
                        autoComplete="username"
                        placeholder="admin"
                        {...field}
                      />
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
                  <p className="text-sm text-red-700">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
                style={{ backgroundColor: '#c8855a' }}
              >
                {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
