/**
 * Conversion `snake_case` ↔ `camelCase` entre les lignes Postgres et les
 * interfaces du domaine.
 *
 * Postgres parle `snake_case`, le code TypeScript parle `camelCase`. La
 * frontière est le service : une ligne lue passe par `toCamelCase`, une charge
 * écrite passe par `toSnakeCase`. Aucun composant ne manipule de clé
 * `snake_case`.
 *
 * La conversion est récursive pour couvrir les jointures Supabase
 * (`select('*, fuel_logs(*)')` renvoie des objets et des tableaux imbriqués).
 * Tout ce qui n'est pas un objet littéral ou un tableau — chaîne, nombre,
 * booléen, `null`, `Date` — traverse sans être touché.
 */

/** `'is_full_tank'` → `'isFullTank'`, au niveau des types. */
type CamelCaseKey<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelCaseKey<Tail>>}`
  : S;

/** `'isFullTank'` → `'is_full_tank'`, au niveau des types. */
type SnakeCaseKey<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Head extends Uppercase<Head>
    ? Head extends Lowercase<Head> // chiffres et séparateurs : ni l'un ni l'autre
      ? `${Head}${SnakeCaseKey<Tail>}`
      : `_${Lowercase<Head>}${SnakeCaseKey<Tail>}`
    : `${Head}${SnakeCaseKey<Tail>}`
  : S;

/** Même structure, clés en `camelCase`. */
export type Camelized<T> = T extends readonly (infer Item)[]
  ? Camelized<Item>[]
  : T extends Date
    ? T
    : T extends object
      ? { [K in keyof T as CamelCaseKey<K & string>]: Camelized<T[K]> }
      : T;

/** Même structure, clés en `snake_case`. */
export type Snakeized<T> = T extends readonly (infer Item)[]
  ? Snakeized<Item>[]
  : T extends Date
    ? T
    : T extends object
      ? { [K in keyof T as SnakeCaseKey<K & string>]: Snakeized<T[K]> }
      : T;

/** Les objets littéraux sont convertis, le reste (Date, null, primitives) non. */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  );
}

function convertKeys(value: unknown, convertKey: (key: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => convertKeys(item, convertKey));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [convertKey(key), convertKeys(item, convertKey)]),
  );
}

/** `'is_full_tank'` → `'isFullTank'`. */
export function camelCaseKey(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, char: string) => char.toUpperCase());
}

/** `'isFullTank'` → `'is_full_tank'`. */
export function snakeCaseKey(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

/** Convertit une ligne lue en base vers le domaine. */
export function toCamelCase<T>(row: T): Camelized<T> {
  return convertKeys(row, camelCaseKey) as Camelized<T>;
}

/** Convertit une charge du domaine vers les colonnes de la base. */
export function toSnakeCase<T>(payload: T): Snakeized<T> {
  return convertKeys(payload, snakeCaseKey) as Snakeized<T>;
}
