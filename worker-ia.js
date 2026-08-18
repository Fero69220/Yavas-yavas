/* Yavaş yavaş — passerelle IA (Cloudflare Worker)
   Rôle : garder ta clé API secrète côté serveur. L'appli envoie la
   conversation ici, le worker interroge Claude et renvoie la réponse.

   Installation (5 min) : voir brancher-l-ia.md à côté de ce fichier. */

const ORIGINE_AUTORISEE = "*"; // remplace par l'adresse de ton site, ex: "https://yavas-yavas.pages.dev"

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

    // on ne garde que les 20 derniers échanges pour limiter le coût
    const messages = (corps.messages || []).slice(-20);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",   // rapide et très peu cher
        max_tokens: 300,
        system: corps.system || "",
        messages: messages
      })
    });

    const data = await r.json();
    const texte = (data.content || []).map(c => c.text || "").join("");
    return avecCors(Response.json({ text: texte }));
  }
};
