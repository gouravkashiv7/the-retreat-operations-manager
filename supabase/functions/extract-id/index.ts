const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    // Handle both single 'image' (string) and 'images' (array of strings)
    const images = body.images || (body.image ? [body.image] : []);

    if (images.length === 0) {
      throw new Error("No image data received.");
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

    // Prepare image parts for Gemini
    const imageParts = images.map((img: string) => {
      const base64Data = img.includes(",") ? img.split(",")[1] : img;
      return { inline_data: { mime_type: "image/jpeg", data: base64Data } };
    });

    const prompt = `Extract info from these ID image(s). Return ONLY JSON:
    {
      "fullName": "string",
      "idType": "Passport" | "National ID" | "Driver License" | "Other",
      "nationalId": "string",
      "address": "string",
      "country": "string"
    }
    If information is spread across images (e.g. name on front, address on back), combine them into one response.
    If unknown, use null. No backticks.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              ...imageParts // Spread all images into the parts array
            ],
          },
        ],
        generationConfig: { response_mime_type: "application/json" },
      }),
    });

    if (!geminiResponse.ok) throw new Error(`AI Service Error: ${geminiResponse.status}`);

    const result = await geminiResponse.json();
    const extractedText = result.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return new Response(extractedText, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
