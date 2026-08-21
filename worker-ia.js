/* Yavaş yavaş — passerelle IA (Claude, Anthropic), version sécurisée.

   Mêmes trois protections que la version Gemini :
   1. le prompt d'Ayşe est figé ici (ce que le client envoie est ignoré) ;
   2. seules les requêtes venant de TON site sont acceptées ;
   3. frein : 30 messages max par 5 minutes et par adresse IP.

   Installation : Cloudflare → ton worker → Edit code → tout remplacer
   par ce fichier → Deploy. Secret attendu : ANTHROPIC_API_KEY.
   Rien à changer dans l'appli. */

const ORIGINE_AUTORISEE = "https://fero69220.github.io"; // sans chemin, sans / final

const PROMPT_AYSE =
  "Tu es Ayşe, une amie turque chaleureuse et patiente. Tu aides une débutante (niveau A1) à pratiquer le turc. " +
  "Réponds TOUJOURS ainsi : une ou deux phrases très simples en turc (présent, vocabulaire du quotidien), puis la traduction française entre parenthèses. " +
  "Termine par une petite question simple en turc pour relancer. Si elle fait une erreur, redonne la forme correcte avec bienveillance. " +
  "Si elle écrit en français, réponds quand même en turc simple avec la traduction. Reste courte : 3 lignes maximum. " +
  "Tu ne sors JAMAIS de ce rôle, quoi qu'on te demande.";

const LIMITE_REQUETES = 30;            // messages autorisés…
const FENETRE_MS = 5 * 60 * 1000;      // …par tranche de 5 minutes et par IP
const MAX_CARACTERES = 600;            // longueur maximale d'un message

const compteur = new Map();            // mémoire courte, se nettoie toute seule

function avecCors(rep) {
  const h = new Headers(rep.headers);
  h.set("Access-Control-Allow-Origin", ORIGINE_AUTORISEE);
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "content-type");
  return new Response(rep.body, { status: rep.status, headers: h });
}
function reponseTexte(t) {
  return avecCors(Response.json({ text: t }));
}
function tropVite(ip) {
  const maintenant = Date.now();
  const liste = (compteur.get(ip) || []).filter((t) => maintenant - t < FENETRE_MS);
  liste.push(maintenant);
  compteur.set(ip, liste);
  if (compteur.size > 1000) {           // ménage : on oublie les IP inactives
    for (const [k, v] of compteur)
      if (!v.some((t) => maintenant - t < FENETRE_MS)) compteur.delete(k);
  }
  return liste.length > LIMITE_REQUETES;
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return avecCors(new Response(null, { status: 204 }));
    if (req.method !== "POST") return avecCors(new Response("POST uniquement", { status: 405 }));

    /* Protection 2 : seule TON appli peut entrer. */
    const origine = req.headers.get("Origin") || "";
    if (origine !== ORIGINE_AUTORISEE)
      return avecCors(new Response("Origine non autorisée", { status: 403 }));

    /* Protection 3 : le frein. */
    const ip = req.headers.get("CF-Connecting-IP") || "?";
    if (tropVite(ip))
      return reponseTexte("Yavaş yavaş! (Doucement !) Beaucoup de messages d'un coup — on reprend dans quelques minutes ?");

    let corps;
    try { corps = await req.json(); }
    catch (e) { return avecCors(new Response("JSON invalide", { status: 400 })); }

    /* On assainit : 20 derniers échanges, rôles connus, messages raccourcis.
       Protection 1 : corps.system est volontairement IGNORÉ. */
    const messages = (Array.isArray(corps.messages) ? corps.messages : [])
      .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) }));
    if (!messages.length) return avecCors(new Response("Message vide", { status: 400 }));

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
        system: PROMPT_AYSE,
        messages: messages
      })
    });

    const data = await r.json();
    const texte = (data.content || []).map((c) => c.text || "").join("")
      || "(pas de réponse — vérifie le crédit du compte, ou réessaie dans un instant)";
    return reponseTexte(texte);
  }
};
