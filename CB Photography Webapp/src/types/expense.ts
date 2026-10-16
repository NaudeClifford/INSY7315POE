export type ExpenseCategory =
  | "Gear & Maintenance"
  | "Studio Rent"
  | "Travel & Fuel"
  | "Cloud & Software"
  | "Marketing & Ads"
  | "Miscellaneous";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amountZAR: number;
  date: string;
  description?: string;
  loggedBy?: string;
  createdAt?: string;
}
