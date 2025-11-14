// api/detect.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY missing" });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No imageBase64 provided" });
    }

    const body = {
      contents: [
        {
          parts: [
            { text: "Analyze if this is a deepfake image. Provide verdict and short reasoning." },
            { inline_data: { mimeType: "image/jpeg", data: imageBase64 } }
          ]
        }
      ]
    };

    // Node 18+ has global fetch
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await r.json();
    return res.status(r.status === 200 ? 200 : 500).json(data);
  } catch (err) {
    return res.status(500).json({ error: err?.message || String(err) });
  }
}
