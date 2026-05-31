import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import "./UpstockHomepage.css";

function UpstockHomepage() {
  const location = useLocation();
  const upstockData = useMemo(() => {
    if (location.state?.upstockData) {
      return location.state.upstockData;
    }

    const stored = localStorage.getItem("upstockData");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }

    return null;
  }, [location.state]);

  const profileFields = [
    { label: "Broker", value: upstockData?.broker },
    { label: "Email", value: upstockData?.email },
    { label: "User ID", value: upstockData?.user_id },
    { label: "User Name", value: upstockData?.user_name },
    { label: "User Type", value: upstockData?.user_type },
    { label: "Active", value: upstockData?.is_active?.toString() ?? "" },
  ];

  const listFields = [
    {
      label: "Exchanges",
      values: Array.isArray(upstockData?.exchanges)
        ? upstockData.exchanges
        : upstockData?.exchanges
          ? [upstockData.exchanges]
          : [],
    },
    {
      label: "Order Types",
      values: Array.isArray(upstockData?.order_types)
        ? upstockData.order_types
        : upstockData?.order_types
          ? [upstockData.order_types]
          : [],
    },
    {
      label: "Products",
      values: Array.isArray(upstockData?.products)
        ? upstockData.products
        : upstockData?.products
          ? [upstockData.products]
          : [],
    },
  ];

  return (
    <div className="upstock-page">
      <div className="upstock-header">
        <div>
          <h1>Upstock Dashboard</h1>
          <p>Manage your account and view portfolio details.</p>
        </div>

        <Link to="/portfolio" className="upstock-action-link">
          View Portfolio →
        </Link>
      </div>

      {upstockData ? (
        <>
          <div className="upstock-summary-grid">
            <div className="upstock-summary-card">
              <span className="summary-label">Account</span>
              <span className="summary-value">
                {upstockData.user_name || "—"}
              </span>
            </div>
            <div className="upstock-summary-card">
              <span className="summary-label">Broker</span>
              <span className="summary-value">{upstockData.broker || "—"}</span>
            </div>
            <div className="upstock-summary-card">
              <span className="summary-label">Status</span>
              <span className="summary-value">
                {upstockData.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="upstock-section">
            <div className="upstock-section-header">
              <h2>Profile Details</h2>
            </div>
            <div className="upstock-detail-grid">
              {profileFields.map(({ label, value }) => (
                <div key={label} className="upstock-detail-row">
                  <span className="upstock-detail-label">{label}</span>
                  <span className="upstock-detail-value">
                    {value || "Not available"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="upstock-section">
            <div className="upstock-section-header">
              <h2>Trading Access</h2>
            </div>
            <div className="upstock-tags">
              {listFields.map(({ label, values }) => (
                <div key={label} className="upstock-tag-group">
                  <span className="upstock-tag-label">{label}</span>
                  <div className="upstock-badges">
                    {values.length > 0 ? (
                      values.map((value) => (
                        <span
                          key={`${label}-${value}`}
                          className="upstock-badge"
                        >
                          {value}
                        </span>
                      ))
                    ) : (
                      <span className="upstock-missing">Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="upstock-empty">No Upstock account data available.</div>
      )}

      <div className="upstock-footer">
        <Link to="/login" className="upstock-back-link">
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}

export default UpstockHomepage;
