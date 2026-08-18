/* Yavaş yavaş — passerelle IA GRATUITE (Google Gemini, Cloudflare Worker)
   Même rôle que worker-ia.js, mais avec l'API Gemini de Google dont le
   niveau gratuit suffit largement pour pratiquer tous les jours.
   Installation : voir brancher-l-ia.md (option A). */

const ORIGINE_AUTORISEE = "*"; // remplace par l'adresse de ton site, ex: "https://yavas-yavas.pages.dev"
const MODELE = "gemini-2.5-flash"; // modèle du niveau gratuit

function avecCors(rep) {
  const h = new Headers(rep.headers);
  h.set("Access-Control-Allow-Origin", ORIGINE_AUTORISEE);
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "content-type");
  return new Response(rep.body, { status: rep.status, headers: h });
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return avecCors(new Response(null, { status: 204 }));
    if (req.method !== "POST") return avecCors(new Response("POST uniquement", { status: 405 }));

    let corps;
    try { corps = await req.json(); }
    catch (e) { return avecCors(new Response("JSON invalide", { status: 400 })); }

    // format Gemini : "assistant" devient "model", chaque message a des "parts"
    const contents = (corps.messages || []).slice(-20).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + MODELE + ":generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: corps.system || "" }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 300 }
        })
      }
    );

    const data = await r.json();
    let texte = "";
    try {
      texte = (data.candidates[0].content.parts || []).map(p => p.text || "").join("");
    } catch (e) {
      texte = "(pas de réponse — quota du jour peut-être atteint, réessaie plus tard)";
    }
    return avecCors(Response.json({ text: texte }));
  }
};
