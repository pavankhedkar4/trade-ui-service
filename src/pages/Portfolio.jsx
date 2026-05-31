import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHoldings } from "../services/authService";
import "./Portfolio.css";

function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      setError("");
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Auth token not found. Please login again.");
        setLoading(false);
        return;
      }
      const data = await getHoldings(authToken);
      setHoldings(data);
    } catch (err) {
      setError(err.message || "Failed to fetch holdings");
      console.error("Error fetching holdings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="portfolio-loading">Loading your portfolio...</div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div>
          <h1>Your Portfolio</h1>
          <p>View all your holdings and securities</p>
        </div>
        <Link to="/upstock-homepage" className="portfolio-back-link">
          ← Back to Dashboard
        </Link>
      </div>

      {error && <div className="portfolio-error">{error}</div>}

      {holdings.length === 0 ? (
        <div className="portfolio-empty">
          <p>No holdings found in your portfolio</p>
        </div>
      ) : (
        <div className="portfolio-container">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Trading Symbol</th>
                <th>Exchange</th>
                <th>Quantity</th>
                <th>Product</th>
                <th>Last Price</th>
                <th>Close Price</th>
                <th>Average Price</th>
                <th>Profit & Loss</th>
                <th>Day Change</th>
                <th>Day Change %</th>
                <th>Haircut</th>
                <th>CNC Used</th>
                <th>T1 Quantity</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index}>
                  <td>{holding.tradingsymbol || "—"}</td>
                  <td>{holding.exchange || "—"}</td>
                  <td className="text-right">{holding.quantity}</td>
                  <td>{holding.product || "—"}</td>
                  <td className="text-right">
                    {holding.lastPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="text-right">
                    {holding.closePrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="text-right">
                    {holding.averagePrice?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    className={`text-right ${
                      holding.profitAndLoss >= 0 ? "profit" : "loss"
                    }`}
                  >
                    {holding.profitAndLoss?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    className={`text-right ${
                      holding.dayChange >= 0 ? "profit" : "loss"
                    }`}
                  >
                    {holding.dayChange?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    className={`text-right ${
                      holding.dayChangePercentage >= 0 ? "profit" : "loss"
                    }`}
                  >
                    {holding.dayChangePercentage?.toFixed(2) || "0.00"}%
                  </td>
                  <td className="text-right">
                    {(holding.haircut * 100).toFixed(0)}%
                  </td>
                  <td className="text-right">{holding.cncUsedQuantity}</td>
                  <td className="text-right">{holding.t1Quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="portfolio-summary">
            <div className="summary-card">
              <span className="summary-label">Total Holdings</span>
              <span className="summary-value">{holdings.length}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Total Quantity</span>
              <span className="summary-value">
                {holdings.reduce((sum, h) => sum + (h.quantity || 0), 0)}
              </span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Total Profit & Loss</span>
              <span
                className={`summary-value ${
                  holdings.reduce(
                    (sum, h) => sum + (h.profitAndLoss || 0),
                    0,
                  ) >= 0
                    ? "profit"
                    : "loss"
                }`}
              >
                {holdings
                  .reduce((sum, h) => sum + (h.profitAndLoss || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
