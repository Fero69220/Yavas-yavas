# De vraies voix à la place de la synthèse

L'application lit `index.json` au démarrage. Chaque entrée associe un mot turc à
un fichier audio de ce dossier ; l'enregistrement est alors joué à la place de la
voix de synthèse. Tout ce qui n'a pas d'entrée bascule sur la synthèse, sans
rien casser.

```json
{
  "merhaba": "merhaba.mp3",
  "anneanne": "anneanne.wav"
}
```

## Le remplissage automatique — deux chemins

**Le plus simple : dans le navigateur.** Ouvre `outils/recuperer-voix.html`
dans Chrome (double-clic), appuie sur le bouton. L'outil interroge Wikimedia
Commons, filtre les licences, télécharge, et te rend un `audio.zip` à
décompresser à la racine de l'application. Aucune installation.

**En ligne de commande**, si tu préfères, depuis le dossier de l'application :

    python3 outils/telecharger-voix.py --mp3

Le script interroge Wikimedia Commons, récupère les prononciations turques
disponibles sous licence libre, les installe ici, écrit `index.json` et
`CREDITS.md`. Il n'a besoin d'aucune dépendance, juste de Python 3.

L'option `--mp3` convertit les fichiers avec ffmpeg : environ dix fois plus
légers, pour une qualité identique à l'oreille. Sans ffmpeg, les `.wav`
d'origine sont conservés — le navigateur les lit très bien, ils pèsent
simplement plus lourd.

## Ce que tu obtiendras

Une couverture partielle. Le corpus turc de Lingua Libre compte quelques
centaines de mots : les mots courants sont là, les termes de famille et les
expressions complètes beaucoup moins. C'est un complément, pas un remplacement.

## L'attribution est obligatoire

Ces enregistrements sont libres, pas sans conditions. La licence CC BY-SA impose
de citer l'auteur. Le script écrit `CREDITS.md` pour ça : conserve-le dans le
dossier déployé. C'est le prix, très modeste, du travail de gens qui ont
enregistré leur voix pour que d'autres apprennent.

## Et le mieux, quand même

Ta femme a sous la main un locuteur natif qu'aucun corpus ne remplacera. Vingt
minutes avec le dictaphone du téléphone, et les mots qu'elle entendra dans
l'application seront ceux de la personne avec qui elle veut parler. Nomme les
fichiers, ajoute-les à `index.json`, c'est tout.

> Note : la conversion en .mp3 a déjà été faite dans ce dossier (12 Mo → 1,7 Mo).
> Si tu relances un des outils, il régénérera des .wav — pense à reconvertir ou
> garde simplement les .mp3 actuels.
