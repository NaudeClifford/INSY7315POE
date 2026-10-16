import { Expense } from "@/types/expense";
import { db, isFirebaseConfigured, cleanForFirestore } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

// Fetch all studio expenses directly from Cloud Firestore
export async function getExpenses(): Promise<Expense[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, "expenses"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
    } catch (err) {
      console.error("Firestore getExpenses error:", err);
      return [];
    }
  }
  return [];
}

// Add a new studio expense directly to Cloud Firestore
export async function addExpense(expenseData: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
  const id = `exp_${Date.now()}`;
  const newExp: Expense = {
    ...expenseData,
    id,
    createdAt: new Date().toISOString().split("T")[0]
  };

  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Cannot save expense.");
  }

  await setDoc(doc(db, "expenses", id), cleanForFirestore(newExp));
  return newExp;
}

// Delete an expense record directly from Cloud Firestore
export async function deleteExpense(id: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error("Firestore is not configured. Cannot delete expense.");
  }

  await deleteDoc(doc(db, "expenses", id));
  return true;
}
