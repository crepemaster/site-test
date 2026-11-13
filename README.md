# Site du festival

Site statique (HTML, CSS, JavaScript), hébergé gratuitement sur GitHub Pages et modifiable avec Pages CMS.

## Où se trouve quoi

| Quoi | Où |
|---|---|
| Textes, couleurs, bannières, logo, réseaux, contacts | `data/site.json` → « Réglages du site » dans le CMS |
| Liste des artistes | `data/artistes.csv` → « Artistes » dans le CMS (tableau) |
| Photos des artistes | `images/artistes/` → média « Photos artistes » |
| Autres images | `images/` |
| Vidéo d'accueil | `videos/` |

## Colonnes du tableau des artistes

`nom`, `photo`, `scene`, `jour`, `heure`, `style`, `description`, `youtube`, `lien`

- **photo** : juste le nom du fichier, par ex. `nina-volta.jpg` (le fichier doit être dans « Photos artistes »).
- **youtube** : le lien complet de la vidéo.
- **lien** : site ou page Instagram de l'artiste (commence par `https://`).
- La page d'un·e artiste est créée automatiquement à partir de son nom.

## Accueil : Flickr ou vidéo

Si la clé API Flickr **et** le lien de l'album sont remplis, l'accueil affiche les photos de l'album dans un ordre aléatoire.
Sinon, il affiche la vidéo YouTube, ou à défaut le fichier vidéo.

## Tester en local

```
python3 -m http.server
```

puis ouvrir http://localhost:8000
