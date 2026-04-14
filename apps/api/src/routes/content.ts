import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { siteContentSchema } from '../schemas/content';
import type { SiteContent } from '../types/content';

const content: SiteContent = {
  about: {
    hero: {
      tag: 'Conheça nossa história',
      title: 'Quem Somos',
      subtitle: '[Subtítulo — uma frase impactante sobre a missão do instituto]',
    },
    mission: {
      quote:
        '[Missão do instituto — a frase principal que define o propósito e a razão de existir da organização]',
    },
    story: {
      tag: 'Nossa História',
      title: '[Título da história do instituto]',
      paragraphs: [
        '[Primeiro parágrafo — conte sobre a fundação do instituto, quem foi o Padre José, como surgiu a iniciativa e o que motivou sua criação]',
        '[Segundo parágrafo — fale sobre o crescimento, como o trabalho com as artesãs começou e o impacto na comunidade ao longo do tempo]',
      ],
      image: '',
    },
    values: {
      tag: 'O que nos guia',
      title: 'Nossos Valores',
      items: [
        { title: '[Valor 1]', description: '[Descrição do primeiro valor do instituto]' },
        { title: '[Valor 2]', description: '[Descrição do segundo valor do instituto]' },
        { title: '[Valor 3]', description: '[Descrição do terceiro valor do instituto]' },
        { title: '[Valor 4]', description: '[Descrição do quarto valor do instituto]' },
      ],
    },
    impact: {
      tag: 'Resultados reais',
      title: 'Nosso Impacto',
      stats: [
        { value: '[X]', label: '[Métrica 1]' },
        { value: '[X]', label: '[Métrica 2]' },
        { value: '[X]', label: '[Métrica 3]' },
        { value: '[X]', label: '[Métrica 4]' },
      ],
    },
    cta: {
      tag: 'Faça parte dessa história',
      title: '[Chamada para ação — convite para participar]',
      description:
        '[Texto motivacional convidando o visitante a contribuir como voluntário ou doador]',
    },
  },
};

export async function contentRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/content',
    {
      schema: {
        description: 'Returns all site content (about page sections)',
        tags: ['Content'],
        response: {
          200: siteContentSchema,
        },
      },
    },
    async () => {
      return content;
    },
  );
}
