
import { useMemo } from "react";

function MonthlyComparison({ expenses }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const { currentMonth, previousMonth, currentTotal, previousTotal } =
    useMemo(() => {
      const today = new Date();

      const currentYear = today.getFullYear();
      const currentMonthNumber = today.getMonth();

      // Current month: YYYY-MM
      const currentMonth = `${currentYear}-${String(
        currentMonthNumber + 1
      ).padStart(2, "0")}`;

      // Previous month
      const previousDate = new Date(
        currentYear,
        currentMonthNumber - 1,
        1
      );

      const previousMonth = `${previousDate.getFullYear()}-${String(
        previousDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // Current month total
      const currentTotal = safeExpenses
        .filter(
          (expense) =>
            typeof expense?.date === "string" &&
            expense.date.startsWith(currentMonth)
        )
        .reduce(
          (total, expense) =>
            total + Number(expense.amount || 0),
          0
        );

      // Previous month total
      const previousTotal = safeExpenses
        .filter(
          (expense) =>
            typeof expense?.date === "string" &&
            expense.date.startsWith(previousMonth)
        )
        .reduce(
          (total, expense) =>
            total + Number(expense.amount || 0),
          0
        );

      return {
        currentMonth,
        previousMonth,
        currentTotal,
        previousTotal,
      };
    }, [safeExpenses]);

  const difference = currentTotal - previousTotal;

  const percentageChange =
    previousTotal > 0
      ? Math.abs((difference / previousTotal) * 100)
      : 0;

  const getMonthName = (month) => {
    const date = new Date(`${month}-01`);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  };

  return (
    <section className="card monthly-comparison">
      <h2>📈 Monthly Comparison</h2>

      <div className="comparison-box">
        <div>
          <h3>{getMonthName(previousMonth)}</h3>
          <p>₹{previousTotal.toFixed(2)}</p>
        </div>

        <div>
          <h3>{getMonthName(currentMonth)}</h3>
          <p>₹{currentTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="comparison-result">
        {previousTotal === 0 ? (
          <p>
            📊 No previous month data available.
          </p>
        ) : difference > 0 ? (
          <p className="comparison-increase">
            🔴 Spending increased by ₹
            {Math.abs(difference).toFixed(2)}
            {" "}({percentageChange.toFixed(1)}%)
          </p>
        ) : difference < 0 ? (
          <p className="comparison-decrease">
            🟢 Spending decreased by ₹
            {Math.abs(difference).toFixed(2)}
            {" "}({percentageChange.toFixed(1)}%)
          </p>
        ) : (
          <p>
            ⚖️ Spending is the same as last month.
          </p>
        )}
      </div>
    </section>
  );
}

export default MonthlyComparison;

