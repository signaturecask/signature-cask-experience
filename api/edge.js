import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const value = searchParams.get('value');

    if (!key) {
      return new Response(JSON.stringify({ error: 'No key provided' }), { status: 400 });
    }

    // If there is a value, we are SAVING (Admin)
    if (value) {
      await kv.set(key, value);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    // If there is NO value, we are READING (Experience Page)
    const result = await kv.get(key);
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
