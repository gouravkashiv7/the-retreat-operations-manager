const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MODELS = [
  "gemini-3.1-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash"
];

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error(
        "No image data received. Please provide an array of base64 encoded images.",
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in Supabase project secrets.");
    }

    const prompt = `Extract info from this ID document. Return ONLY JSON:
    {
      "fullName": "string",
      "nationalId": "string",
      "address": "string"
    }
    If unknown, use null. No backticks or markdown.`;

    const parts: any[] = [{ text: prompt }];

    // Add each image to the parts array
    for (const image of images) {
      // Clean base64 string (remove data:image/jpeg;base64, prefix if present)
      const base64Data = image.includes(",") ? image.split(",")[1] : image;
      parts.push({ inline_data: { mime_type: "image/jpeg", data: base64Data } });
    }

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        console.log(`[ID-Extraction] Attempting with model: ${model}...`);
        
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

        const geminiResponse = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              response_mime_type: "application/json",
            },
          }),
        });

        // Specific handling for 503 (High Demand) and 429 (Rate Limit) to trigger fallback
        if (geminiResponse.status === 503 || geminiResponse.status === 429) {
          const errorText = await geminiResponse.text();
          console.warn(`[ID-Extraction] Model ${model} is unavailable or busy (${geminiResponse.status}). Trying next fallback...`);
          lastError = new Error(`AI Service Busy (${geminiResponse.status}): ${errorText}`);
          continue;
        }

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          console.error(`[ID-Extraction] Gemini API error for ${model} (${geminiResponse.status}):`, errorText);
          lastError = new Error(`AI Service Error (${geminiResponse.status})`);
          // For generic errors, we might still want to try the next model if it's a specific API failure
          continue;
        }

        const result = await geminiResponse.json();

        if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
          console.error(`[ID-Extraction] Model ${model} returned invalid candidates structure.`);
          lastError = new Error("AI could not read the document content.");
          continue;
        }

        const extractedText = result.candidates[0].content.parts[0].text;
        console.log(`[ID-Extraction] Successfully extracted data using ${model}`);

        return new Response(extractedText, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      } catch (err: any) {
        console.error(`[ID-Extraction] Fatal error with model ${model}:`, err.message);
        lastError = err;
        continue;
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All AI models failed to process the request.");

  } catch (error: any) {
    console.error("[ID-Extraction] Final Catch Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
