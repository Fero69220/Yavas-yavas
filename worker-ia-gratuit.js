/* Yavaş yavaş — passerelle IA GRATUITE (Google Gemini, Cloudflare Worker)
   Même rôle que worker-ia.js, mais avec l'API Gemini de Google dont le
   niveau gratuit suffit largement pour pratiquer tous les jours.
   Installation : voir brancher-l-ia.md (option A). */

const ORIGINE_AUTORISEE = "*"; // remplace par l'adresse de ton site, ex: "https://yavas-yavas.pages.dev"
const MODELE = "gemini-3.6-flash"; // modèle du niveau gratuit (indiqué par Google pour les nouvelles clés)

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
          system_instruction: { parts: [{ text: (corps.system || "") +
            "\nIMPORTANT : ta réponse doit être COMPLÈTE et COURTE : 1 à 2 phrases turques, la traduction française entre parenthèses, une petite question. Jamais d'explication longue, jamais de réponse coupée." }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 1024 }
        })
      }
    );

    const data = await r.json();
    let texte = "";
    try {
      texte = (data.candidates[0].content.parts || []).map(p => p.text || "").join("");
    } catch (e) {
      const detail = (data && data.error && data.error.message)
        ? data.error.message
        : JSON.stringify(data).slice(0, 200);
      texte = "(erreur Gemini : " + detail + ")";
    }
    return avecCors(Response.json({ text: texte }));
  }
};
