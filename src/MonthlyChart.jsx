
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function MonthlyChart({ expenses = [] }) {
  const months = {};

  if (Array.isArray(expenses)) {
    expenses.forEach((expense) => {
      if (!expense?.date) return;

      const month = expense.date.slice(0, 7);

      if (!months[month]) {
        months[month] = 0;
      }

      months[month] += Number(expense.amount || 0);
    });
  }

  const chartData = Object.entries(months)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, amount]) => ({
      month,
      amount,
    }));

  return (
    <section className="card">
      <h2>📈 Monthly Expense Trend</h2>

      {chartData.length === 0 ? (
        <p>No expense data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toFixed(2)}`,
                "Expense",
              ]}
            />

            <Bar dataKey="amount" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default MonthlyChart;

