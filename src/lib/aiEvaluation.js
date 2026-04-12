import { formatHintText } from "../hintFormatting.js";
import { AI_PROVIDERS, STRINGS } from "../data/appConfig.js";

export async function evaluateWithAI(userCode, level, apiKey, lang, provider) {
  const _t = (key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key;
  const providerConfig = AI_PROVIDERS[provider];

  if (!providerConfig) {
    return { correct: false, feedback: _t("apiGenericError"), explanation: "" };
  }

  const prompt = `You are a Python code evaluator for an educational platform. Evaluate if the student's code is correct AND uses the concept being taught.

CRITICAL RULES:
- The student MUST use the concept/technique described in the task. Hardcoding the output is NOT acceptable.
- For example, if the task says "create a variable and print it", then print("value") without using a variable is WRONG.
- If the task says "use a for loop", writing print(1)\nprint(2)\nprint(3) is WRONG.
- If the task says "use str() to concatenate", just print("the answer") is WRONG.
- Accept creative solutions (different variable names, f-strings vs concatenation, etc.) as long as they use the required concept.
- Code must be valid Python 3 that would actually run without errors.
- For simulated input, assume input() receives values in order.
- Be encouraging but honest.

CONCEPT BEING TAUGHT: ${level.concept}
TASK: ${level.task}
EXPECTED OUTPUT: ${level.expectedOutput}
${level.simulatedInput ? `SIMULATED INPUT: ${level.simulatedInput}` : ""}
REFERENCE SOLUTION: ${formatHintText(level.hint)}

STUDENT CODE:
\`\`\`python
${userCode}
\`\`\`

Does this code use the required concept AND produce the correct output? Respond ONLY with JSON, no markdown fences:
{"correct": true/false, "feedback": "brief encouraging message", "explanation": "1-2 sentences explaining why correct/incorrect, focusing on whether they used the concept"}${lang === "ko" ? "\nRespond in Korean." : ""}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    let response;

    if (provider === "claude") {
      response = await fetch(providerConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: providerConfig.model,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
    } else if (provider === "openai") {
      response = await fetch(providerConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: providerConfig.model,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
    } else if (provider === "gemini") {
      const url = `${providerConfig.endpoint}?key=${apiKey}`;
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 },
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      if (status === 401) return { correct: false, feedback: _t("apiKeyInvalidExpired"), explanation: "" };
      if (status === 429) return { correct: false, feedback: _t("apiRateLimited"), explanation: "" };
      if (status === 529 || status === 503) return { correct: false, feedback: _t("apiOverloaded").replace("{provider}", providerConfig.name), explanation: "" };
      return { correct: false, feedback: _t("apiStatusError").replace("{status}", status), explanation: "" };
    }

    const data = await response.json();

    let text = "";
    if (provider === "claude") {
      if (data.error) {
        const msg = data.error.message || "";
        if (msg.includes("invalid") || msg.includes("auth")) return { correct: false, feedback: _t("apiKeyInvalid"), explanation: "" };
        return { correct: false, feedback: _t("apiGenericError"), explanation: "" };
      }
      text = (data.content || []).map(b => b.text || "").join("").trim();
    } else if (provider === "openai") {
      if (data.error) {
        return { correct: false, feedback: _t("apiGenericError"), explanation: "" };
      }
      text = data.choices?.[0]?.message?.content?.trim() || "";
    } else if (provider === "gemini") {
      if (data.error) {
        return { correct: false, feedback: _t("apiGenericError"), explanation: "" };
      }
      text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    }

    if (!text) {
      return { correct: false, feedback: _t("apiEmptyResponse").replace("{provider}", providerConfig.name), explanation: "" };
    }

    const clean = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(clean);
    } catch {
      if (text.toLowerCase().includes('"correct": true') || text.toLowerCase().includes('"correct":true')) {
        return { correct: true, feedback: _t("niceWork"), explanation: "" };
      }
      return { correct: false, feedback: _t("apiParseError"), explanation: `${_t("apiParseRaw")}: ${text.substring(0, 200)}` };
    }
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { correct: false, feedback: _t("apiTimeout"), explanation: "" };
    }
    return { correct: false, feedback: `${_t("apiGenericError")} (${providerConfig.name})`, explanation: "" };
  }
}
