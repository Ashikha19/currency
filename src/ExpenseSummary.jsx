import React from "react";

function ExpenseSummary({ expenses = [] }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const today = new Date();

  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`;

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  /* =========================
     TOTAL EXPENSE
  ========================= */

  const totalExpenses = safeExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  /* =========================
     TODAY'S EXPENSE
  ========================= */

  const todayExpenses = safeExpenses
    .filter((expense) => expense.date === todayString)
    .reduce(
      (total, expense) =>
        total + Number(expense.amount || 0),
      0
    );

  /* =========================
     CURRENT MONTH EXPENSE
  ========================= */

  const monthlyExpenses = safeExpenses.filter(
    (expense) =>
      typeof expense.date === "string" &&
      expense.date.startsWith(currentMonth)
  );

  const currentMonthTotal = monthlyExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  /* =========================
     CATEGORY ANALYSIS
  ========================= */

  const categoryTotals = {};

  monthlyExpenses.forEach((expense) => {
    const category = expense.category || "Others";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(expense.amount || 0);
  });

  const categoryList = Object.entries(categoryTotals);

  const highestCategory =
    categoryList.length > 0
      ? categoryList.reduce((highest, current) =>
          current[1] > highest[1] ? current : highest
        )
      : null;

  /* =========================
     CATEGORY PERCENTAGE
  ========================= */

  const highestCategoryPercentage =
    highestCategory && currentMonthTotal > 0
      ? (highestCategory[1] / currentMonthTotal) * 100
      : 0;

  return (
    <section className="summary-section">

      {/* TITLE */}

      <div className="section-heading">
        <div>
          <p className="eyebrow">
            Spending overview
          </p>

          <h2>
            Expense Summary
          </h2>
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="summary-grid">

        <div className="summary-card">
          <span>
            💰 Total Expenses
          </span>

          <h3>
            ₹{totalExpenses.toFixed(2)}
          </h3>
        </div>

        <div className="summary-card">
          <span>
            📅 Today's Expenses
          </span>

          <h3>
            ₹{todayExpenses.toFixed(2)}
          </h3>
        </div>

        <div className="summary-card">
          <span>
            📊 This Month
          </span>

          <h3>
            ₹{currentMonthTotal.toFixed(2)}
          </h3>
        </div>

      </div>

      {/* SMART SUGGESTION */}

      {highestCategory && (
        <div className="spending-suggestion">

          💡 <strong>Suggestion:</strong>{" "}

          Your{" "}
          {highestCategory[0].toLowerCase()}{" "}
          expenses are higher this month.

          {" "}Try to reduce unnecessary spending.

          <span className="suggestion-percentage">
            {" "}
            ({highestCategoryPercentage.toFixed(1)}% of
            your monthly spending)
          </span>

        </div>
      )}

    </section>
  );
}

export default ExpenseSummary;