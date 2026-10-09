function Dashboard({ expenses }) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const toAmount = (expense) => Number(expense?.amount || 0);

  const totalExpense = safeExpenses.reduce(
    (total, expense) => total + toAmount(expense),
    0
  );

  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const monthlyExpenses = safeExpenses.filter(
    (expense) => typeof expense?.date === "string" && expense.date.startsWith(currentMonth)
  );

  const monthlyTotal = monthlyExpenses.reduce(
    (total, expense) => total + toAmount(expense),
    0
  );

  return (
    <section className="dashboard">
      <div className="dashboard-card">
        <div className="dashboard-icon">💰</div>
        <h3>Total Expenses</h3>
        <h2>₹{totalExpense.toFixed(2)}</h2>
        <p>All transactions</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">📅</div>
        <h3>This Month</h3>
        <h2>₹{monthlyTotal.toFixed(2)}</h2>
        <p>Current month spending</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">🧾</div>
        <h3>Total Transactions</h3>
        <h2>{safeExpenses.length}</h2>
        <p>All expenses</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-icon">📊</div>
        <h3>Monthly Transactions</h3>
        <h2>{monthlyExpenses.length}</h2>
        <p>This month's expenses</p>
      </div>
    </section>
  );
}

export default Dashboard;