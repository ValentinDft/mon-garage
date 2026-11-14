import { Service } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';
import type { Database } from '../models/database.types';

/** Valeurs du modèle `environment.example.ts`, qui ne pointent sur aucun projet. */
const PLACEHOLDER_VALUES = ['https://votre-projet.supabase.co', 'votre-cle-anon'];

/**
 * Point d'entrée unique vers Supabase.
 *
 * Le client est instancié ici et nulle part ailleurs : aucun composant ni
 * service ne doit importer `createClient` directement. Les services du domaine
 * (vehicle, fuel-log, expense...) consomment `client` et sont les seuls à
 * connaître les noms de colonnes `snake_case`.
 */
@Service()
export class SupabaseService {
  readonly client: SupabaseClient<Database>;

  constructor() {
    const { url, anonKey } = environment.supabase;

    if (PLACEHOLDER_VALUES.includes(url) || PLACEHOLDER_VALUES.includes(anonKey)) {
      throw new Error(
        'Configuration Supabase manquante : copiez src/environments/environment.example.ts ' +
          'en environment.ts et renseignez l’URL du projet et la clé anon.',
      );
    }

    this.client = createClient<Database>(url, anonKey, {
      auth: {
        // La session est conservée en localStorage et rafraîchie en tâche de
        // fond : l'app est une PWA installée, elle doit rester connectée entre
        // deux ouvertures. `detectSessionInUrl` traite les liens de
        // confirmation et de réinitialisation de mot de passe.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  /** Raccourci vers l'API d'authentification, consommé par `auth.service.ts`. */
  get auth(): SupabaseClient<Database>['auth'] {
    return this.client.auth;
  }
}
