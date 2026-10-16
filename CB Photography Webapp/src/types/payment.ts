// Type definitions for client billing invoices and payment transactions
export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  clientName: string;
  clientEmail: string;
  amountZAR: number;
  depositPaidZAR: number;
  balanceDueZAR: number;
  dueDate: string;
  issuedDate: string;
  status: "Paid" | "Deposit Paid" | "Overdue" | "Draft";
}

// Payment gateway transaction log entry
export interface PaymentTransaction {
  id: string;
  bookingId: string;
  amountZAR: number;
  provider: "Yoco" | "EFT" | "Cash";
  status: "Completed" | "Pending" | "Failed";
  reference: string;
  timestamp: string;
}

