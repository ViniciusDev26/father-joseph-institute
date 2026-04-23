import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginData = z.infer<typeof loginSchema>;

export function Login() {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const { register, handleSubmit, setError } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const token = btoa(`${data.username}:${data.password}`);
      // Testa o token na API
      await api.post('/auth/validate', {}, {
        headers: { Authorization: `Basic ${token}` }
      });
      
      setToken(token);
      navigate('/');
    } catch {
      setError('root', { message: 'Credenciais inválidas' });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-96 space-y-4 p-8 border rounded-lg shadow">
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input {...register('username')} placeholder="Usuário" className="w-full p-2 border rounded" />
        <input {...register('password')} type="password" placeholder="Senha" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
