/* Yavaş yavaş — cache hors ligne.
   Change CACHE en "yavas-v16", "yavas-v17"... à chaque modification du contenu,
   sinon les téléphones garderont l'ancienne version.
   (Les pages elles-mêmes sont "réseau d'abord" : les changements de
   index.html arrivent même sans changer le numéro.) */
const CACHE = "yavas-v15";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  /* Les polices : précachées pour que le hors ligne soit complet
     dès la première visite. Un échec n'est pas bloquant. */
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..650;1,9..144,400..650&family=Manrope:wght@400;500;700;800&family=Spline+Sans+Mono:wght@500;700&display=swap"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* Chaque fichier est mis en cache individuellement : un échec
       (fichier renommé, réseau qui saute) n'empêche pas les autres. */
    await Promise.all(CORE.map((u) => c.add(u).catch(() => {})));
    /* Les vraies voix (audio/) sont mises en cache dès l'installation :
       elles fonctionnent donc hors ligne dès la première ouverture,
       sans avoir dû écouter chaque mot une fois. */
    try {
      const r = await fetch("./audio/index.json", { cache: "no-cache" });
      if (r.ok) {
        const j = await r.clone().json();
        await c.put("./audio/index.json", r);
        const files = [...new Set(Object.values(j))].map((f) => "./audio/" + f);
        await Promise.all(files.map((u) => c.add(u).catch(() => {})));
      }
    } catch (err) {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Pages : réseau d'abord, cache si hors ligne.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Le reste (audio, icônes, polices Google) : cache d'abord.
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => Response.error());
    })
  );
});
