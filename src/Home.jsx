function Home({ currentUser, onGetStarted, onLogout }) {
  const categories = [
    { name: "Food & Dining", icon: "₹", type: "misc" },
    { name: "Travel", icon: "€", type: "pasta" },
    { name: "Bills", icon: "₿", type: "pork" },
    { name: "Savings", icon: "¥", type: "seafood" },
    { name: "Shopping", icon: "$", type: "side" },
    { name: "Health", icon: "₹", type: "starter" },
    { name: "Investment", icon: "€", type: "vegan" },
    { name: "Utilities", icon: "¥", type: "veg" },
  ];

  const displayName = currentUser?.username || currentUser?.email?.split("@")[0] || "User";

  return (
    <div className="recipe-home">
      <header className="recipe-topbar">
        <div className="brand-wrap">
          <div className="brand-badge">💰</div>
          <div className="brand-name">CurrencyFlow</div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <button type="button" className="nav-pill active">
            <span>📊</span> Dashboard
          </button>
          <button type="button" className="nav-pill">
            <span>💳</span> Wallets
          </button>
          <button type="button" className="nav-pill">
            <span>📈</span> Insights
          </button>
        </nav>

        <div className="top-actions">
          <button type="button" className="mini-btn">
            <span>👤</span> {displayName}
          </button>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="recipe-hero">
        <div className="hero-visual-grid" aria-hidden="true">
          <div className="visual-panel panel-a"></div>
          <div className="visual-panel panel-b"></div>
          <div className="visual-panel panel-c"></div>
        </div>

        <div className="hero-content">
          <p className="kicker">SMART MONEY TRACKING</p>
          <h1>
            Budget smarter, <span>grow faster</span>
          </h1>

          <p className="hero-subtext">
            Track expenses, manage budgets, and discover spending patterns with a premium finance dashboard built for everyday clarity.
          </p>

          <div className="search-row">
            <div className="search-input-wrap">
              <span className="search-icon">⌕</span>
              <input type="text" placeholder="Search expenses, budgets or categories" />
            </div>
            <button type="button" className="search-btn" onClick={onGetStarted}>
              Search
            </button>
          </div>
        </div>
      </main>

      <section className="explore-section">
        <div className="section-header">
          <div>
            <span className="section-label">SPENDING</span>
            <h2>Expense Categories</h2>
          </div>

          <button type="button" className="random-btn">
            ✦ Quick Overview
          </button>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button key={category.name} type="button" className="category-card">
              <div className={`category-image ${category.type}`}>
                <span className="coin-mark">{category.icon}</span>
              </div>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

