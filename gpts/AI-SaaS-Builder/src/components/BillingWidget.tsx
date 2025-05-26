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
      console.log('Canceling subscription...');
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const handleUpdatePaymentMethod = () => {
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ��� ניהול חיוב ומנויים
        </h2>
        <p className="text-gray-600">
          נהל את המנוי שלך, תשלומים ופרטי חיוב
        </p>
      </div>

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
}
