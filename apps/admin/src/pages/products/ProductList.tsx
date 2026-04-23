import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/axios';
import { listProductsResponseSchema, type Product } from '@/schemas/product';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/products')
      .then((res) => {
        const validated = listProductsResponseSchema.parse(res.data);
        setProducts(validated.products);
      })
      .catch(() => setError('Erro ao carregar produtos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie o catálogo de produtos</p>
        </div>
        <Link
          to="/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Novo produto
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {products.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-500">Nenhum produto cadastrado.</p>
          ) : (
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
                {products.map((p) => (
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
                    <td className="px-4 py-3 text-gray-600 font-mono">
                      R$ {p.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.artisans.map((a) => a.name).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.photos.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
