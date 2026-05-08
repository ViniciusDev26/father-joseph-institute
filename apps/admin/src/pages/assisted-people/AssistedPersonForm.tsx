import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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
import {
  type AssistedPersonForm as AssistedPersonFormValues,
  assistedPersonFormSchema,
} from '@/schemas/assisted-person';

type Props = {
  defaultValues?: AssistedPersonFormValues;
  submitting: boolean;
  apiError: string | null;
  submitLabel: string;
  onSubmit: (data: AssistedPersonFormValues) => void | Promise<void>;
};

export function AssistedPersonForm({
  defaultValues,
  submitting,
  apiError,
  submitLabel,
  onSubmit,
}: Props) {
  const form = useForm<AssistedPersonFormValues>({
    resolver: zodResolver(assistedPersonFormSchema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  });

  return (
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
                <Input placeholder="Nome do morador" {...field} />
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
                <Textarea rows={4} placeholder="Anotações sobre o morador" {...field} />
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
            {submitting ? 'Salvando...' : submitLabel}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/assisted-people">Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
