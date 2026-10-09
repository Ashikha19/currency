
import { useEffect, useState } from "react";

function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  const API_BASE = "https://api.frankfurter.dev/v2";

  // =========================
  // LOAD CURRENCIES
  // =========================

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setCurrencyLoading(true);

        const response = await fetch(
          `${API_BASE}/currencies`
        );

        if (!response.ok) {
          throw new Error("Currency API failed");
        }

        const data = await response.json();

        console.log("Currency API:", data);

        let list = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (
          data &&
          typeof data === "object"
        ) {
          list = Object.values(data);
        }

        const cleanedList = list
          .filter(
            (currency) =>
              currency &&
              typeof currency === "object" &&
              currency.iso_code
          )
          .sort((a, b) =>
            a.iso_code.localeCompare(b.iso_code)
          );

        setCurrencies(cleanedList);
      } catch (error) {
        console.error(
          "Currency loading error:",
          error
        );

        setCurrencies([]);
      } finally {
        setCurrencyLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  // =========================
  // CONVERT CURRENCY
  // =========================

  const convertCurrency = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setResult(Number(amount).toFixed(2));
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const url =
        `${API_BASE}/rates` +
        `?base=${fromCurrency}` +
        `&quotes=${toCurrency}`;

      console.log("Conversion URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Exchange API error: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Exchange API response:", data);

      /*
        Frankfurter response:

        [
          {
            date: "2026-...",
            base: "USD",
            quote: "INR",
            rate: 88.XX
          }
        ]
      */

      if (
        !Array.isArray(data) ||
        data.length === 0 ||
        data[0]?.rate === undefined
      ) {
        throw new Error(
          "Exchange rate not available"
        );
      }

      const rate = Number(data[0].rate);

      const convertedAmount =
        Number(amount) * rate;

      setResult(
        convertedAmount.toFixed(2)
      );
    } catch (error) {
      console.error(
        "Conversion error:",
        error
      );

      alert(
        "Currency conversion failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <section className="card currency-converter">

      <h2>💱 Currency Converter</h2>

      {/* AMOUNT */}

      <input
        type="number"
        min="0"
        step="any"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setResult("");
        }}
      />

      {/* CURRENCY ROW */}

      <div className="currency-row">

        {/* FROM */}

        <select
          value={fromCurrency}
          onChange={(e) => {
            setFromCurrency(e.target.value);
            setResult("");
          }}
          disabled={
            currencyLoading ||
            currencies.length === 0
          }
        >
          {currencyLoading ? (
            <option value="">
              Loading currencies...
            </option>
          ) : currencies.length === 0 ? (
            <option value="">
              No currencies available
            </option>
          ) : (
            currencies.map((currency) => (
              <option
                key={currency.iso_code}
                value={currency.iso_code}
              >
                {currency.iso_code} -{" "}
                {currency.name}
              </option>
            ))
          )}
        </select>

        <span className="currency-arrow">
          ➡️
        </span>

        {/* TO */}

        <select
          value={toCurrency}
          onChange={(e) => {
            setToCurrency(e.target.value);
            setResult("");
          }}
          disabled={
            currencyLoading ||
            currencies.length === 0
          }
        >
          {currencyLoading ? (
            <option value="">
              Loading currencies...
            </option>
          ) : currencies.length === 0 ? (
            <option value="">
              No currencies available
            </option>
          ) : (
            currencies.map((currency) => (
              <option
                key={currency.iso_code}
                value={currency.iso_code}
              >
                {currency.iso_code} -{" "}
                {currency.name}
              </option>
            ))
          )}
        </select>

      </div>

      {/* BUTTON */}

      <button
        onClick={convertCurrency}
        disabled={
          loading ||
          currencyLoading ||
          currencies.length === 0
        }
      >
        {loading
          ? "Converting..."
          : "💱 Convert"}
      </button>

      {/* RESULT */}

      {result !== "" && (
        <div className="conversion-result">
          <h3>
            {amount} {fromCurrency} ={" "}
            {result} {toCurrency}
          </h3>
        </div>
      )}

    </section>
  );
}

export default CurrencyConverter;
