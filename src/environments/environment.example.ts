/**
 * Modèle de configuration — à copier en `environment.ts`, qui n'est pas suivi
 * par git :
 *
 *   cp src/environments/environment.example.ts src/environments/environment.ts
 *
 * Les deux valeurs se trouvent dans le dashboard Supabase, sous
 * Project Settings → API. Prendre la clé `anon` / `public`, jamais la clé
 * `service_role` : celle-ci contourne RLS et n'a rien à faire dans un bundle
 * front.
 *
 * La clé `anon` finit de toute façon dans le bundle livré au navigateur — c'est
 * assumé, sa sécurité repose entièrement sur les policies RLS.
 */
export const environment = {
  supabase: {
    url: 'https://votre-projet.supabase.co',
    anonKey: 'votre-cle-anon',
  },
};
