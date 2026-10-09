import { useState } from "react";

const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Housing",
  "Health",
  "Education",
  "Entertainment",
  "Travel",
  "Savings",
  "Others",
];

const PAYMENT_OPTIONS = [
  "Cash",
  "Card",
  "Bank Transfer",
  "UPI",
  "Wallet",
  "Other",
];
const FREQUENCY_OPTIONS = ["One-time", "Daily", "Weekly", "Monthly", "Yearly"];

function ExpenseTracker({ addExpense, currentUser }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("One-time");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!currentUser?.id) {
      alert("Your session expired. Please log in again before adding expenses.");
      return;
    }

    if (!name || !amount || !date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        amount: Number(amount),
        category,
        date,
        notes: notes.trim(),
        payment_method: paymentMethod,
        is_recurring: isRecurring,
        frequency: isRecurring ? frequency : "One-time",
        user: Number(currentUser.id),
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/expenses/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.detail ||
            data.user?.[0] ||
            data.error ||
            "Failed to add expense"
        );
        return;
      }

      addExpense(data);

      setName("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().slice(0, 10));
      setNotes("");
      setPaymentMethod("Card");
      setIsRecurring(false);
      setFrequency("One-time");

      alert("Expense added successfully! ✅");
    } catch (error) {
      console.error("Add expense error:", error);
      alert("Cannot connect to Django server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card expense-form-card">
      <div className="card-header-row">
        <div>
          <p className="eyebrow">Quick add</p>
          <h2>➕ Add expense</h2>
        </div>
        <span className="status-badge">Live</span>
      </div>

      <div className="expense-form-grid">
        <input
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          {PAYMENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label className="toggle-box">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          Recurring expense
        </label>

        {isRecurring && (
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        <textarea
          className="notes-area"
          rows="3"
          placeholder="Add notes or reason for this expense"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </section>
  );
}

export default ExpenseTracker;