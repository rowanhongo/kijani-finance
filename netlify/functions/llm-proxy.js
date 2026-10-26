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

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server missing GEMINI_API_KEY' }) };

  try {
    // Forward to the configured LLM endpoint (Google Generative Language API in this deployment).
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: 'You are the Kijani Finance assistant. Kijani offers low-interest loans in Kenya secured by cereals stored in certified warehouses. Borrowers can draw up to 90% of their stock's invoice value over 7, 14 or 30 days and receive the funds as stablecoin in their Stellar wallet. Help farmers and traders understand how to deposit stock, borrow, repay and release their grain. Only cereals are accepted for now. Do not quote rates or make credit decisions you cannot confirm. Be concise, clear and friendly.'
          }]
        },
        contents: [{
          parts: [{ text: message }]
        }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.7,
        }
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 502, body: JSON.stringify({ success: false, error: `Gemini error ${res.status}: ${text}` }) };
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '(no response)';
    return { statusCode: 200, body: JSON.stringify({ success: true, response: reply }) };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ success: false, error: String(err) }) };
  }
};
