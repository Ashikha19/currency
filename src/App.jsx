
import React, { useEffect, useState } from "react";
import "./App.css";

import CurrencyConverter from "./Currencyconverter";
import ExpenseTracker from "./ExpenseTracker";
import ExpenseReport from "./ExpenseReport";
import Dashboard from "./Dashboard";
import BudgetTracker from "./BudgetTracker";
import ExportExpenses from "./ExportExpenses";
import ExpenseSummary from "./ExpenseSummary";
import Login from "./Login";
import Signup from "./Signup";
import MonthlyChart from "./MonthlyChart";
import Home from "./Home";
import MonthlyComparison from "./MonthlyComparison";
const API_BASE = "http://127.0.0.1:8000/api/auth";

/* =========================
   ERROR BOUNDARY
========================= */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unknown error",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="login-container">
          <div className="login-card">
            <div className="brand-mark">⚠️</div>

            <h2>Something went wrong</h2>

            <p className="subtitle">
              The app hit an unexpected error.
            </p>

            <p
              style={{
                fontSize: "13px",
                marginTop: "10px",
                color: "#ffb4b4",
                wordBreak: "break-word",
              }}
            >
              {this.state.message}
            </p>

            <button onClick={() => window.location.reload()}>
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================
   GET SAVED USER
========================= */

function parseStoredUser() {
  const raw = sessionStorage.getItem("currentUser");

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (parsed && typeof parsed === "object") {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error("Stored user error:", error);

    sessionStorage.removeItem("currentUser");

    return null;
  }
}

/* =========================
   MAIN APP
========================= */

function App() {
  const savedUser = parseStoredUser();

  const [currentUser, setCurrentUser] = useState(savedUser);

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(savedUser)
  );

  const [showSignup, setShowSignup] = useState(false);

  const [showHome, setShowHome] = useState(
    Boolean(savedUser)
  );

  const [expenses, setExpenses] = useState([]);

  const [loadingExpenses, setLoadingExpenses] = useState(false);

  /* =========================
     LOAD EXPENSES
  ========================= */

  const loadExpenses = async () => {
    if (!currentUser?.id) {
      setExpenses([]);
      return;
    }

    try {
      setLoadingExpenses(true);

      const response = await fetch(
        `${API_BASE}/expenses/?user=${currentUser.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to load expenses:", data);

        setExpenses([]);

        return;
      }

      if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Load expenses error:", error);

      setExpenses([]);
    } finally {
      setLoadingExpenses(false);
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = (user) => {
    const fullUser = {
      ...user,

      id: user?.id,

      email: user?.email?.toLowerCase(),

      username:
        user?.username ||
        user?.email?.split("@")[0] ||
        "User",
    };

    sessionStorage.setItem(
      "currentUser",
      JSON.stringify(fullUser)
    );

    setCurrentUser(fullUser);

    setIsLoggedIn(true);

    setShowHome(true);
  };

  /* =========================
     LOAD USER EXPENSES
  ========================= */

  useEffect(() => {
    if (isLoggedIn && currentUser?.id) {
      loadExpenses();
    }
  }, [isLoggedIn, currentUser?.id]);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");

    setCurrentUser(null);

    setIsLoggedIn(false);

    setShowHome(false);

    setExpenses([]);
  };

  /* =========================
     ADD EXPENSE
  ========================= */

  const addExpense = (expense) => {
    if (!expense) {
      return;
    }

    setExpenses((previousExpenses) => [
      expense,
      ...previousExpenses,
    ]);
  };

  /* =========================
     DELETE EXPENSE
  ========================= */

  const deleteExpense = async (id) => {
    if (!id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/expenses/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Failed to delete expense");
        return;
      }

      setExpenses((previousExpenses) =>
        previousExpenses.filter(
          (expense) => expense.id !== id
        )
      );

      alert("Expense deleted successfully! 🗑️");
    } catch (error) {
      console.error("Delete error:", error);

      alert("Cannot connect to Django server");
    }
  };

  /* =========================
     EDIT EXPENSE
  ========================= */

  const editExpense = async (updatedExpense) => {
    if (!updatedExpense?.id) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/expenses/${updatedExpense.id}/`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedExpense),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Edit error:", data);

        alert("Failed to update expense");

        return;
      }

      setExpenses((previousExpenses) =>
        previousExpenses.map((expense) =>
          expense.id === data.id
            ? data
            : expense
        )
      );

      alert("Expense updated successfully! ✏️");
    } catch (error) {
      console.error("Edit error:", error);

      alert("Cannot connect to Django server");
    }
  };

  /* =========================
     LOGIN / SIGNUP PAGE
  ========================= */

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <Signup
          onSignup={() => setShowSignup(false)}
          onBack={() => setShowSignup(false)}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

  /* =========================
     HOME PAGE
  ========================= */

  if (showHome) {
    return (
      <Home
        currentUser={currentUser}
        onGetStarted={() => {
          console.log("Get Started clicked");

          setShowHome(false);
        }}
        onLogout={handleLogout}
      />
    );
  }

  /* =========================
     MAIN EXPENSE TRACKER
  ========================= */

  return (
    <div className="app-shell">

      {/* TOP BAR */}

      <header className="topbar">

        <div>
          <p className="eyebrow">
            Smart finance
          </p>

          <h1>
            💸 MoneyFlow
          </h1>
        </div>

        <div className="topbar-actions">

          <span className="welcome-pill">
            👋{" "}
            {currentUser?.username ||
              currentUser?.email ||
              "User"}
          </span>

          <button
            className="ghost-btn"
            onClick={() => setShowHome(true)}
          >
            Home
          </button>

          <button
            className="ghost-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}

      <main className="app-content">

        {/* OVERVIEW */}

        <section className="overview-panel">

          <div className="section-heading">

            <div>
              <p className="eyebrow">
                Overview
              </p>

              <h2>
                Expense dashboard
              </h2>
            </div>

          </div>

          {/* DASHBOARD */}

          <Dashboard
            expenses={Array.isArray(expenses) ? expenses : []}
          />

          {/* SUMMARY */}

          <ExpenseSummary
            expenses={Array.isArray(expenses) ? expenses : []}
          />
<MonthlyComparison
  expenses={Array.isArray(expenses) ? expenses : []}
/>
          {/* BUDGET */}

          <BudgetTracker
            expenses={Array.isArray(expenses) ? expenses : []}
          />

        </section>

        {/* CONTENT GRID */}

        <div className="content-grid">

          {/* LEFT */}

          <div className="left-stack">

            <CurrencyConverter />

            <ExpenseTracker
              addExpense={addExpense}
              currentUser={currentUser}
            />

          </div>

          {/* RIGHT */}

          <div className="right-stack">

            <ExpenseReport
              expenses={
                Array.isArray(expenses)
                  ? expenses
                  : []
              }
              deleteExpense={deleteExpense}
              editExpense={editExpense}
            />

            <MonthlyChart
              expenses={
                Array.isArray(expenses)
                  ? expenses
                  : []
              }
            />

            <ExportExpenses
              expenses={
                Array.isArray(expenses)
                  ? expenses
                  : []
              }
            />

          </div>

        </div>

        {/* LOADING */}

        {loadingExpenses && (
          <div className="loading-bar">
            Loading expenses...
          </div>
        )}

      </main>

    </div>
  );
}

/* =========================
   APP WRAPPER
========================= */

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

