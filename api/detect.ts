import fetch from "node-fetch";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST method allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY missing on server" });
    return;
  }

  try {
    const { imageBase64 } = req.body;

    const body = {
      contents: [
        {
          parts: [
            { text: "Analyze if this is a deepfake image." },
            { inline_data: { mimeType: "image/jpeg", data: imageBase64 } }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
