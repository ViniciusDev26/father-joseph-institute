import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/FadeIn';
import { api } from '@/lib/axios';
import { listProductsResponseSchema, type Product } from '@/schemas/product';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/products')
      .then(res => {
        const validated = listProductsResponseSchema.parse(res.data);
        setProducts(validated.products);
      })
      .catch(() => setError('Erro ao carregar produtos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <FadeIn>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie o catálogo de produtos</p>
          </div>
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Novo produto
          </Link>
        </div>
      </FadeIn>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-12">Nenhum produto cadastrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {products.map((p, i) => (
              <FadeIn key={p.id} delay={i * 60}>
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 items-start">
                  {p.photos[0] ? (
                    <img
                      src={p.photos[0].url}
                      alt={p.name}
                      className="w-14 h-14 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                    <p className="text-sm font-mono text-primary mt-0.5">R$ {p.price.toFixed(2)}</p>
                    {p.artisans.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {p.artisans.map(a => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Desktop table */}
          <FadeIn delay={100} className="hidden md:block">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Foto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Preço</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Artesãs</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Fotos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {p.photos[0] ? (
                          <img
                            src={p.photos[0].url}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600 font-mono">R$ {p.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.artisans.map(a => a.name).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.photos.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </>
      )}
    </div>
  );
}
