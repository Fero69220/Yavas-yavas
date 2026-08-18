# Ce qui a été amélioré

## Le marché complet (version yavas-v9 — 15 août 2026)

- **Trois nouveaux paquets de cartes**, tout le vocabulaire du pazar :
  - **« Fruits et légumes »** : salatalık, patates, soğan, sarımsak, marul,
    biber, patlıcan, havuç, limon, muz, çilek, karpuz, kavun, üzüm, kiraz.
  - **« Boucherie & épices »** : et, dana eti, kuzu eti, köfte, puis tuz,
    karabiber, pul biber, toz biber, nane, kekik, kimyon.
  - **« Produits du quotidien »** : süt, yumurta, yoğurt, tereyağı,
    zeytinyağı, pirinç, mercimek, nohut.
- **« Au marché » enrichi** de quatre expressions pour négocier :
  **Kaç TL?** (TL = Türk Lirası), **İndirim var mı?**, **Taze mi?**,
  **Bir kilo lütfen**. La carte *pilav* précise désormais « riz cuit »
  — le riz cru, c'est *pirinç*.
- **Onze phrases de plus** dans « La phrase », qui réutilisent ce
  vocabulaire : « Bir kilo domates lütfen », « İndirim var mı? »,
  « Anne pazara gidiyor », « Karpuz çok tatlı », « Ben peynir alıyorum »…
- Les nouveaux mots passent par la synthèse vocale (pas encore de vrais
  enregistrements dans audio/ pour eux — l'outil outils/telecharger-voix.py
  peut les ajouter plus tard). Cache passé en yavas-v9.

## Nouvel onglet et nouveaux paquets (version yavas-v8)

- **Nouvel onglet « Les verbes »** — la grande pièce qui manquait. Dix verbes du
  quotidien (vouloir, aller, venir, faire, boire, manger, savoir, aimer,
  apprendre, parler) au présent en **-iyor**, avec tableau de conjugaison
  cliquable (chaque forme s'écoute), quiz avec score et série, et deux
  mini-leçons : la négation (iste**m**iyorum — reliée à « Bilmiyorum » déjà
  apprise en cartes) et la question (istiyor **musun**?). Les terminaisons sont
  les mêmes que dans « Je suis, tu es » : l'app le dit explicitement, et le
  moteur d'harmonie existant fait tout le travail — chaque forme générée a été
  vérifiée (istiyorum, yiyoruz, konuşuyorsunuz…).
- **Nouveau paquet « Le temps qu'il fait »** : hava, güneş, yağmur, kar, sıcak,
  soğuk… plus « Hava nasıl? », « Yağmur yağıyor » — le small-talk universel,
  et une révision naturelle de var (« Güneş var »).
- **Politesse complétée** : la paire culte des au revoir — **Hoşça kal** (celui
  qui part) / **Güle güle** (celui qui reste) — et de quoi s'excuser :
  **Özür dilerim**, **Affedersiniz**.
- **À table** : **Şerefe!** (santé, en trinquant).
- **Trois phrases de plus** qui réutilisent les verbes du nouvel onglet :
  « Sen ne istiyorsun? », « Biz çay içiyoruz », « Bugün kar yağıyor ».
- **Une carte de plus pour le prof** : « Un seul temps, longtemps » — rester
  sur le -iyor avant d'introduire l'aoriste et le passé.
- Le score du quiz de verbes est sauvegardé comme les autres, sans casser les
  scores existants. Cache passé en yavas-v8.

## Contenu pédagogique (version yavas-v7)

- **Trois nouvelles cartes dans « Les sons »**, les pièges classiques des
  francophones : **u** (toujours « ou » — sinon elle lira kutu comme « kütü »),
  **g** (toujours dur — sinon gelin devient « jelin »), **s** (toujours « ss »,
  jamais « z » entre deux voyelles — masa ≠ « maza »).
- **Nouveau paquet « La maison et dehors »** : 16 cartes, toutes avec un vrai
  enregistrement humain (ev, oda, kapı, masa, bahçe, araba, deniz, kedi…).
- **Nouveau paquet « Poser des questions »** : ne, kim, nerede, ne zaman, nasıl,
  neden, kaç… plus le trio indispensable **var / yok / değil** et « Çay var mı? ».
- **« Se dépanner » complété** : Evet, Hayır (vraies voix), Tamam, Tabii, Belki,
  « Tuvalet nerede? ».
- **« Chez les proches »** : ajout de **yenge** (la femme du frère ou de
  l'oncle — c'est exactement elle, vue par les neveux) et kuzen.
- **« Les nombres »** : « on bir » (11, pour montrer que tout est régulier) et
  les dizaines de 30 à 90 — indispensables pour les prix au marché.
- **« Les couleurs »** : gri et kahverengi (avec l'étymologie « couleur café »).
- **« À table »** : çay et kahve en cartes seules (vraies voix). **« Entre
  vous »** : Öptüm, la fin de tous les textos turcs.
- **L'oreille : un 4ᵉ suffixe, le datif « vers » (-e/-a/-ye/-ya)** — déjà
  présent dans les phrases (« Ben eve gidiyorum »), il est maintenant exercé.
  Et 8 mots de plus dans le tirage, tous avec vraie voix (elma, kahve, çorba,
  peynir, çanta, zeytin, ceket, cam), choisis pour éviter les mutations de
  consonnes que le moteur ne gère pas (pas de kitap → kitabım).
- **« Je suis, tu es »** : ajout de **evli** (marié·e) — evliyim, la phrase
  qu'elle dira le plus souvent en famille.
- **8 nouvelles phrases à remettre en ordre**, dont les premières questions
  (« Bu ne ? », « Çay var mı ? »), une phrase à 4 mots (« Ben biraz Türkçe
  biliyorum ») et du vécu de belle-famille (« Anneanne çok tatlı »).
- Correction d'accent : ağustos se prononce a-OUS-tos (accent sur la 2ᵉ
  syllabe, comme la plupart des noms de mois non finaux).
- Cache passé en yavas-v7 pour que les téléphones récupèrent le nouveau contenu.

En tout : **une cinquantaine de cartes nouvelles**, dont une vingtaine avec de
vrais enregistrements qui dormaient dans le dossier audio sans être utilisés.

## Technique (version yavas-v6)

## Corrections de bugs

- **Les vraies voix jouent enfin sur les cartes capitalisées.** L'app cherchait
  « Merhaba » dans `audio/index.json`, qui ne connaît que « merhaba » : les
  enregistrements réels n'étaient jamais utilisés pour « Merhaba », « Günaydın »,
  « Lütfen », « Su », « Bugün »… et la synthèse prenait le relais en silence.
  La recherche passe maintenant par les minuscules turques (İ→i, I→ı) et ignore
  la ponctuation finale.
- **Service worker : réponse invalide hors ligne.** Quand un fichier n'était ni
  en cache ni joignable, le service worker renvoyait `undefined`, ce qui
  provoquait une erreur au lieu d'un échec propre.
- **La bannière « Ajouter à l'écran d'accueil » revenait à chaque visite**,
  même après « Compris ». Le choix est maintenant mémorisé.

## Hors ligne et poids

- **Audio converti en .mp3** (mono, VBR haute qualité) : le dossier passe de
  **12 Mo à 1,7 Mo**. `audio/index.json` et `audio/credits.md` mis à jour ;
  l'attribution Lingua Libre est conservée, les liens sources pointent
  toujours vers les .wav originaux sur Wikimedia Commons.
- **Les 136 enregistrements sont mis en cache dès l'installation** du service
  worker : les vraies voix marchent hors ligne dès la première ouverture, sans
  avoir dû écouter chaque mot une fois en ligne. (Rendu raisonnable par la
  conversion mp3.)
- **Fichier `_headers` pour Netlify** : `index.html`, `sw.js` et le manifest ne
  sont jamais mis en cache par le navigateur (les mises à jour arrivent tout de
  suite), l'audio et les icônes le sont longtemps.
- Version du cache passée de `yavas-v5` à `yavas-v6`, comme demandé par le
  lisez-moi.

## Confort d'usage

- **L'app rouvre sur le dernier onglet visité** — cohérent avec « un onglet par
  jour ».
- **Bouton « Mélanger les cartes »** dans l'onglet Les cartes, pour ne pas
  apprendre l'ordre du paquet au lieu des mots.
- Le mot assemblé dans la machine à mots montre qu'il est cliquable (curseur,
  indication « appuie sur le mot pour l'écouter ») et se déclenche aussi au
  clavier.
- Les vrais enregistrements gardent leur timbre naturel quand la vitesse est
  réduite (`preservesPitch`).

## Accessibilité

- Onglets navigables aux **flèches gauche/droite** du clavier, avec les
  attributs ARIA complets (`aria-controls`, `aria-labelledby`, tabindex
  tournant).
- Les verdicts des trois quiz sont annoncés aux lecteurs d'écran
  (`aria-live="polite"`).
- Le contenu turc (cartes, options de quiz, mots de la machine, tableau de
  conjugaison) est marqué `lang="tr"` : VoiceOver et consorts le prononcent
  avec la bonne voix.

## Divers

- `id` ajouté au manifest (identité stable de la PWA pour Chrome/Android).

**Pour déployer :** glisse ce dossier (ou le zip) sur app.netlify.com/drop,
comme avant. Les téléphones déjà installés récupéreront la nouvelle version
au prochain lancement en ligne, grâce au passage en v6.
