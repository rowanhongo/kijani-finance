const fetch = global.fetch || require('node-fetch');

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
    const res = await fetch('https://apifreellm.com/api/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ success: false, error: String(err) }) };
  }
};
