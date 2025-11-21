import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/testUtils';
import WebhookDashboard from '../WebhookDashboard';
import { mockWebhookEvents, mockWebhookStats } from '@test/mockData';

describe('WebhookDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render loading state initially', () => {
      render(<WebhookDashboard />);

      const loadingText = screen.getByText(/טוען נתונים/i);
      expect(loadingText).toBeInTheDocument();
    });

    it('should show spinner during loading', () => {
      render(<WebhookDashboard />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render without crashing', () => {
      expect(() => render(<WebhookDashboard />)).not.toThrow();
    });
  });

  describe('After Data Load', () => {
    it('should display header after loading', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const header = screen.getByText(/דשבורד Webhook/i);
        expect(header).toBeInTheDocument();
      });
    });

    it('should display description text', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const description = screen.getByText(/מעקב אחר אירועי webhook/i);
        expect(description).toBeInTheDocument();
      });
    });

    it('should not show loading state after data loads', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const loadingText = screen.queryByText(/טוען נתונים/i);
        expect(loadingText).not.toBeInTheDocument();
      });
    });
  });

  describe('Statistics Cards', () => {
    it('should display total events statistic', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const totalLabel = screen.getByText(/סה"כ אירועים/i);
        expect(totalLabel).toBeInTheDocument();
      });
    });

    it('should display success events statistic', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const successLabel = screen.getByText(/הצלחות/i);
        expect(successLabel).toBeInTheDocument();
      });
    });

    it('should display failed events statistic', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const failedLabel = screen.getByText(/כשלונות/i);
        expect(failedLabel).toBeInTheDocument();
      });
    });

    it('should display pending events statistic', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const pendingLabel = screen.getByText(/ממתינים/i);
        expect(pendingLabel).toBeInTheDocument();
      });
    });

    it('should display correct statistic numbers', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        // The mock data creates 3 events total
        const statsNumbers = screen.getAllByText('3');
        expect(statsNumbers.length).toBeGreaterThan(0);
      });
    });

    it('should render all 4 statistic cards', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.grid > .bg-white');
        expect(cards.length).toBe(4);
      });
    });
  });

  describe('Events Table', () => {
    it('should display table header', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const tableHeader = screen.getByText(/אירועים אחרונים/i);
        expect(tableHeader).toBeInTheDocument();
      });
    });

    it('should display table column headers', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        expect(screen.getByText(/סוג אירוע/i)).toBeInTheDocument();
        expect(screen.getByText(/זמן/i)).toBeInTheDocument();
        expect(screen.getByText(/סטטוס/i)).toBeInTheDocument();
        expect(screen.getByText(/נתונים/i)).toBeInTheDocument();
      });
    });

    it('should render event rows', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const eventType = screen.getByText(/payment_intent.succeeded/i);
        expect(eventType).toBeInTheDocument();
      });
    });

    it('should display event types correctly', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        expect(screen.getByText('payment_intent.succeeded')).toBeInTheDocument();
        expect(screen.getByText('invoice.payment_failed')).toBeInTheDocument();
        expect(screen.getByText('customer.subscription.updated')).toBeInTheDocument();
      });
    });

    it('should display event statuses in Hebrew', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const successStatuses = screen.getAllByText(/הצליח/i);
        const failedStatuses = screen.getAllByText(/נכשל/i);

        expect(successStatuses.length).toBeGreaterThan(0);
        expect(failedStatuses.length).toBeGreaterThan(0);
      });
    });

    it('should apply correct status badge styles', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const successBadges = container.querySelectorAll('.text-green-600');
        const failedBadges = container.querySelectorAll('.text-red-600');

        expect(successBadges.length).toBeGreaterThan(0);
        expect(failedBadges.length).toBeGreaterThan(0);
      });
    });

    it('should display event data as JSON code', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const codeElements = container.querySelectorAll('code');
        expect(codeElements.length).toBeGreaterThan(0);
      });
    });

    it('should render table with proper structure', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();

        const thead = container.querySelector('thead');
        expect(thead).toBeInTheDocument();

        const tbody = container.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Button', () => {
    it('should display refresh button', async () => {
      render(<WebhookDashboard />);

      await waitFor(() => {
        const refreshButton = screen.getByText(/רענן נתונים/i);
        expect(refreshButton).toBeInTheDocument();
      });
    });

    it('should have correct button styling', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const button = screen.getByText(/רענן נתונים/i);
        expect(button).toHaveClass('bg-blue-600');
      });
    });

    it('should reload page when clicked', async () => {
      // Mock window.location.reload
      const mockReload = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: mockReload },
        writable: true
      });

      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const button = screen.getByText(/רענן נתונים/i);
        button.click();
        expect(mockReload).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Component Structure', () => {
    it('should render with proper spacing classes', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const mainDiv = container.querySelector('.space-y-6');
        expect(mainDiv).toBeInTheDocument();
      });
    });

    it('should use grid layout for statistics', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();
        expect(grid).toHaveClass('grid-cols-1');
        expect(grid).toHaveClass('md:grid-cols-4');
      });
    });

    it('should have rounded corners on cards', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.rounded-lg');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('should have shadow on cards', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.shadow-sm');
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive table wrapper', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const tableWrapper = container.querySelector('.overflow-x-auto');
        expect(tableWrapper).toBeInTheDocument();
      });
    });

    it('should have responsive grid columns', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const grid = container.querySelector('.grid');
        expect(grid?.classList.contains('md:grid-cols-4')).toBe(true);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const heading = container.querySelector('h2');
        expect(heading).toBeInTheDocument();

        const table = container.querySelector('table');
        expect(table).toBeInTheDocument();
      });
    });

    it('should have table headers', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const headers = container.querySelectorAll('th');
        expect(headers.length).toBe(4);
      });
    });

    it('should have proper button element', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle console errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<WebhookDashboard />);

      await waitFor(() => {
        const header = screen.getByText(/דשבורד Webhook/i);
        expect(header).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('SVG Icons', () => {
    it('should render icons for statistics', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBeGreaterThan(0);
      });
    });

    it('should have correct icon colors', async () => {
      const { container } = render(<WebhookDashboard />);

      await waitFor(() => {
        const blueIcon = container.querySelector('.text-blue-600');
        const greenIcon = container.querySelector('.text-green-600');
        const redIcon = container.querySelector('.text-red-600');
        const yellowIcon = container.querySelector('.text-yellow-600');

        expect(blueIcon).toBeInTheDocument();
        expect(greenIcon).toBeInTheDocument();
        expect(redIcon).toBeInTheDocument();
        expect(yellowIcon).toBeInTheDocument();
      });
    });
  });
});
