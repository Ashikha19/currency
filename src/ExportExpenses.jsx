function ExportExpenses({ expenses }) {

  const exportCSV = () => {
    if (expenses.length === 0) {
      alert("No expenses to export");
      return;
    }

    const headers = [
      "Expense Name",
      "Amount",
      "Category",
      "Date",
    ];

    const rows = expenses.map((expense) => [
      expense.name,
      expense.amount,
      expense.category,
      expense.date,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "expenses.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="card">
      <h2>📥 Export Expenses</h2>

      <button onClick={exportCSV}>
        Download CSV
      </button>
    </section>
  );
}

export default ExportExpenses;