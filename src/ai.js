const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

export async function getRecipeFromGemini(ingredientsArr) {
  // Load API key fresh inside the function
  const API_KEY = import.meta.env.VITE_GAPI;

  // Debugging env
  console.log("🛠 API key exists?", !!API_KEY);
  console.log("🔑 API_KEY value:", API_KEY ? API_KEY.slice(0, 8) + "..." : "undefined");

  if (!API_KEY) {
    console.error("❌ API key missing! Check .env.local or Vercel Environment Variables.");
    return "⚠️ API key not found.";
  }

  const ingredientsString = ingredientsArr.join(", ");
  console.log("📝 Ingredients passed:", ingredientsString);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    console.log("🌍 Fetching from URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
          },
        ],
      }),
    });

    console.log("📡 Response status:", response.status, response.statusText);

    const data = await response.json();
    console.log("📦 Gemini raw response:", data);

    // Extract recipe text
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log("✅ Recipe generated successfully!");
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error("❌ Gemini API Error:", data.error.message);
      return `⚠️ Gemini API Error: ${data.error.message}`;
    } else {
      console.warn("⚠️ No recipe text found in response.");
      return "⚠️ No recipe generated.";
    }
  } catch (err) {
    console.error("🚨 Fetch failed:", err);
    return "⚠️ Error fetching recipe.";
  }
}
