# 🔧 MonGarage

> 🚧 **Projet en cours de développement** — la V1 n'est pas encore disponible, les fonctionnalités décrites ci-dessous sont en cours de construction.

MonGarage est une application web de suivi automobile : un tracker **gratuit** pour gérer son garage, suivre la consommation de carburant, les dépenses et l'entretien de ses véhicules.

La plupart des applications du genre sont payantes ou fortement limitées dans leur version gratuite. MonGarage propose une alternative web complète et sans frais.

## Fonctionnalités

- **Garage** — plusieurs véhicules, avec leur fiche : marque, modèle, immatriculation, date et prix d'achat, kilométrage
- **Carburant** — saisie des pleins et calcul automatique de la consommation en L/100 km, avec distinction entre plein complet et plein partiel
- **Dépenses** — dépenses ponctuelles par catégorie et dépenses mensuelles récurrentes (assurance, crédit, parking) saisies une seule fois, puis cumulées automatiquement
- **Entretien** — carnet des interventions passées : vidange, contrôle technique, pneus, freins, courroie...
- **Rappels** — échéances à venir en kilométrage ou en date, avec une section « À surveiller » sur le tableau de bord. Le contrôle technique est suivi automatiquement.

## Sur mobile

L'application est pensée **mobile first** : la saisie se fait le plus souvent depuis le téléphone, à la pompe ou au comptoir du garage.

C'est une **PWA** : pas d'App Store, elle s'installe directement depuis le navigateur via « Ajouter à l'écran d'accueil », s'ouvre en plein écran et reste consultable hors ligne.

## À venir

Une page **Statistiques** dédiée : évolution du kilométrage, coût au kilomètre, répartition des dépenses par catégorie et comparaison entre les véhicules du garage.

## Développement

Le projet est construit avec Angular et Supabase.

```bash
npm install     # installer les dépendances
npm start       # lancer l'app sur http://localhost:4200
npm test        # lancer les tests
npm run build   # build de production
```

Les conventions de code et le détail de l'architecture sont décrits dans [CLAUDE.md](.claude/CLAUDE.md).
