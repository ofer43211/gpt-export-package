import { useState, useEffect } from 'react';

interface WebhookEvent {
  id: string;
  type: string;
  created: number;
  data: any;
  status: 'success' | 'failed' | 'pending';
}

interface WebhookStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}

export default function WebhookDashboard() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [stats, setStats] = useState<WebhookStats>({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading webhook events
    const loadWebhookData = async () => {
      try {
        // In real implementation, this would fetch from your API
        const mockEvents: WebhookEvent[] = [
          {
            id: 'evt_1',
            type: 'payment_intent.succeeded',
            created: Date.now() - 3600000,
            data: { amount: 2999, currency: 'usd' },
            status: 'success'
          },
          {
            id: 'evt_2',
            type: 'invoice.payment_failed',
            created: Date.now() - 7200000,
            data: { amount: 1999, currency: 'usd' },
            status: 'failed'
          },
          {
            id: 'evt_3',
            type: 'customer.subscription.updated',
            created: Date.now() - 10800000,
            data: { plan: 'pro', status: 'active' },
            status: 'success'
          }
        ];

        setEvents(mockEvents);
        
        const mockStats = {
          total: mockEvents.length,
          success: mockEvents.filter(e => e.status === 'success').length,
          failed: mockEvents.filter(e => e.status === 'failed').length,
          pending: mockEvents.filter(e => e.status === 'pending').length
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load webhook data:', error);
        setLoading(false);
      }
    };

    loadWebhookData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">טוען נתונים...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ��� דשבורד Webhook
        </h2>
        <p className="text-gray-600">
          מעקב אחר אירועי webhook ומצב העיבוד שלהם
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">סה"כ אירועים</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">הצלחות</p>
              <p className="text-2xl font-semibold text-green-600">{stats.success}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">כשלונות</p>
              <p className="text-2xl font-semibold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">ממתינים</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">אירועים אחרונים</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סוג אירוע
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  זמן
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  נתונים
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(event.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status === 'success' ? 'הצליח' : 
                       event.status === 'failed' ? 'נכשל' : 'ממתין'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {JSON.stringify(event.data, null, 2).substring(0, 50)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ��� רענן נתונים
        </button>
      </div>
    </div>
  );
}
cat > src/components/BillingWidget.tsx << 'EOF'
import { useState, useEffect } from 'react';

interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  planName: string;
  amount: number;
  currency: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

interface BillingInfo {
  customerId: string;
  email: string;
  paymentMethod?: {
    type: string;
    last4: string;
    brand: string;
  };
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: number;
  dueDate: number;
  invoiceUrl: string;
}

export default function BillingWidget() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const loadBillingData = async () => {
      try {
        // Mock data - in real implementation, fetch from your API
        const mockSubscription: Subscription = {
          id: 'sub_1234567890',
          status: 'active',
          planName: 'Pro Plan',
          amount: 2999,
          currency: 'usd',
          currentPeriodStart: Date.now() - (15 * 24 * 60 * 60 * 1000),
          currentPeriodEnd: Date.now() + (15 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        };

        const mockBillingInfo: BillingInfo = {
          customerId: 'cus_1234567890',
          email: 'user@example.com',
          paymentMethod: {
            type: 'card',
            last4: '4242',
            brand: 'visa'
          }
        };

        const mockInvoices: Invoice[] = [
          {
            id: 'inv_001',
            amount: 2999,
            currency: 'usd',
            status: 'paid',
            created: Date.now() - (30 * 24 * 60 * 60 * 1000),
            dueDate: Date.now() - (25 * 24 * 60 * 60 * 1000),
            invoiceUrl: '#'
          },
          {
            id: 'inv_002',
            amount: 2999,
            currency: 'usd',
            status: 'paid',
            created: Date.now() - (60 * 24 * 60 * 60 * 1000),
            dueDate: Date.now() - (55 * 24 * 60 * 60 * 1000),
            invoiceUrl: '#'
          }
        ];

        setSubscription(mockSubscription);
        setBillingInfo(mockBillingInfo);
        setInvoices(mockInvoices);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load billing data:', error);
        setLoading(false);
      }
    };

    loadBillingData();
  }, []);

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

  const handleCancelSubscription = async () => {
    try {
      // In real implementation, call your API to cancel subscription
      console.log('Canceling subscription...');
      setShowCancelModal(false);
      // Update UI or redirect
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const handleUpdatePaymentMethod = () => {
    // In real implementation, redirect to Stripe customer portal
    window.open('https://billing.stripe.com/p/login/test_123', '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">טוען נתוני חיוב...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ��� ניהול חיוב ומנויים
        </h2>
        <p className="text-gray-600">
          נהל את המנוי שלך, תשלומים ופרטי חיוב
        </p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">מנוי נוכחי</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{subscription.planName}</h4>
              <p className="text-gray-600">
                {formatAmount(subscription.amount, subscription.currency)} / חודש
              </p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
              {getStatusText(subscription.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">תחילת תקופה</p>
              <p className="font-medium">{formatDate(subscription.currentPeriodStart)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">סוף תקופה</p>
              <p className="font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">
                ⚠️ המנוי יבוטל בסוף התקופה הנוכחית
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleUpdatePaymentMethod}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ��� עדכן אמצעי תשלום
            </button>
            
            {!subscription.cancelAtPeriodEnd && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                ❌ בטל מנוי
              </button>
            )}
          </div>
        </div>
      )}

      {/* Payment Method */}
      {billingInfo?.paymentMethod && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">אמצעי תשלום</h3>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {billingInfo.paymentMethod.brand.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• {billingInfo.paymentMethod.last4}</p>
              <p className="text-sm text-gray-600">{billingInfo.paymentMethod.type}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">חשבוניות אחרונות</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סכום
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(invoice.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatAmount(invoice.amount, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={invoice.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      ��� הורד PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">בטל מנוי</h3>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך לבטל את המנוי? תוכל להמשיך להשתמש בשירות עד סוף התקופה הנוכחית.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                ביטול
              </button>
              <button
                onClick={handleCancelSubscription}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                כן, בטל מנוי
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}# מעבר לתיקיית הפרויקט
cd ~/Documents/ai-saas-platform

# יצירת תיקיית components
mkdir -p src/components

# יצירת WebhookDashboard.tsx
cat > src/components/WebhookDashboard.tsx << 'EOF'
import { useState, useEffect } from 'react';

interface WebhookEvent {
  id: string;
  type: string;
  created: number;
  data: any;
  status: 'success' | 'failed' | 'pending';
}

interface WebhookStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}

export default function WebhookDashboard() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [stats, setStats] = useState<WebhookStats>({
    total: 0,
    success: 0,
    failed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWebhookData = async () => {
      try {
        const mockEvents: WebhookEvent[] = [
          {
            id: 'evt_1',
            type: 'payment_intent.succeeded',
            created: Date.now() - 3600000,
            data: { amount: 2999, currency: 'usd' },
            status: 'success'
          },
          {
            id: 'evt_2',
            type: 'invoice.payment_failed',
            created: Date.now() - 7200000,
            data: { amount: 1999, currency: 'usd' },
            status: 'failed'
          },
          {
            id: 'evt_3',
            type: 'customer.subscription.updated',
            created: Date.now() - 10800000,
            data: { plan: 'pro', status: 'active' },
            status: 'success'
          }
        ];

        setEvents(mockEvents);
        
        const mockStats = {
          total: mockEvents.length,
          success: mockEvents.filter(e => e.status === 'success').length,
          failed: mockEvents.filter(e => e.status === 'failed').length,
          pending: mockEvents.filter(e => e.status === 'pending').length
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load webhook data:', error);
        setLoading(false);
      }
    };

    loadWebhookData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">טוען נתונים...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ��� דשבורד Webhook
        </h2>
        <p className="text-gray-600">
          מעקב אחר אירועי webhook ומצב העיבוד שלהם
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">סה"כ אירועים</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">הצלחות</p>
              <p className="text-2xl font-semibold text-green-600">{stats.success}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">כשלונות</p>
              <p className="text-2xl font-semibold text-red-600">{stats.failed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">ממתינים</p>
              <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">אירועים אחרונים</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סוג אירוע
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  זמן
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  נתונים
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(event.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status === 'success' ? 'הצליח' : 
                       event.status === 'failed' ? 'נכשל' : 'ממתין'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {JSON.stringify(event.data, null, 2).substring(0, 50)}...
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ��� רענן נתונים
        </button>
      </div>
    </div>
  );
}
