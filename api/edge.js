import { kv } from '@vercel/kv';

export const config = { runtime: 'edge' };

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const value = searchParams.get('value');

    if (!key) return new Response(JSON.stringify({ error: 'No key' }), { status: 400 });

    if (value) {
      await kv.set(key, value);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const result = await kv.get(key);
    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
