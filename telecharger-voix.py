#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Télécharge des prononciations turques libres depuis Wikimedia Commons
et les installe dans le dossier audio/ de l'application Yavaş yavaş.

Source : Lingua Libre, un corpus audio collaboratif de Wikimédia France.
Ce sont de vraies voix humaines, enregistrées par des locuteurs natifs,
publiées sous licence libre (CC BY-SA 4.0 pour l'essentiel).

Le script ne garde QUE les fichiers sous licence libre, et écrit un fichier
de crédits — l'attribution est obligatoire avec ces licences.

USAGE
    python3 telecharger-voix.py            depuis le dossier de l'application
    python3 telecharger-voix.py --mp3      convertit en mp3 (nécessite ffmpeg)

Aucune dépendance : uniquement la bibliothèque standard de Python 3.
"""

import json, os, re, sys, time, urllib.parse, urllib.request, shutil, subprocess

API = "https://commons.wikimedia.org/w/api.php"
UA = "YavasYavas-LearningApp/1.0 (application personnelle d'apprentissage)"
DOSSIER = "audio"

# Licences acceptées. Tout le reste est ignoré, même si le fichier existe.
LIBRES = ("cc0", "cc-by", "cc by", "public domain", "pd-", "cc-zero", "attribution")

# Les mots de l'application. Ajoute les tiens à la fin de la liste.
MOTS = """
ev okul oda göz kutu kapı sepet araba kedi el yol süt kuş köy masa kalem deniz
anne baba kardeş abla abi ağabey anneanne babaanne dede teyze hala dayı amca
gelin damat kayınvalide kayınpeder
yorgun aç mutlu hasta iyi hazır üzgün Türk Fransız
merhaba günaydın lütfen görüşürüz evet hayır su çay ekmek kitap
akşam gece sabah gün hafta ay yıl
anlamadım bilmiyorum
peynir zeytin domates elma portakal balık tavuk çorba pilav tatlı
bir iki üç dört beş altı yedi sekiz dokuz on yirmi yüz bin
beyaz siyah kırmızı mavi yeşil sarı turuncu pembe mor
pazartesi salı çarşamba perşembe cuma cumartesi pazar bugün yarın dün şimdi sonra
kız şeker bahçe güzel emin burada cam dağ kahve
elbise pantolon gömlek tişört kazak ceket mont etek ayakkabı çorap şapka atkı eldiven çanta
ocak şubat mart nisan mayıs haziran temmuz ağustos eylül ekim kasım aralık
ilkbahar yaz sonbahar kış
""".split()


def api(params):
    params = dict(params, format="json", formatversion="2")
    url = API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def minuscule_tr(s):
    """Le turc a ses propres règles : I devient ı, İ devient i."""
    return s.replace("I", "ı").replace("İ", "i").lower()


def lister_categorie(nom):
    """Tous les fichiers d'une catégorie Commons, pagination comprise."""
    fichiers, cont = [], {}
    while True:
        d = api(dict({"action": "query", "list": "categorymembers",
                      "cmtitle": "Category:" + nom, "cmtype": "file",
                      "cmlimit": "500"}, **cont))
        fichiers += [m["title"] for m in d.get("query", {}).get("categorymembers", [])]
        if "continue" not in d:
            return fichiers
        cont = d["continue"]
        time.sleep(0.2)


def mot_du_nom(titre):
    """LL-Q256 (tur)-Locuteur-kitap.wav  ->  kitap"""
    n = titre[len("File:"):] if titre.startswith("File:") else titre
    n = re.sub(r"\.(wav|ogg|oga|mp3|flac)$", "", n, flags=re.I)
    m = re.match(r"LL-Q\d+\s*\(\w+\)-[^-]+-(.+)$", n)
    if m:
        return m.group(1)
    m = re.match(r"[Tt]r-(.+)$", n)          # ancienne convention : Tr-kitap.ogg
    return m.group(1) if m else None


def infos(titres):
    """URL, licence et auteur, par paquets de 50."""
    out = {}
    for i in range(0, len(titres), 50):
        d = api({"action": "query", "prop": "imageinfo",
                 "iiprop": "url|extmetadata", "titles": "|".join(titres[i:i + 50])})
        for p in d.get("query", {}).get("pages", []):
            ii = (p.get("imageinfo") or [{}])[0]
            ex = ii.get("extmetadata", {}) or {}
            val = lambda k: (ex.get(k, {}) or {}).get("value", "") or ""
            out[p["title"]] = {
                "url": ii.get("url", ""),
                "licence": re.sub("<[^>]+>", "", val("LicenseShortName")).strip(),
                "auteur": re.sub("<[^>]+>", "", val("Artist")).strip(),
                "page": ii.get("descriptionurl", ""),
            }
        time.sleep(0.2)
    return out


def libre(licence):
    l = licence.lower()
    return any(k in l for k in LIBRES)


def telecharger(url, chemin):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r, open(chemin, "wb") as f:
        shutil.copyfileobj(r, f)


def main():
    en_mp3 = "--mp3" in sys.argv
    if en_mp3 and not shutil.which("ffmpeg"):
        print("ffmpeg introuvable : les fichiers seront gardés tels quels.")
        en_mp3 = False

    os.makedirs(DOSSIER, exist_ok=True)
    voulus = {minuscule_tr(m): m for m in MOTS}
    print("%d mots recherchés.\n" % len(voulus))

    print("Lecture des catégories Commons…")
    titres = []
    for cat in ("Lingua Libre pronunciation-tur", "Turkish pronunciation"):
        try:
            t = lister_categorie(cat)
            print("  %-34s %5d fichiers" % (cat, len(t)))
            titres += t
        except Exception as e:
            print("  %-34s erreur : %s" % (cat, e))
    titres = sorted(set(titres))

    # un seul enregistrement par mot : le premier trouvé
    candidats = {}
    for t in titres:
        mot = mot_du_nom(t)
        if not mot:
            continue
        cle = minuscule_tr(mot)
        if cle in voulus and cle not in candidats:
            candidats[cle] = t

    print("\n%d mots sur %d ont un enregistrement.\n" % (len(candidats), len(voulus)))
    if not candidats:
        print("Rien à télécharger. Les mots de la liste ne sont peut-être pas encore enregistrés.")
        return

    meta = infos(list(candidats.values()))
    index, credits, ignores = {}, [], []

    for cle, titre in sorted(candidats.items()):
        m = meta.get(titre, {})
        if not m.get("url"):
            continue
        if not libre(m.get("licence", "")):
            ignores.append((voulus[cle], m.get("licence") or "licence inconnue"))
            continue

        ext = os.path.splitext(m["url"])[1].lower() or ".wav"
        tt = str.maketrans("çğıöşü", "cgiosu")
        base = re.sub(r"[^a-z0-9]+", "-", cle.translate(tt)).strip("-") or "mot"
        brut = os.path.join(DOSSIER, base + ext)
        try:
            telecharger(m["url"], brut)
        except Exception as e:
            print("  échec %-14s %s" % (voulus[cle], e))
            continue

        final = base + ext
        if en_mp3 and ext != ".mp3":
            cible = os.path.join(DOSSIER, base + ".mp3")
            r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", brut,
                                "-ac", "1", "-ar", "22050", "-b:a", "64k", cible])
            if r.returncode == 0:
                os.remove(brut)
                final = base + ".mp3"

        index[voulus[cle]] = final
        credits.append((voulus[cle], final, m.get("auteur") or "auteur non précisé",
                        m.get("licence") or "?", m.get("page") or ""))
        print("  ✓ %-14s %s" % (voulus[cle], final))

    with open(os.path.join(DOSSIER, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=1)

    with open(os.path.join(DOSSIER, "CREDITS.md"), "w", encoding="utf-8") as f:
        f.write("# Crédits des enregistrements\n\n")
        f.write("Fichiers issus de Wikimedia Commons, pour l'essentiel du projet\n")
        f.write("Lingua Libre (Wikimédia France). L'attribution ci-dessous est une\n")
        f.write("obligation des licences, pas une politesse : garde ce fichier.\n\n")
        f.write("| Mot | Fichier | Auteur | Licence | Source |\n|---|---|---|---|---|\n")
        for mot, fich, aut, lic, page in credits:
            f.write("| %s | %s | %s | %s | %s |\n" % (mot, fich, aut, lic, page))

    print("\n%d fichiers installés dans %s/" % (len(index), DOSSIER))
    if ignores:
        print("%d écartés faute de licence libre :" % len(ignores))
        for mot, lic in ignores:
            print("   %-14s %s" % (mot, lic))
    print("\nCrédits écrits dans %s/CREDITS.md — à conserver." % DOSSIER)
    print("Pense à changer le numéro de version dans sw.js avant de redéployer.")


if __name__ == "__main__":
    main()
