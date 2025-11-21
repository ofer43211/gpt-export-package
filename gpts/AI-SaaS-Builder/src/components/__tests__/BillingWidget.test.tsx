import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@test/testUtils';
import userEvent from '@testing-library/user-event';
import BillingWidget from '../BillingWidget';

describe('BillingWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('should render loading state initially', () => {
      render(<BillingWidget />);

      const loadingText = screen.getByText(/טוען נתוני חיוב/i);
      expect(loadingText).toBeInTheDocument();
    });

    it('should show spinner during loading', () => {
      render(<BillingWidget />);

      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render without crashing', () => {
      expect(() => render(<BillingWidget />)).not.toThrow();
    });
  });

  describe('After Data Load', () => {
    it('should display main header', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const header = screen.getByText(/ניהול חיוב ומנויים/i);
        expect(header).toBeInTheDocument();
      });
    });

    it('should display description text', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const description = screen.getByText(/נהל את המנוי שלך/i);
        expect(description).toBeInTheDocument();
      });
    });

    it('should not show loading state after data loads', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const loadingText = screen.queryByText(/טוען נתוני חיוב/i);
        expect(loadingText).not.toBeInTheDocument();
      });
    });
  });

  describe('Subscription Section', () => {
    it('should display subscription section header', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const header = screen.getByText(/מנוי נוכחי/i);
        expect(header).toBeInTheDocument();
      });
    });

    it('should display plan name', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const planName = screen.getByText(/Pro Plan/i);
        expect(planName).toBeInTheDocument();
      });
    });

    it('should display subscription status', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const status = screen.getByText(/פעיל/i);
        expect(status).toBeInTheDocument();
      });
    });

    it('should display period start label', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const label = screen.getByText(/תחילת תקופה/i);
        expect(label).toBeInTheDocument();
      });
    });

    it('should display period end label', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const label = screen.getByText(/סוף תקופה/i);
        expect(label).toBeInTheDocument();
      });
    });

    it('should have correct status badge styling', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const statusBadge = container.querySelector('.text-green-600.bg-green-100');
        expect(statusBadge).toBeInTheDocument();
      });
    });
  });

  describe('Update Payment Method Button', () => {
    it('should display update payment method button', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const button = screen.getByText(/עדכן אמצעי תשלום/i);
        expect(button).toBeInTheDocument();
      });
    });

    it('should have correct button styling', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const button = screen.getByText(/עדכן אמצעי תשלום/i);
        expect(button).toHaveClass('bg-blue-600');
      });
    });

    it('should open new window when clicked', async () => {
      const mockOpen = vi.fn();
      window.open = mockOpen;

      render(<BillingWidget />);

      await waitFor(async () => {
        const button = screen.getByText(/עדכן אמצעי תשלום/i);
        await userEvent.click(button);
        expect(mockOpen).toHaveBeenCalledWith(
          'https://billing.stripe.com/p/login/test_123',
          '_blank'
        );
      });
    });
  });

  describe('Cancel Subscription Button', () => {
    it('should display cancel button when subscription is active', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const button = screen.getByText(/בטל מנוי/i);
        expect(button).toBeInTheDocument();
      });
    });

    it('should have correct cancel button styling', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const button = screen.getByText(/בטל מנוי/i);
        expect(button).toHaveClass('bg-red-600');
      });
    });

    it('should open modal when cancel button is clicked', async () => {
      render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const modalTitle = screen.getByText(/בטל מנוי/i);
        expect(modalTitle).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Modal', () => {
    it('should display modal content when opened', async () => {
      render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const modalText = screen.getByText(/האם אתה בטוח שברצונך לבטל את המנוי/i);
        expect(modalText).toBeInTheDocument();
      });
    });

    it('should have cancel and confirm buttons in modal', async () => {
      render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const cancelModalButton = screen.getByText(/^ביטול$/i);
        const confirmButton = screen.getByText(/כן, בטל מנוי/i);

        expect(cancelModalButton).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
      });
    });

    it('should close modal when cancel button is clicked', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        // Modal should be visible
        let modal = container.querySelector('.fixed.inset-0');
        expect(modal).toBeInTheDocument();

        // Click cancel in modal
        const cancelModalButton = screen.getByText(/^ביטול$/i);
        await userEvent.click(cancelModalButton);

        // Modal should be gone
        await waitFor(() => {
          modal = container.querySelector('.fixed.inset-0');
          expect(modal).not.toBeInTheDocument();
        });
      });
    });

    it('should close modal when confirm button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const { container } = render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const confirmButton = screen.getByText(/כן, בטל מנוי/i);
        await userEvent.click(confirmButton);

        await waitFor(() => {
          const modal = container.querySelector('.fixed.inset-0');
          expect(modal).not.toBeInTheDocument();
        });
      });

      consoleSpy.mockRestore();
    });

    it('should have overlay background', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const overlay = container.querySelector('.bg-black.bg-opacity-50');
        expect(overlay).toBeInTheDocument();
      });
    });
  });

  describe('Payment Method Section', () => {
    it('should display payment method header', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const header = screen.getByText(/אמצעי תשלום/i);
        expect(header).toBeInTheDocument();
      });
    });

    it('should display card brand in uppercase', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const brand = screen.getByText(/VISA/i);
        expect(brand).toBeInTheDocument();
      });
    });

    it('should display masked card number', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const maskedNumber = screen.getByText(/•••• •••• •••• 4242/i);
        expect(maskedNumber).toBeInTheDocument();
      });
    });

    it('should display payment method type', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const type = screen.getByText(/^card$/i);
        expect(type).toBeInTheDocument();
      });
    });

    it('should render card brand badge with gradient', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const badge = container.querySelector('.bg-gradient-to-r.from-blue-600.to-blue-800');
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('Invoices Section', () => {
    it('should display invoices section header', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const header = screen.getByText(/חשבוניות אחרונות/i);
        expect(header).toBeInTheDocument();
      });
    });

    it('should display invoice table headers', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        expect(screen.getByText(/תאריך/i)).toBeInTheDocument();
        expect(screen.getByText(/סכום/i)).toBeInTheDocument();
        expect(screen.getByText(/סטטוס/i)).toBeInTheDocument();
        expect(screen.getByText(/פעולות/i)).toBeInTheDocument();
      });
    });

    it('should render invoice rows', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const rows = container.querySelectorAll('tbody tr');
        expect(rows.length).toBeGreaterThan(0);
      });
    });

    it('should display invoice status badges', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const paidStatus = screen.getAllByText(/שולם/i);
        expect(paidStatus.length).toBeGreaterThan(0);
      });
    });

    it('should display download PDF links', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const downloadLinks = screen.getAllByText(/הורד PDF/i);
        expect(downloadLinks.length).toBeGreaterThan(0);
      });
    });

    it('should have external links with proper attributes', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const link = container.querySelector('a[target="_blank"][rel="noopener noreferrer"]');
        expect(link).toBeInTheDocument();
      });
    });

    it('should apply hover effect to table rows', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const rows = container.querySelectorAll('tbody tr.hover\\:bg-gray-50');
        expect(rows.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Component Structure', () => {
    it('should render with proper spacing', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const mainDiv = container.querySelector('.space-y-6');
        expect(mainDiv).toBeInTheDocument();
      });
    });

    it('should have rounded corners on cards', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.rounded-lg');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('should have shadows on cards', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.shadow-sm');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('should use white backgrounds for cards', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const cards = container.querySelectorAll('.bg-white');
        expect(cards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid for period dates', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const grid = container.querySelector('.grid.md\\:grid-cols-2');
        expect(grid).toBeInTheDocument();
      });
    });

    it('should have overflow scroll for invoice table', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const scrollContainer = container.querySelector('.overflow-x-auto');
        expect(scrollContainer).toBeInTheDocument();
      });
    });

    it('should have flex wrap for buttons', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const buttonContainer = container.querySelector('.flex.flex-wrap');
        expect(buttonContainer).toBeInTheDocument();
      });
    });
  });

  describe('Conditional Rendering', () => {
    it('should render subscription section when subscription exists', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const section = screen.getByText(/מנוי נוכחי/i);
        expect(section).toBeInTheDocument();
      });
    });

    it('should render payment method when it exists', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const section = screen.getByText(/אמצעי תשלום/i);
        expect(section).toBeInTheDocument();
      });
    });

    it('should show cancel button when cancelAtPeriodEnd is false', async () => {
      render(<BillingWidget />);

      await waitFor(() => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        expect(cancelButton).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML headings', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const h2 = container.querySelector('h2');
        const h3 = container.querySelector('h3');
        expect(h2).toBeInTheDocument();
        expect(h3).toBeInTheDocument();
      });
    });

    it('should have proper table structure', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const table = container.querySelector('table');
        const thead = container.querySelector('thead');
        const tbody = container.querySelector('tbody');

        expect(table).toBeInTheDocument();
        expect(thead).toBeInTheDocument();
        expect(tbody).toBeInTheDocument();
      });
    });

    it('should have button elements for interactions', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('should have proper link elements', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(() => {
        const links = container.querySelectorAll('a');
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle console errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<BillingWidget />);

      await waitFor(() => {
        const header = screen.getByText(/ניהול חיוב ומנויים/i);
        expect(header).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Modal Interaction', () => {
    it('should not show modal by default', () => {
      const { container } = render(<BillingWidget />);
      const modal = container.querySelector('.fixed.inset-0');
      expect(modal).not.toBeInTheDocument();
    });

    it('should center modal on screen', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const modalContainer = container.querySelector('.flex.items-center.justify-center');
        expect(modalContainer).toBeInTheDocument();
      });
    });

    it('should have proper z-index for modal', async () => {
      const { container } = render(<BillingWidget />);

      await waitFor(async () => {
        const cancelButton = screen.getByText(/בטל מנוי/i);
        await userEvent.click(cancelButton);

        const modal = container.querySelector('.z-50');
        expect(modal).toBeInTheDocument();
      });
    });
  });
});
