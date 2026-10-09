import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CATEGORY_COLORS = {
  Food: "#7c3aed",
  Transport: "#38bdf8",
  Shopping: "#f59e0b",
  Bills: "#ef4444",
  Housing: "#10b981",
  Health: "#ec4899",
  Education: "#8b5cf6",
  Entertainment: "#fb7185",
  Travel: "#14b8a6",
  Savings: "#84cc16",
  Others: "#94a3b8",
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

function ExpenseReport({ expenses, deleteExpense, editExpense }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredExpenses = useMemo(() => {
    return safeExpenses.filter((expense) => {
      const isValidDate = typeof expense?.date === "string";
      const monthMatch = isValidDate && expense.date.startsWith(selectedMonth);
      const name = typeof expense?.name === "string" ? expense.name : "";
      const searchMatch = name.toLowerCase().includes(search.toLowerCase());
      const categoryMatch =
        categoryFilter === "All" || expense?.category === categoryFilter;

      return monthMatch && searchMatch && categoryMatch;
    });
  }, [safeExpenses, selectedMonth, search, categoryFilter]);

  const monthlyTotal = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const chartData = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        name: category,
        value: filteredExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
      })).filter((item) => item.value > 0),
    [filteredExpenses]
  );

  return (
    <section className="card expense-report-card">
      <div className="card-header-row">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>📊 Expense report</h2>
        </div>
      </div>

      <div className="filters-grid">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search expense..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="total-banner">
        Monthly total: ₹{monthlyTotal.toFixed(2)}
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">No expenses found for this selection.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Method</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense, index) => (
                <tr key={expense.id || `expense-${index}-${selectedMonth}`}>
                  <td>{expense.name || "Untitled"}</td>
                  <td>₹{Number(expense.amount || 0).toFixed(2)}</td>
                  <td>
                    <span
                      className="pill"
                      style={{
                        background:
                          CATEGORY_COLORS[expense.category] || "#ddd",
                      }}
                    >
                      {expense.category || "Other"}
                    </span>
                  </td>
                  <td>{expense.date || "—"}</td>
                  <td>{expense.payment_method || "Cash"}</td>
                  <td>{expense.notes || "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        onClick={() => {
                          const newName = window.prompt(
                            "Enter expense name:",
                            expense.name || ""
                          );
                          const newAmount = window.prompt(
                            "Enter amount:",
                            expense.amount || "0"
                          );

                          if (newName && newAmount) {
                            editExpense({
                              ...expense,
                              name: newName,
                              amount: Number(newAmount),
                            });
                          }
                        }}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="chart">
          <h2>📈 Category breakdown</h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={100}
                paddingAngle={4}
                label
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || "#cbd5e1"}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ExpenseReport;