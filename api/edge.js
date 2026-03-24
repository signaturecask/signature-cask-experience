import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    
    // SAVING DATA (POST)
    if (request.method === 'POST') {
      const { key, value } = await request.json();
      await kv.set(key, value);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    // READING DATA (GET)
    const key = url.searchParams.get('key');
    const value = await kv.get(key);
    return new Response(JSON.stringify({ value: value || null }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
