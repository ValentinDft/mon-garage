/**
 * Typage du schéma Supabase — écrit à la main, au format produit par
 * `supabase gen types typescript`.
 *
 * À tenir aligné sur la source de vérité du schéma : la page Notion
 * « Architecture & Schémas » du projet MonGarage. Le jour où la CLI Supabase
 * est installée, ce fichier est régénérable tel quel :
 *   supabase gen types typescript --project-id <id> > src/app/core/models/database.types.ts
 *
 * Les unions littérales ci-dessous sont à reporter après chaque régénération :
 * les contraintes `CHECK` ne sont pas des `ENUM` Postgres, la CLI les génère
 * donc en `string`.
 *
 * Ces types décrivent la base, donc en `snake_case`. Les interfaces du domaine
 * sont en `camelCase` : la conversion se fait dans les services, via
 * `core/utils/case-mapper.ts`.
 */

/** Types de carburant gérés — `vehicles.fuel_type`. */
export type FuelType = 'gasoline' | 'diesel';

/** Catégories de dépense ponctuelle — `expenses.category`. */
export type ExpenseCategory = 'garage' | 'insurance' | 'tires' | 'parking' | 'other';

/** Catégories de dépense récurrente — `recurring_expenses.category`. */
export type RecurringExpenseCategory = 'insurance' | 'loan' | 'parking' | 'other';

/** Types d'entretien et de rappel — `maintenance_records.type`, `reminders.type`. */
export type MaintenanceType =
  'oil_change' | 'inspection' | 'tires' | 'brakes' | 'timing_belt' | 'service' | 'other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          license_plate: string | null;
          fuel_type: FuelType;
          purchase_date: string | null;
          purchase_price: number | null;
          purchase_km: number;
          last_inspection_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          license_plate?: string | null;
          fuel_type?: FuelType;
          purchase_date?: string | null;
          purchase_price?: number | null;
          purchase_km?: number;
          last_inspection_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string;
          model?: string;
          license_plate?: string | null;
          fuel_type?: FuelType;
          purchase_date?: string | null;
          purchase_price?: number | null;
          purchase_km?: number;
          last_inspection_date?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vehicles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      fuel_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          date: string;
          km: number;
          liters: number;
          total_price: number;
          is_full_tank: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          date: string;
          km: number;
          liters: number;
          total_price: number;
          is_full_tank?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          date?: string;
          km?: number;
          liters?: number;
          total_price?: number;
          is_full_tank?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fuel_logs_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      expenses: {
        Row: {
          id: string;
          vehicle_id: string;
          date: string;
          category: ExpenseCategory;
          amount: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          date: string;
          category: ExpenseCategory;
          amount: number;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          date?: string;
          category?: ExpenseCategory;
          amount?: number;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'expenses_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      recurring_expenses: {
        Row: {
          id: string;
          vehicle_id: string;
          category: RecurringExpenseCategory;
          monthly_amount: number;
          start_date: string;
          end_date: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          category: RecurringExpenseCategory;
          monthly_amount: number;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          category?: RecurringExpenseCategory;
          monthly_amount?: number;
          start_date?: string;
          end_date?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recurring_expenses_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      maintenance_records: {
        Row: {
          id: string;
          vehicle_id: string;
          type: MaintenanceType;
          date: string;
          km: number | null;
          amount: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          type: MaintenanceType;
          date: string;
          km?: number | null;
          amount?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          type?: MaintenanceType;
          date?: string;
          km?: number | null;
          amount?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'maintenance_records_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
      reminders: {
        Row: {
          id: string;
          vehicle_id: string;
          type: MaintenanceType;
          due_km: number | null;
          due_date: string | null;
          notes: string | null;
          is_done: boolean;
          is_mandatory: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          type: MaintenanceType;
          due_km?: number | null;
          due_date?: string | null;
          notes?: string | null;
          is_done?: boolean;
          is_mandatory?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          type?: MaintenanceType;
          due_km?: number | null;
          due_date?: string | null;
          notes?: string | null;
          is_done?: boolean;
          is_mandatory?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reminders_vehicle_id_fkey';
            columns: ['vehicle_id'];
            isOneToOne: false;
            referencedRelation: 'vehicles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      /** Kilométrage courant déduit — jamais stocké, voir la migration initiale. */
      vehicle_current_km: {
        Row: {
          vehicle_id: string | null;
          current_km: number | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** Raccourci vers la ligne lue d'une table : `Tables<'vehicles'>`. */
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

/** Raccourci vers la charge d'insertion d'une table : `TablesInsert<'fuel_logs'>`. */
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

/** Raccourci vers la charge de mise à jour d'une table : `TablesUpdate<'reminders'>`. */
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

/** Raccourci vers la ligne lue d'une vue : `Views<'vehicle_current_km'>`. */
export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row'];
