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

  const additionalParams = useMemo(() => {
    if (!upstockData || typeof upstockData !== "object") return [];

    const hiddenKeys = [
      "upstockToken",
      "upstockExtendedToken",
      "access_token",
      "extended_token",
      "broker",
      "email",
      "exchanges",
      "is_active",
      "order_types",
      "products",
      "user_id",
      "user_name",
      "user_type",
    ];

    return Object.entries(upstockData).filter(
      ([key]) => !hiddenKeys.includes(key),
    );
  }, [upstockData]);

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
      <div className="upstock-page__hero">
        <p style={{ marginBottom: "12px", color: "#2563eb", fontWeight: 700 }}>
          Upstock Account Summary
        </p>
        <h1>Welcome to your Upstock dashboard</h1>
        <p>
          Your account information is shown below. Tokens are securely stored
          and not displayed on this page.
        </p>
      </div>

      <div className="upstock-page__content">
        <section className="upstock-card">
          <h2>Profile details</h2>
          {upstockData ? (
            <dl>
              {profileFields.map(({ label, value }) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "Not available"}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="upstock-empty">
              No Upstock data available. Please refresh after login or verify
              your validation step.
            </div>
          )}
        </section>

        <section className="upstock-card">
          <h2>Trading access</h2>
          {upstockData ? (
            <div>
              {listFields.map(({ label, values }) => (
                <div key={label} style={{ marginBottom: "18px" }}>
                  <dt style={{ marginBottom: "10px", color: "#374151" }}>
                    {label}
                  </dt>
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
                      <span style={{ color: "#6b7280" }}>Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="upstock-card">
          <h2>Additional account metadata</h2>
          {upstockData && additionalParams.length > 0 ? (
            <div style={{ display: "grid", gap: "14px" }}>
              {additionalParams.map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    border: "1px solid rgba(14, 21, 49, 0.08)",
                    borderRadius: "14px",
                    padding: "14px",
                    background: "#f8fafc",
                  }}
                >
                  <strong>{key}</strong>
                  <div style={{ marginTop: "8px", color: "#475569" }}>
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="upstock-empty">No extra metadata found.</div>
          )}
        </section>
      </div>

      <div className="upstock-page__footer">
        <Link to="/login" className="upstock-back-link">
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}

export default UpstockHomepage;
