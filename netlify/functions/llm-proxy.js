exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const message = body.message;
  if (!message) return { statusCode: 400, body: 'Missing message' };

  const API_KEY = process.env.APIFREE_LLM_KEY;
  if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server missing APIFREE_LLM_KEY' }) };

  try {
    // Forward to the configured LLM endpoint (Google Generative Language API in this deployment).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Keep the payload simple; the API key is passed in the URL. Adjust body if the upstream API needs a different shape.
      body: JSON.stringify({ prompt: message }),
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ success: false, error: String(err) }) };
  }
};
