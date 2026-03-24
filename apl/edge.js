import { kv } from '@vercel/kv';
export const config = { runtime: 'edge' };
export default async function (req) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  if (req.method === 'POST') {
    const { key, value } = await req.json();
    await kv.set(key, value);
    return new Response(JSON.stringify({ success: true }));
  }
  const value = await kv.get(key);
  return new Response(JSON.stringify({ value: value || null }));
}
