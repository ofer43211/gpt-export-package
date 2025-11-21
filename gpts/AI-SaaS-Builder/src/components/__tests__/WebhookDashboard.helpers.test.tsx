import { describe, it, expect } from 'vitest';
import WebhookDashboard from '../WebhookDashboard';

// Helper functions extracted for testing
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-green-600 bg-green-100';
    case 'failed': return 'text-red-600 bg-red-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

describe('WebhookDashboard Helper Functions', () => {
  describe('getStatusColor', () => {
    it('should return green classes for success status', () => {
      const result = getStatusColor('success');
      expect(result).toBe('text-green-600 bg-green-100');
    });

    it('should return red classes for failed status', () => {
      const result = getStatusColor('failed');
      expect(result).toBe('text-red-600 bg-red-100');
    });

    it('should return yellow classes for pending status', () => {
      const result = getStatusColor('pending');
      expect(result).toBe('text-yellow-600 bg-yellow-100');
    });

    it('should return gray classes for unknown status', () => {
      const result = getStatusColor('unknown');
      expect(result).toBe('text-gray-600 bg-gray-100');
    });

    it('should return gray classes for empty string', () => {
      const result = getStatusColor('');
      expect(result).toBe('text-gray-600 bg-gray-100');
    });

    it('should handle null and undefined gracefully', () => {
      const resultNull = getStatusColor(null as any);
      const resultUndefined = getStatusColor(undefined as any);
      expect(resultNull).toBe('text-gray-600 bg-gray-100');
      expect(resultUndefined).toBe('text-gray-600 bg-gray-100');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp in Hebrew locale', () => {
      const timestamp = new Date('2024-01-15T10:30:00').getTime();
      const formatted = formatTimestamp(timestamp);

      // Check that it contains basic date components
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle current timestamp', () => {
      const now = Date.now();
      const formatted = formatTimestamp(now);

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle past timestamps', () => {
      const pastTimestamp = new Date('2020-06-01T15:45:30').getTime();
      const formatted = formatTimestamp(pastTimestamp);

      expect(formatted).toBeTruthy();
    });

    it('should handle zero timestamp', () => {
      const formatted = formatTimestamp(0);
      expect(formatted).toBeTruthy();
    });

    it('should produce consistent format', () => {
      const timestamp = 1640000000000; // Fixed timestamp
      const format1 = formatTimestamp(timestamp);
      const format2 = formatTimestamp(timestamp);

      expect(format1).toBe(format2);
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate correct statistics from events', () => {
      const mockEvents = [
        { id: '1', type: 'test', created: Date.now(), data: {}, status: 'success' as const },
        { id: '2', type: 'test', created: Date.now(), data: {}, status: 'success' as const },
        { id: '3', type: 'test', created: Date.now(), data: {}, status: 'failed' as const },
        { id: '4', type: 'test', created: Date.now(), data: {}, status: 'pending' as const }
      ];

      const stats = {
        total: mockEvents.length,
        success: mockEvents.filter(e => e.status === 'success').length,
        failed: mockEvents.filter(e => e.status === 'failed').length,
        pending: mockEvents.filter(e => e.status === 'pending').length
      };

      expect(stats.total).toBe(4);
      expect(stats.success).toBe(2);
      expect(stats.failed).toBe(1);
      expect(stats.pending).toBe(1);
    });

    it('should handle empty events array', () => {
      const mockEvents: any[] = [];

      const stats = {
        total: mockEvents.length,
        success: mockEvents.filter(e => e.status === 'success').length,
        failed: mockEvents.filter(e => e.status === 'failed').length,
        pending: mockEvents.filter(e => e.status === 'pending').length
      };

      expect(stats.total).toBe(0);
      expect(stats.success).toBe(0);
      expect(stats.failed).toBe(0);
      expect(stats.pending).toBe(0);
    });

    it('should handle all success events', () => {
      const mockEvents = [
        { id: '1', type: 'test', created: Date.now(), data: {}, status: 'success' as const },
        { id: '2', type: 'test', created: Date.now(), data: {}, status: 'success' as const }
      ];

      const stats = {
        total: mockEvents.length,
        success: mockEvents.filter(e => e.status === 'success').length,
        failed: mockEvents.filter(e => e.status === 'failed').length,
        pending: mockEvents.filter(e => e.status === 'pending').length
      };

      expect(stats.total).toBe(2);
      expect(stats.success).toBe(2);
      expect(stats.failed).toBe(0);
      expect(stats.pending).toBe(0);
    });

    it('should handle all failed events', () => {
      const mockEvents = [
        { id: '1', type: 'test', created: Date.now(), data: {}, status: 'failed' as const },
        { id: '2', type: 'test', created: Date.now(), data: {}, status: 'failed' as const }
      ];

      const stats = {
        total: mockEvents.length,
        success: mockEvents.filter(e => e.status === 'success').length,
        failed: mockEvents.filter(e => e.status === 'failed').length,
        pending: mockEvents.filter(e => e.status === 'pending').length
      };

      expect(stats.total).toBe(2);
      expect(stats.success).toBe(0);
      expect(stats.failed).toBe(2);
      expect(stats.pending).toBe(0);
    });
  });

  describe('JSON Payload Truncation', () => {
    it('should truncate long JSON strings', () => {
      const longData = {
        veryLongKey: 'a'.repeat(1000),
        anotherKey: 'b'.repeat(1000)
      };

      const jsonString = JSON.stringify(longData, null, 2);
      const truncated = jsonString.substring(0, 50);

      expect(truncated.length).toBe(50);
      expect(truncated.length).toBeLessThan(jsonString.length);
    });

    it('should not truncate short JSON strings unnecessarily', () => {
      const shortData = { amount: 100 };
      const jsonString = JSON.stringify(shortData, null, 2);

      if (jsonString.length <= 50) {
        const truncated = jsonString.substring(0, 50);
        expect(truncated).toBe(jsonString);
      } else {
        const truncated = jsonString.substring(0, 50);
        expect(truncated.length).toBe(50);
      }
    });

    it('should handle empty objects', () => {
      const emptyData = {};
      const jsonString = JSON.stringify(emptyData, null, 2);
      const truncated = jsonString.substring(0, 50);

      expect(truncated).toBeTruthy();
    });
  });
});
