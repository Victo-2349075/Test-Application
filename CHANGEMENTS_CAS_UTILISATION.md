# Récapitulatif des changements (cas d'utilisation)

## Objectif
Stabiliser la connexion React ↔ API Laravel et améliorer la gestion d'erreurs, notamment pour les erreurs SQL.

## Changements appliqués

### 1) Front-end React: connexion API plus robuste
- Fichier: `ebadge_React/src/utils/Api.js`
- Actions:
  - Ajout d'un fallback automatique de l'URL API vers `/api` si `REACT_APP_LARAVEL_API_URL` n'est pas défini.
  - Protection contre les erreurs sans `response` Axios (évite des plantages JS quand l'API est indisponible).
  - Ajout d'un message d'erreur utilisateur normalisé (`error.userFriendlyMessage`).
  - Commentaires en français et ajout de `@author Philippe-Vu Beaulieu`.

### 2) Front-end React: nouveau fichier de gestion d'erreurs
- Fichier: `ebadge_React/src/utils/ErrorHandler.js`
- Actions:
  - Création d'un module central pour transformer les erreurs techniques en messages lisibles.
  - Gestion des cas:
    - erreurs HTTP API,
    - API injoignable (connexion/refus CORS/serveur arrêté),
    - erreurs JS inattendues.
  - Commentaires en français et ajout de `@author Philippe-Vu Beaulieu`.

### 3) Back-end Laravel: gestion explicite des erreurs SQL
- Fichier: `ebadge_laravel/app/Exceptions/Handler.php`
- Actions:
  - Interception des `QueryException` pour retourner un JSON propre:
    - `message`: erreur SQL générique,
    - `error_code`: `DB_QUERY_ERROR`,
    - HTTP 500.
  - Interception explicite de `AuthenticationException` pour uniformiser la réponse API en JSON.
  - Commentaires en français et ajout de `@author Philippe-Vu Beaulieu`.

### 4) Configuration d'environnement front
- Fichier: `ebadge_React/.env.example`
- Actions:
  - Ajout d'un exemple clair des variables nécessaires:
    - `REACT_APP_LARAVEL_API_URL`
    - `REACT_APP_LARAVEL_RESOURCE_URL`
  - Commentaires en français et ajout de `@author Philippe-Vu Beaulieu`.

## Résultat attendu
- Le front ne casse plus quand l'API est indisponible.
- Les erreurs SQL sont renvoyées proprement côté API (sans exposer des détails sensibles).
- Le projet fournit un point unique de gestion d'erreurs côté React.
- La configuration API/ressources côté front est plus claire via `.env.example`.
