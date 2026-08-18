# Brancher le mode « Parler librement avec Ayşe »

Le mode IA a besoin d'internet et d'une **passerelle** : un mini-serveur
gratuit qui garde ta clé API secrète (on ne met JAMAIS une clé API dans
un site public, sinon n'importe qui peut l'utiliser à tes frais).

Le reste de l'appli — y compris les trois scènes de conversation guidées —
fonctionne entièrement **hors ligne**, sans rien de tout ceci.

Deux options. L'option A est 100 % gratuite : commence par elle.

---

## Option A — 100 % gratuite (Google Gemini) ✅ recommandée

**Étape 1 — Une clé Gemini gratuite (~2 min)**

1. Va sur https://aistudio.google.com (un compte Google suffit).
2. **Get API key** → **Create API key** → copie la clé.
3. Pas de carte bancaire, pas d'expiration. Le quota gratuit quotidien
   des modèles Flash dépasse très largement quelques conversations par jour.
   Seule contrepartie : sur le niveau gratuit, Google peut utiliser les
   échanges pour améliorer ses modèles — pour de la pratique de turc,
   ce n'est pas un souci.

**Étape 2 — La passerelle Cloudflare (~3 min, gratuit)**

1. Va sur https://dash.cloudflare.com (le même compte que pour le site).
2. **Workers & Pages** → **Create** → **Create Worker** → **Deploy**.
3. **Edit code** : remplace tout par le contenu de `worker-ia-gratuit.js`
   (ce dossier), puis **Deploy**.
4. Page du worker → **Settings** → **Variables and Secrets** → **Add** →
   type **Secret**, nom `GEMINI_API_KEY`, valeur = ta clé → **Deploy**.
5. (Conseillé) Dans le code, remplace `"*"` par l'adresse exacte de ton
   site dans `ORIGINE_AUTORISEE`, pour que seul ton site puisse l'utiliser.
6. Copie l'adresse du worker (du genre `https://xxx.ton-compte.workers.dev`).

**Étape 3 — Dans l'appli (~30 s)**

Onglet **La conversation** → carte « Parler librement avec Ayşe » →
**Réglage : brancher l'IA** → colle l'adresse du worker. C'est mémorisé
sur le téléphone, à faire une seule fois par appareil.

Elle peut alors écrire — ou appuyer sur 🎤 et parler en turc (ajoute le
clavier turc du téléphone pour la dictée : Réglages → Général → Clavier).

---

## Option B — Claude (payant, mais quelques centimes)

Même démarche avec `worker-ia.js` :

1. Clé API sur https://console.anthropic.com (ajoute un petit crédit :
   5 € tiennent très longtemps, un échange coûte une fraction de centime
   avec le modèle Haiku).
2. Worker Cloudflare identique, mais colle `worker-ia.js` et mets le
   secret `ANTHROPIC_API_KEY`.
3. Colle l'adresse du worker dans l'appli, pareil.

Intérêt : pas d'utilisation des conversations pour l'entraînement, et un
turc un poil plus soigné. Pour débuter, l'option A gratuite suffit.

## Et ChatGPT ?

Même principe encore : il faudrait un compte API OpenAI (payant aussi).
Une seule passerelle suffit — inutile d'en avoir plusieurs.
