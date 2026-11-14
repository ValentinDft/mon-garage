import { camelCaseKey, snakeCaseKey, toCamelCase, toSnakeCase } from './case-mapper';

describe('case-mapper', () => {
  describe('camelCaseKey', () => {
    it('convertit une colonne Postgres en propriété TypeScript', () => {
      expect(camelCaseKey('is_full_tank')).toBe('isFullTank');
      expect(camelCaseKey('last_inspection_date')).toBe('lastInspectionDate');
    });

    it('laisse les clés déjà simples intactes', () => {
      expect(camelCaseKey('km')).toBe('km');
      expect(camelCaseKey('id')).toBe('id');
    });
  });

  describe('snakeCaseKey', () => {
    it('convertit une propriété TypeScript en colonne Postgres', () => {
      expect(snakeCaseKey('isFullTank')).toBe('is_full_tank');
      expect(snakeCaseKey('monthlyAmount')).toBe('monthly_amount');
    });
  });

  describe('toCamelCase', () => {
    it('convertit les clés d’une ligne lue en base', () => {
      const row = { vehicle_id: 'v1', is_full_tank: true, total_price: 62.4 };

      expect(toCamelCase(row)).toEqual({ vehicleId: 'v1', isFullTank: true, totalPrice: 62.4 });
    });

    it('préserve les valeurs nulles', () => {
      expect(toCamelCase({ due_km: null, due_date: '2026-12-01' })).toEqual({
        dueKm: null,
        dueDate: '2026-12-01',
      });
    });

    it('descend dans les objets et tableaux imbriqués des jointures', () => {
      const row = {
        id: 'v1',
        license_plate: 'AB-123-CD',
        fuel_logs: [{ is_full_tank: false, total_price: 30 }],
        vehicle_current_km: { current_km: 142_000 },
      };

      expect(toCamelCase(row)).toEqual({
        id: 'v1',
        licensePlate: 'AB-123-CD',
        fuelLogs: [{ isFullTank: false, totalPrice: 30 }],
        vehicleCurrentKm: { currentKm: 142_000 },
      });
    });

    it('ne touche pas aux instances de Date', () => {
      const date = new Date('2026-11-14');

      expect(toCamelCase({ purchase_date: date }).purchaseDate).toBe(date);
    });
  });

  describe('toSnakeCase', () => {
    it('convertit les clés d’une charge écrite en base', () => {
      const payload = { vehicleId: 'v1', isFullTank: true, totalPrice: 62.4 };

      expect(toSnakeCase(payload)).toEqual({
        vehicle_id: 'v1',
        is_full_tank: true,
        total_price: 62.4,
      });
    });

    it('fait l’aller-retour sans perte', () => {
      const row = { vehicle_id: 'v1', monthly_amount: 42, end_date: null };

      expect(toSnakeCase(toCamelCase(row))).toEqual(row);
    });
  });
});
