import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
ArcElement,
Title,
Tooltip,
Legend
);

function Dashboard({ authUser }) {
  const [sales, setSales] = useState([]);
  const [fit, setFit] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [futureLabels, setFutureLabels] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [mape, setMape] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = authUser || JSON.parse(localStorage.getItem("authUser") || "null") || {};
  const userName = user.name || user.email || "Sales User";

useEffect(() => {
  api
    .get("/forecast")
    .then((res) => {
      const payload = res.data;
      setSales(Array.isArray(payload?.sales) ? payload.sales : []);
      setFit(Array.isArray(payload?.fit) ? payload.fit : []);
      setForecast(Array.isArray(payload?.forecast) ? payload.forecast : []);
      setFutureLabels(Array.isArray(payload?.future_labels) ? payload.future_labels : []);
      setAccuracy(payload?.accuracy ?? null);
      setMape(payload?.mape ?? null);
    })
    .catch((err) => {
      console.error(err);
      setError("Unable to load sales and forecast data");
    })
    .finally(() => setLoading(false));
}, []);

const defaultValues = [12, 19, 7, 25, 18, 22, 15, 28, 23, 30, 26, 33];
const actualValues = sales.length > 0 ? sales : defaultValues;
const fitValues = fit.length === actualValues.length ? fit : actualValues.map((value) => value);
const forecastValues = forecast.length > 0 ? forecast : [];
const historyLabels = actualValues.map((_, index) => `Month ${index + 1}`);
const forecastLabels = futureLabels.length > 0 ? futureLabels : forecastValues.map((_, index) => `Pred ${index + 1}`);
const chartLabels = [...historyLabels, ...forecastLabels];
const chartValues = [...actualValues, ...forecastValues];

const lineData = {
  labels: chartLabels,
  datasets: [
    {
      label: "Actual Sales",
      data: [...actualValues, ...forecastValues.map(() => null)],
      borderColor: "#1e3a8a",
      backgroundColor: "rgba(30, 58, 138, 0.2)",
      fill: true,
    },
    {
      label: "Fitted Trend",
      data: [...fitValues, ...forecastValues.map(() => null)],
      borderColor: "#22c55e",
      backgroundColor: "rgba(34, 197, 94, 0.15)",
      borderDash: [4, 4],
      fill: false,
    },
    {
      label: "Forecasted Sales",
      data: [...actualValues.map(() => null), ...forecastValues],
      borderColor: "#f59e0b",
      backgroundColor: "rgba(245, 158, 11, 0.15)",
      borderDash: [6, 6],
      fill: false,
    },
  ],
};

const barData = {
  labels: chartLabels,
  datasets: [
    {
      label: "Actual + Forecast",
      data: chartValues,
      backgroundColor: chartValues.map((_, index) =>
        index < actualValues.length ? "rgba(56, 189, 248, 0.6)" : "rgba(245, 158, 11, 0.6)"
      ),
      borderColor: chartValues.map((_, index) =>
        index < actualValues.length ? "rgba(56, 189, 248, 1)" : "rgba(245, 158, 11, 1)"
      ),
      borderWidth: 1,
    },
  ],
};

const pieData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      data: [
        actualValues.slice(0, 3).reduce((a, b) => a + b, 0),
        actualValues.slice(3, 6).reduce((a, b) => a + b, 0),
        actualValues.slice(6, 9).reduce((a, b) => a + b, 0),
        actualValues.slice(9, 12).reduce((a, b) => a + b, 0),
      ],
      backgroundColor: ["#60a5fa", "#34d399", "#f59e0b", "#f87171"],
      borderColor: ["#fff", "#fff", "#fff", "#fff"],
      borderWidth: 2,
    },
  ],
};

const totalSales = actualValues.reduce((a, b) => a + b, 0);
const avgSales = actualValues.length ? (totalSales / actualValues.length).toFixed(1) : 0;
const forecastTotal = forecastValues.reduce((a, b) => a + b, 0);
const bestMonthIndex = actualValues.indexOf(Math.max(...actualValues));
const bestMonth = actualValues.length ? `Month ${bestMonthIndex + 1}` : "N/A";


if(loading){
  return <div style={{padding:"30px"}}><h2>Loading dashboard...</h2></div>;
}

if(error){
  return <div style={{padding:"30px", color:"red"}}><h2>{error}</h2></div>;
}

return (
  <div style={{ padding: "30px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
      <div>
        <h2>AI Sales Prediction Dashboard</h2>
        <p style={{ color: "#4b5563" }}>
          Welcome back, {userName}. Review your forecasts, upload new CSV data, and manage your profile from here.
        </p>
      </div>
      <Link to="/upload" style={{ textDecoration: "none" }}>
        <button style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: "700" }}>
          Upload CSV
        </button>
      </Link>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "24px" }}>
      <div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px" }}>
          <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 8px" }}>Total Sales</h3>
            <p style={{ fontSize: "24px", fontWeight: "700", margin: "0" }}>{totalSales}</p>
          </div>
          <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 8px" }}>Average Monthly</h3>
            <p style={{ fontSize: "24px", fontWeight: "700", margin: "0" }}>{avgSales}</p>
          </div>
          <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 8px" }}>Forecast Next 3</h3>
            <p style={{ fontSize: "24px", fontWeight: "700", margin: "0" }}>{forecastTotal}</p>
          </div>
          <div style={{ padding: "18px", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 8px" }}>Trend Accuracy</h3>
            <p style={{ fontSize: "24px", fontWeight: "700", margin: "0" }}>{accuracy !== null ? `${accuracy}%` : "N/A"}</p>
            <small style={{ color: "#555" }}>{mape !== null ? `MAPE ${mape}%` : ""}</small>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
          <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#fff" }}>
            <h3>Sales Trend</h3>
            <Line data={lineData} />
          </div>

          <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#fff" }}>
            <h3>Monthly Forecast</h3>
            <Bar data={barData} />
          </div>

          <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#fff" }}>
            <h3>Quarterly Split</h3>
            <Pie data={pieData} />
          </div>

          <div style={{ padding: "12px", border: "1px solid #e5e7eb", borderRadius: "12px", backgroundColor: "#fff" }}>
            <h3>Data Source</h3>
            <p>API: <code>GET /forecast</code></p>
            <p>Points: {chartValues.length}</p>
            <p>Updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        <div style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "16px", background: "#fff" }}>
          <h3>Profile</h3>
          <p><strong>Name:</strong> {user.name || "Not set"}</p>
          <p><strong>Email:</strong> {user.email || "Not set"}</p>
          <p><strong>Member since:</strong> {new Date().toLocaleDateString()}</p>
          <p><strong>Suggested action:</strong> Upload a CSV file to refresh forecasts.</p>
        </div>

        <div style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "16px", background: "#f8fafc" }}>
          <h3>Quick Actions</h3>
          <p>Upload a new sales CSV file or update your saved data from the upload page.</p>
          <Link to="/upload" style={{ textDecoration: "none" }}>
            <button style={{ width: "100%", padding: "12px", border: "none", borderRadius: "12px", background: "#2563eb", color: "white", fontWeight: "700", cursor: "pointer" }}>
              Go to Upload
            </button>
          </Link>
        </div>

        <div style={{ padding: "20px", border: "1px solid #e5e7eb", borderRadius: "16px", background: "#fff" }}>
          <h3>Top Insight</h3>
          <p><strong>Best month:</strong> {bestMonth}</p>
          <p><strong>Forecast booster:</strong> Next period predictions are ready to review.</p>
        </div>
      </div>
    </div>
  </div>
);
}

export default Dashboard;