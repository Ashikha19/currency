
import { useEffect, useState } from "react";

function BudgetTracker({ expenses }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Logged-in user
  const currentUser = JSON.parse(
    sessionStorage.getItem("currentUser")
  );

  const userId = currentUser?.id;

  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  // =========================
  // LOAD BUDGET FROM DATABASE
  // =========================

  useEffect(() => {
    if (!userId) return;

    const loadBudget = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/auth/budget/?user=${userId}&month=${currentMonth}`
        );

        if (response.ok) {
          const data = await response.json();
          setBudget(data.amount);
        }
      } catch (error) {
        console.error("Error loading budget:", error);
      }
    };

    loadBudget();
  }, [userId, currentMonth]);

  // =========================
  // SAVE BUDGET TO DATABASE
  // =========================

  const saveBudget = async () => {
    if (!userId) {
      setMessage("❌ Please login first.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setMessage("❌ Please enter a valid budget.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/budget/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userId,
            month: currentMonth,
            amount: budget,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBudget(data.amount);
        setMessage("✅ Budget saved successfully!");
      } else {
        setMessage(
          `❌ ${data.error || "Failed to save budget."}`
        );
      }
    } catch (error) {
      console.error("Error saving budget:", error);

      setMessage(
        "❌ Cannot connect to Django server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // MONTHLY EXPENSES
  // =========================

  const monthlyExpenses = safeExpenses.filter(
    (expense) =>
      typeof expense?.date === "string" &&
      expense.date.startsWith(currentMonth)
  );

  const totalExpense = monthlyExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  const budgetAmount = Number(budget || 0);

  const remaining = budgetAmount - totalExpense;

  const percentage =
    budgetAmount > 0
      ? (totalExpense / budgetAmount) * 100
      : 0;

  const progress = Math.min(percentage, 100);

  return (
    <section className="card">
      <h2>💰 Monthly Budget</h2>

      <input
        type="number"
        placeholder="Enter monthly budget"
        value={budget}
        onChange={(e) => {
          setBudget(e.target.value);
          setMessage("");
        }}
      />

      {/* SAVE BUTTON */}
      <button
        onClick={saveBudget}
        disabled={saving}
        style={{
          marginTop: "10px",
          padding: "10px 18px",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Saving..." : "💾 Save Budget"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p style={{ marginTop: "10px" }}>
          {message}
        </p>
      )}

      {budget && (
        <>
          {/* BUDGET INFORMATION */}
          <div className="budget-info">
            <p>
              Budget: ₹{budgetAmount.toFixed(2)}
            </p>

            <p>
              Spent: ₹{totalExpense.toFixed(2)}
            </p>

            <p>
              Remaining: ₹{remaining.toFixed(2)}
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="budget-progress-container">
            <div
              className="budget-progress"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          {/* PERCENTAGE */}
          <p className="budget-percentage">
            {percentage.toFixed(1)}% of budget used
          </p>

          {/* BUDGET ALERT */}
          {percentage >= 80 && percentage < 100 && (
            <div className="budget-alert">
              ⚠️ You have used{" "}
              {percentage.toFixed(0)}% of your monthly budget.
            </div>
          )}

          {/* BUDGET EXCEEDED */}
          {percentage >= 100 && (
            <div className="budget-alert danger">
              🚨 You have exceeded your monthly budget!
            </div>
          )}

          {/* NORMAL STATUS */}
          {percentage < 80 && (
            <p className="budget-success">
              ✅ You are within your budget.
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default BudgetTracker;
