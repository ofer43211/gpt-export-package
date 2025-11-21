// Mock data for testing

export interface WebhookEvent {
  id: string;
  type: string;
  created: number;
  data: any;
  status: 'success' | 'failed' | 'pending';
}

export interface WebhookStats {
  total: number;
  success: number;
  failed: number;
  pending: number;
}

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  planName: string;
  amount: number;
  currency: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

export interface BillingInfo {
  customerId: string;
  email: string;
  paymentMethod?: {
    type: string;
    last4: string;
    brand: string;
  };
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: number;
  dueDate: number;
  invoiceUrl: string;
}

// Mock Webhook Events
export const mockWebhookEvents: WebhookEvent[] = [
  {
    id: 'evt_1',
    type: 'payment_intent.succeeded',
    created: 1640000000000,
    data: { amount: 2999, currency: 'usd' },
    status: 'success'
  },
  {
    id: 'evt_2',
    type: 'invoice.payment_failed',
    created: 1639900000000,
    data: { amount: 1999, currency: 'usd' },
    status: 'failed'
  },
  {
    id: 'evt_3',
    type: 'customer.subscription.updated',
    created: 1639800000000,
    data: { plan: 'pro', status: 'active' },
    status: 'success'
  },
  {
    id: 'evt_4',
    type: 'customer.subscription.created',
    created: 1639700000000,
    data: { plan: 'starter', status: 'active' },
    status: 'pending'
  }
];

export const mockWebhookStats: WebhookStats = {
  total: 4,
  success: 2,
  failed: 1,
  pending: 1
};

// Mock Subscription
export const mockActiveSubscription: Subscription = {
  id: 'sub_1234567890',
  status: 'active',
  planName: 'Pro Plan',
  amount: 2999,
  currency: 'usd',
  currentPeriodStart: Date.now() - (15 * 24 * 60 * 60 * 1000),
  currentPeriodEnd: Date.now() + (15 * 24 * 60 * 60 * 1000),
  cancelAtPeriodEnd: false
};

export const mockCanceledSubscription: Subscription = {
  ...mockActiveSubscription,
  status: 'canceled',
  cancelAtPeriodEnd: true
};

export const mockPastDueSubscription: Subscription = {
  ...mockActiveSubscription,
  status: 'past_due',
  cancelAtPeriodEnd: false
};

// Mock Billing Info
export const mockBillingInfo: BillingInfo = {
  customerId: 'cus_1234567890',
  email: 'user@example.com',
  paymentMethod: {
    type: 'card',
    last4: '4242',
    brand: 'visa'
  }
};

export const mockBillingInfoNoPayment: BillingInfo = {
  customerId: 'cus_0987654321',
  email: 'newuser@example.com'
};

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    amount: 2999,
    currency: 'usd',
    status: 'paid',
    created: Date.now() - (30 * 24 * 60 * 60 * 1000),
    dueDate: Date.now() - (25 * 24 * 60 * 60 * 1000),
    invoiceUrl: 'https://invoice.example.com/inv_001'
  },
  {
    id: 'inv_002',
    amount: 2999,
    currency: 'usd',
    status: 'paid',
    created: Date.now() - (60 * 24 * 60 * 60 * 1000),
    dueDate: Date.now() - (55 * 24 * 60 * 60 * 1000),
    invoiceUrl: 'https://invoice.example.com/inv_002'
  },
  {
    id: 'inv_003',
    amount: 1999,
    currency: 'eur',
    status: 'open',
    created: Date.now() - (5 * 24 * 60 * 60 * 1000),
    dueDate: Date.now() + (5 * 24 * 60 * 60 * 1000),
    invoiceUrl: 'https://invoice.example.com/inv_003'
  }
];

// Helper to get empty data
export const getEmptyWebhookData = () => ({
  events: [],
  stats: {
    total: 0,
    success: 0,
    failed: 0,
    pending: 0
  }
});

export const getEmptyBillingData = () => ({
  subscription: null,
  billingInfo: null,
  invoices: []
});
