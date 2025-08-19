const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`

// Replace with your actual Gemini API key (best: keep in .env)
const API_KEY = import.meta.env.GAPI

export async function getRecipeFromGemini(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(", ")

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
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
      }
    )

    const data = await response.json()
    console.log("Gemini Response:", data)

    // Extract text safely
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    } else {
      return "⚠️ No recipe generated."
    }
  } catch (err) {
    console.error("Gemini API Error:", err)
    return "⚠️ Error fetching recipe."
  }
}


