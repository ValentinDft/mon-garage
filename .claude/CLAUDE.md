You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

# MonGarage

Web app de suivi automobile : un tracker **gratuit** pour gérer son garage, suivre la consommation de carburant, les dépenses et l'entretien de ses véhicules. Alternative aux apps mobiles existantes (Fuelio, Drivvo), presque toutes payantes ou bridées en version gratuite.

- **Mobile first** : la saisie se fait le plus souvent sur le téléphone, debout à la pompe ou au comptoir du garage. Chaque écran est pensé d'abord pour un petit écran, puis élargi vers le desktop.
- **PWA** : pas d'App Store. L'app s'installe depuis Safari via « Ajouter à l'écran d'accueil », tourne en plein écran et fonctionne hors ligne via le Service Worker Angular. Le développement reste du Angular classique, la PWA est une couche ajoutée au déploiement.
- **Connexion obligatoire** : aucun accès sans compte, toutes les routes hors `/login` et `/register` sont protégées par un guard.

## Stack

| Couche        | Technologie                               |
| ------------- | ----------------------------------------- |
| Frontend      | Angular 22 (standalone, signals), SCSS    |
| Backend / BDD | Supabase (PostgreSQL + Auth + RLS)        |
| PWA           | `@angular/pwa` (Service Worker)           |
| Tests         | Vitest (`ng test`)                        |
| Graphiques    | Chart.js / ng2-charts — **V2 uniquement** |
| Hébergement   | Vercel ou Netlify                         |

Commandes : `npm start` (dev), `npm run build`, `npm test`, `npm run lint`, `npm run lint:styles`, `npm run format`.

## Git

Projet perso, un seul développeur : **pas de branche de développement**. On commite directement sur `main`, et ce tant que le projet n'est pas livré. Pas de branche `feat/*`, pas de pull request, pas de demande de confirmation avant de commiter sur la branche par défaut — la réponse est oui, de façon permanente.

Cette décision vaut accord permanent pour tout outil ou skill qui demanderait s'il faut créer une branche dédiée : ne pose pas la question, commite sur `main`.

Deux choses qu'elle ne change pas : on ne commite que **quand c'est demandé**, et le sujet du commit reste à valider avant qu'il parte. À revoir à la première mise en production.

## Langue

**Tout le code est en anglais** : tables, colonnes, variables, fonctions, types, composants, noms de fichiers. Seuls les **commentaires** et les **libellés affichés à l'utilisateur** sont en français.

## Conventions de nommage

| Élément              | Convention                            | Exemple                               |
| -------------------- | ------------------------------------- | ------------------------------------- |
| Tables               | `snake_case`, pluriel                 | `fuel_logs`, `recurring_expenses`     |
| Colonnes             | `snake_case`                          | `purchase_date`, `is_full_tank`       |
| Booléens             | préfixe `is_` / `has_`                | `is_full_tank`, `is_mandatory`        |
| Clés étrangères      | `<table_au_singulier>_id`             | `vehicle_id`, `user_id`               |
| Interfaces TS        | `PascalCase`                          | `Vehicle`, `RecurringExpense`         |
| Méthodes / variables | `camelCase`                           | `getConsumptionSeries()`, `currentKm` |
| Constantes           | `SCREAMING_SNAKE_CASE`                | `KM_THRESHOLD`                        |
| Fichiers             | `kebab-case`                          | `fuel-log.service.ts`                 |
| Composants           | suffixe `Component`, sélecteur `app-` | `VehicleCardComponent`                |

Le mapping entre les colonnes `snake_case` de Postgres et les interfaces TypeScript `camelCase` se fait **dans les services**, jamais dans les composants.

## Structure

```
src/app/
├── core/
│   ├── services/     supabase, auth, vehicle, fuel-log, expense,
│   │                 maintenance, reminder, stats (V2)
│   ├── guards/       auth.guard.ts
│   └── models/       vehicle, fuel-log, expense, recurring-expense,
│                     maintenance, reminder, profile
├── features/
│   ├── auth/         login, register
│   ├── dashboard/    reminders-banner (« À surveiller »), vehicle-card
│   ├── garage/       garage-list, vehicle-detail, et les bottom sheets :
│   │                 add-vehicle, fuel-log, expense, recurring-expense,
│   │                 maintenance, reminder
│   └── stats/        V2 — km-chart, conso-chart, cost-breakdown-chart
└── shared/
    ├── components/   bottom-nav, navbar, badge, conso-gauge (CSS),
    │                 bottom-sheet, skeleton
    └── pipes/        consoUnit, costPerKm, timeAgo
```

## Routes

```
/login          publique
/register       publique
/               DashboardComponent   protégée
/garage         GarageListComponent  protégée
/garage/:id     VehicleDetailComponent protégée
/garage/:id/stats  StatsComponent    protégée — V2
```

Les routes de features sont **lazy loaded**. `auth.guard.ts` redirige vers `/login` en l'absence de session Supabase.

## Thème

Direction visuelle : **garage vintage / Americana** — plaque émaillée vieillie, enseigne de station-service d'époque, chaleureux, avec des chiffres qui restent lisibles.

Tout style de composant commence par `@use 'theme' as *;` — `src/styles` est en `includePaths`, le barrel `_theme.scss` réexporte variables + breakpoints + mixins. **Aucune couleur, taille, rayon ni breakpoint en dur dans un composant.**

| Fichier                        | Contenu                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `src/styles/_variables.scss`   | tokens : couleurs, typo, formes, espacements, ombres, z-index, durées                       |
| `src/styles/_breakpoints.scss` | `$bp-tablet`/`$bp-desktop` + mixins `tablet`, `desktop`, `from($w)`                         |
| `src/styles/_mixins.scss`      | motifs : `card`, `badge`, `alert`, `accent-bar`, `focus-ring`, `tap-target`, `bottom-sheet` |
| `src/styles/_reset.scss`       | reset, base document, focus visible, `prefers-reduced-motion`                               |
| `src/styles/_typography.scss`  | titres, chiffres en `tabular-nums`, utilitaires `u-*`                                       |

- Palette : fond ivoire `$color-bg` `#f4e9d8`, cards `$color-bg-card` `#efe1c9`, vert atelier `$color-primary` `#2b3d2f`, rouille `$color-accent` `#c1502e`, chrome `$color-chrome` `#8a8d91`. Texte `#2a2420` / `#5c5246` / `#6d6456`. Statuts : `$color-status-ok` `#4f6f45`, `-soon` `#b1492a`, `-overdue` `#8c2f20`.
- **Rouille : deux tokens.** `$color-accent` `#c1502e` pour les surfaces, liserés et l'anneau de focus (3,93:1, au-dessus du seuil de 3:1) ; `$color-accent-text` `#b1492a` dès que le rouille est **écrit** (4,54:1, seuil AA de 4,5:1). `$color-text-muted` et `$color-status-soon` sont assombris par rapport à la page Notion pour la même raison — écart documenté dans `_variables.scss`, à backporter.
- Typo : `$font-display` (Bebas Neue) pour le logo et les titres de page, avec `letter-spacing` large — c'est ce qui donne le rendu enseigne. `$font-sans` (Inter) partout ailleurs, corps à 13px. Les chiffres clés passent par le mixin `numeric` (`tabular-nums`).
- Badges et alertes se construisent par **variation d'alpha** d'une seule couleur de statut (12 % / 25 % pour un badge, 9 % / 30 % pour une alerte) — via les mixins, jamais à la main.
- Les couleurs d'accent de véhicule viennent de `core/utils/vehicle-colors.ts` (`getVehicleColor(index)`) et se posent en custom property `--vehicle-accent`, consommée par le mixin `accent-bar`.
- Focus : `focus-ring` est appliqué globalement sur `:focus-visible` ; sur fond vert atelier, utiliser `focus-ring($on-dark: true)` (le rouille n'y tient pas le ratio de 3:1).
- Les polices sont chargées depuis `index.html`. Le `viewport-fit=cover` y est indispensable pour que `env(safe-area-inset-bottom)` remonte sous la barre d'onglets.
- **Source de vérité** : page Notion « 🎨 Design & tokens » du projet MonGarage. Circuit : maquette Claude Design → page Notion → `_variables.scss`. Jamais l'inverse.

## Responsive

```scss
// src/styles/_breakpoints.scss
$bp-tablet: 768px; // navbar horizontale, grille 2 colonnes
$bp-desktop: 1200px; // grille 3 colonnes, graphiques détaillés
```

Mobile first : on ne monte qu'en `min-width`, via les mixins `@include tablet { … }` / `@include desktop { … }`. Jamais de `max-width`.

- Sous 768px : `BottomNavComponent` (barre d'onglets fixe en bas : Tableau de bord / Garage / Stats), formulaires en **bottom sheet** (jamais en modal centrée), cards véhicule en une colonne, FAB « Ajouter un plein ».
- Au-dessus : `NavBarComponent` horizontale, grille 2-3 colonnes, formulaires en modal centrée.
- Champs numériques avec `inputmode="decimal"`, zones de tap d'au moins 44px.
- Graphiques simplifiés sur petit écran (moins de points, légende sous le graphe).

## Règles métier

### Carburant & consommation

- Un plein est **complet** (`is_full_tank = TRUE`) ou **partiel**. La distinction est indispensable au calcul.
- La conso ne se calcule **qu'entre deux pleins complets consécutifs** : distance = différence de km, litres = somme de **tous** les pleins de l'intervalle (partiels inclus), résultat en L/100km.
- `getConsumptionSeries()` (dans `fuel-log.service.ts`) alimente la conso moyenne et la **jauge CSS** affichée sur la fiche véhicule et les cards du garage. La jauge est une barre de progression colorée selon un seuil de référence — **pas de librairie de graphiques en V1**.

### Dépenses

- Dépenses ponctuelles : `expenses`, catégorisées.
- Dépenses récurrentes mensuelles (assurance, crédit, parking...) : on stocke **un montant mensuel et une période**, pas une ligne par mois. Le cumul est calculé à la volée depuis `start_date` jusqu'à `end_date` (ou aujourd'hui si `NULL`).
- `expandToMonthly()` matérialise les occurrences pour les agréger au même format que les dépenses ponctuelles.
- **Coût total d'un véhicule** = pleins (`fuel_logs.total_price`) + dépenses ponctuelles (`expenses.amount`) + occurrences des dépenses récurrentes. Les montants d'`maintenance_records.amount` sont déjà saisis comme dépenses, **ils ne sont pas recomptés**.

### Entretien & rappels

Quatre types d'ajout dans l'app : un **plein**, une **dépense**, un **entretien** ou un **rappel**.

- **Entretien** (`maintenance_records`) = une intervention **passée** (vidange, CT, pneus, freins, courroie...) avec date, km et montant. C'est le carnet d'entretien.
- **Rappel** (`reminders`) = une échéance **future**, **saisie à la main** par l'utilisateur, en km et/ou en date.
- Les rappels ne sont **jamais calculés automatiquement** à partir de l'historique : les intervalles varient trop selon le modèle, la motorisation, les préconisations constructeur et l'usage. L'utilisateur reste maître de ses échéances.
- Section « À surveiller » du dashboard : rappels non terminés, statut `ok` / `due_soon` / `overdue` obtenu en comparant l'échéance au km actuel et à la date du jour (`KM_THRESHOLD = 1000`, `DAYS_THRESHOLD = 30`). Le statut le plus urgent l'emporte, tri du plus urgent au moins urgent, les `ok` sont masqués.

### Contrôle technique (cas particulier)

- Seul entretien **obligatoire** : le rappel `type = 'inspection'`, `is_mandatory = TRUE` est créé **par trigger** à l'ajout du véhicule et **ne peut pas être supprimé** (garde-fou en base, pas seulement masqué dans l'UI).
- Son échéance n'est **jamais** saisie à la main : elle se déduit de `vehicles.last_inspection_date` + 2 ans (véhicule particulier). Sans CT précédent, on part de la date d'achat + 4 ans (règle du véhicule neuf).
- Quand le CT est marqué comme fait : on enregistre l'intervention dans `maintenance_records`, on met à jour `last_inspection_date`, et on **décale** l'échéance de 2 ans. `is_done` reste `false` — le rappel ne disparaît jamais.
- Côté UI, un rappel `isMandatory` n'expose pas d'action de suppression et son type n'est pas modifiable.

### Kilométrage courant

Le km actuel d'un véhicule **n'est pas stocké**. Il se déduit via la vue `vehicle_current_km` : `GREATEST(purchase_km, MAX(fuel_logs.km), MAX(maintenance_records.km))`. Ne pas ajouter de colonne à tenir à jour à chaque insertion.

## Base de données Supabase

| Table                 | Colonnes clés                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profiles`            | `id` (FK `auth.users`), `username`, `created_at`                                                                                                          |
| `vehicles`            | `user_id`, `make`, `model`, `license_plate`, `fuel_type` (`gasoline`\|`diesel`), `purchase_date`, `purchase_price`, `purchase_km`, `last_inspection_date` |
| `fuel_logs`           | `vehicle_id`, `date`, `km`, `liters`, `total_price`, `is_full_tank`                                                                                       |
| `expenses`            | `vehicle_id`, `date`, `category` (`garage`\|`insurance`\|`tires`\|`parking`\|`other`), `amount`, `description`                                            |
| `recurring_expenses`  | `vehicle_id`, `category` (`insurance`\|`loan`\|`parking`\|`other`), `monthly_amount`, `start_date`, `end_date` (NULL = active), `description`             |
| `maintenance_records` | `vehicle_id`, `type`, `date`, `km`, `amount`, `notes`                                                                                                     |
| `reminders`           | `vehicle_id`, `type`, `due_km`, `due_date`, `notes`, `is_done`, `is_mandatory`                                                                            |

- `type` d'entretien/rappel : `oil_change` \| `inspection` \| `tires` \| `brakes` \| `timing_belt` \| `service` \| `other`.
- Toutes les tables enfants cascadent sur `vehicles(id) ON DELETE CASCADE`.
- Contraintes à respecter côté formulaires : montants et km `>= 0`, `liters > 0`, `end_date >= start_date`, un rappel a **au moins** `due_km` ou `due_date`.
- **RLS activée partout.** `vehicles` filtre sur `auth.uid() = user_id` ; les tables enfants passent par le véhicule parent (`USING` + `WITH CHECK`). Chaque donnée est isolée par utilisateur — ne jamais contourner en filtrant seulement côté client.
- Triggers : `handle_new_user` (crée la ligne `profiles`), `create_inspection_reminder` (crée le rappel CT), `prevent_mandatory_reminder_delete` (bloque la suppression du CT hors cascade véhicule).

## Périmètre V1 / V2

**V1** : auth, garage multi-véhicules, pleins + calcul de conso, dépenses ponctuelles et récurrentes, entretien, rappels, dashboard « À surveiller ». Les indicateurs (km actuel, conso moyenne, coût total, jauge de conso) sont rendus en **HTML/CSS simple**.

**V2** : page Statistiques dédiée avec Chart.js — évolution du kilométrage, coût au kilomètre, répartition des dépenses par catégorie, comparaison entre véhicules. Ne pas installer de librairie de graphiques avant.

Les maquettes sont faites et itérées dans **Claude Design** (projet MonGarage), en version mobile d'abord.

---

# Conventions de code

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
