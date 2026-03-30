const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { filename, contentType, base64 } = body;
  if (!filename || !base64) return { statusCode: 400, body: 'Missing filename or base64 data' };

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const BUCKET = process.env.VITE_SUPABASE_BUCKET || 'recordings';
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'Missing Supabase server keys' }) };

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { fetch } });

  try {
    const buffer = Buffer.from(base64, 'base64');
    const path = filename;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, { contentType, upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = publicData?.publicUrl || null;

    try {
      await supabase.from('recordings').insert([{ path, bucket: BUCKET, content_type: contentType, size: buffer.length }]);
    } catch (err) {
      console.warn('metadata insert failed', err);
    }

    return { statusCode: 200, body: JSON.stringify({ publicUrl, path }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
