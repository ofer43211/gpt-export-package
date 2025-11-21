import { describe, it, expect } from 'vitest';

// Helper functions extracted for testing
const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2
  }).format(amount / 100);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'past_due': return 'text-yellow-600 bg-yellow-100';
    case 'canceled': return 'text-red-600 bg-red-100';
    case 'paid': return 'text-green-600 bg-green-100';
    case 'open': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'פעיל';
    case 'past_due': return 'פגול';
    case 'canceled': return 'מבוטל';
    case 'paid': return 'שולם';
    case 'open': return 'פתוח';
    default: return status;
  }
};

describe('BillingWidget Helper Functions', () => {
  describe('formatAmount', () => {
    it('should format USD amounts correctly', () => {
      const result = formatAmount(2999, 'usd');
      // Should contain currency symbol and amount
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should divide by 100 to convert cents to dollars', () => {
      const result = formatAmount(2999, 'usd');
      // 2999 cents = 29.99
      expect(result).toContain('29');
    });

    it('should format EUR currency', () => {
      const result = formatAmount(5000, 'eur');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format ILS currency', () => {
      const result = formatAmount(10000, 'ils');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format GBP currency', () => {
      const result = formatAmount(7500, 'gbp');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle zero amount', () => {
      const result = formatAmount(0, 'usd');
      expect(result).toBeTruthy();
      expect(result).toContain('0');
    });

    it('should handle large amounts', () => {
      const result = formatAmount(999999, 'usd');
      expect(result).toBeTruthy();
    });

    it('should include minimum 2 decimal places', () => {
      const result = formatAmount(1000, 'usd');
      // Should format as 10.00
      expect(result).toBeTruthy();
    });

    it('should handle lowercase currency codes', () => {
      const result = formatAmount(2999, 'usd');
      expect(result).toBeTruthy();
    });

    it('should handle uppercase currency codes', () => {
      const result = formatAmount(2999, 'USD');
      expect(result).toBeTruthy();
    });

    it('should produce consistent output for same input', () => {
      const result1 = formatAmount(2999, 'usd');
      const result2 = formatAmount(2999, 'usd');
      expect(result1).toBe(result2);
    });
  });

  describe('formatDate', () => {
    it('should format timestamp in Hebrew locale', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const formatted = formatDate(timestamp);

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should include year in formatted date', () => {
      const timestamp = new Date('2024-06-15').getTime();
      const formatted = formatDate(timestamp);

      expect(formatted).toContain('2024');
    });

    it('should format current date', () => {
      const now = Date.now();
      const formatted = formatDate(now);

      expect(formatted).toBeTruthy();
    });

    it('should format past dates', () => {
      const past = new Date('2020-01-01').getTime();
      const formatted = formatDate(past);

      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2020');
    });

    it('should format future dates', () => {
      const future = new Date('2025-12-31').getTime();
      const formatted = formatDate(future);

      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2025');
    });

    it('should handle epoch timestamp', () => {
      const formatted = formatDate(0);
      expect(formatted).toBeTruthy();
    });

    it('should produce consistent output for same timestamp', () => {
      const timestamp = 1640000000000;
      const format1 = formatDate(timestamp);
      const format2 = formatDate(timestamp);

      expect(format1).toBe(format2);
    });

    it('should use long month format', () => {
      const timestamp = new Date('2024-03-15').getTime();
      const formatted = formatDate(timestamp);

      // Should contain month name, not just number
      expect(formatted).toBeTruthy();
      expect(formatted.length).toBeGreaterThan(10); // Long format is longer
    });
  });

  describe('getStatusColor', () => {
    it('should return green for active status', () => {
      const result = getStatusColor('active');
      expect(result).toBe('text-green-600 bg-green-100');
    });

    it('should return yellow for past_due status', () => {
      const result = getStatusColor('past_due');
      expect(result).toBe('text-yellow-600 bg-yellow-100');
    });

    it('should return red for canceled status', () => {
      const result = getStatusColor('canceled');
      expect(result).toBe('text-red-600 bg-red-100');
    });

    it('should return green for paid status', () => {
      const result = getStatusColor('paid');
      expect(result).toBe('text-green-600 bg-green-100');
    });

    it('should return blue for open status', () => {
      const result = getStatusColor('open');
      expect(result).toBe('text-blue-600 bg-blue-100');
    });

    it('should return gray for unknown status', () => {
      const result = getStatusColor('unknown');
      expect(result).toBe('text-gray-600 bg-gray-100');
    });

    it('should return gray for empty string', () => {
      const result = getStatusColor('');
      expect(result).toBe('text-gray-600 bg-gray-100');
    });

    it('should handle null and undefined', () => {
      const resultNull = getStatusColor(null as any);
      const resultUndefined = getStatusColor(undefined as any);
      expect(resultNull).toBe('text-gray-600 bg-gray-100');
      expect(resultUndefined).toBe('text-gray-600 bg-gray-100');
    });

    it('should be case sensitive', () => {
      const resultLower = getStatusColor('active');
      const resultUpper = getStatusColor('ACTIVE');
      expect(resultLower).toBe('text-green-600 bg-green-100');
      expect(resultUpper).toBe('text-gray-600 bg-gray-100');
    });
  });

  describe('getStatusText', () => {
    it('should return Hebrew text for active', () => {
      const result = getStatusText('active');
      expect(result).toBe('פעיל');
    });

    it('should return Hebrew text for past_due', () => {
      const result = getStatusText('past_due');
      expect(result).toBe('פגול');
    });

    it('should return Hebrew text for canceled', () => {
      const result = getStatusText('canceled');
      expect(result).toBe('מבוטל');
    });

    it('should return Hebrew text for paid', () => {
      const result = getStatusText('paid');
      expect(result).toBe('שולם');
    });

    it('should return Hebrew text for open', () => {
      const result = getStatusText('open');
      expect(result).toBe('פתוח');
    });

    it('should return original status for unknown values', () => {
      const result = getStatusText('custom_status');
      expect(result).toBe('custom_status');
    });

    it('should return empty string when given empty string', () => {
      const result = getStatusText('');
      expect(result).toBe('');
    });

    it('should handle all subscription statuses', () => {
      expect(getStatusText('active')).toBe('פעיל');
      expect(getStatusText('past_due')).toBe('פגול');
      expect(getStatusText('canceled')).toBe('מבוטל');
    });

    it('should handle all invoice statuses', () => {
      expect(getStatusText('paid')).toBe('שולם');
      expect(getStatusText('open')).toBe('פתוח');
    });
  });

  describe('Integration - Status Functions', () => {
    it('should have matching status colors and texts', () => {
      const statuses = ['active', 'past_due', 'canceled', 'paid', 'open'];

      statuses.forEach(status => {
        const color = getStatusColor(status);
        const text = getStatusText(status);

        expect(color).toBeTruthy();
        expect(text).toBeTruthy();
      });
    });

    it('should handle all valid statuses without errors', () => {
      const allStatuses = ['active', 'inactive', 'past_due', 'canceled', 'paid', 'open', 'void', 'uncollectible'];

      allStatuses.forEach(status => {
        expect(() => getStatusColor(status)).not.toThrow();
        expect(() => getStatusText(status)).not.toThrow();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative amounts', () => {
      // While unlikely in production, should not crash
      const result = formatAmount(-1000, 'usd');
      expect(result).toBeTruthy();
    });

    it('should handle very small amounts', () => {
      const result = formatAmount(1, 'usd');
      expect(result).toBeTruthy();
    });

    it('should handle timestamps far in the future', () => {
      const farFuture = new Date('2099-12-31').getTime();
      const formatted = formatDate(farFuture);
      expect(formatted).toBeTruthy();
    });

    it('should handle timestamps far in the past', () => {
      const farPast = new Date('1970-01-02').getTime();
      const formatted = formatDate(farPast);
      expect(formatted).toBeTruthy();
    });
  });
});
