import { GET } from '../app/api/products/search/route';

jest.mock('@neondatabase/serverless', () => {
  return {
    neon: () => ({
      query: jest.fn((query: string) => {
        if (query.startsWith('SELECT COUNT(*)')) {
          return Promise.resolve([{ count: '1' }]);
        }
        return Promise.resolve({ rows: [
          { id: 1, name: 'Test Product', description: 'A test', category: 'Test', brand: 'Brand', price: 10, stock_quantity: 5, sku: 'SKU1' }
        ] });
      })
    })
  };
});

describe('Search API', () => {
  it('should return results for a valid query', async () => {
    // Mock a Request object for the handler
    const url = 'http://localhost/api/products/search?q=test';
    const req = { url } as Request;
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('ok', true);
    expect(json).toHaveProperty('data');
    expect(Array.isArray(json.data)).toBe(true);
  });
});
