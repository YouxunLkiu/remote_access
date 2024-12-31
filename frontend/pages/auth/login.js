// pages/auth/signin.js
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";


export default function SignIn() {
  const [userID, setuserID] = useState("");
  const [password, setPassword] = useState("");
  const [dashboardType, setDashboardType] = useState("mobile");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send POST request to /api/login
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, password }),
    });
   
    const data = await res.json();

    if (res.ok) {
      // Redirect to the appropriate dashboard
      if (dashboardType === "mobile") {
        router.push("/mobile-dashboard");
      } else {
        router.push("/trainer-dashboard");
      }
    } else {
      // On error, display an error message
      setError(data.message || "Something went wrong");
    }
  };
  

  return (
    
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="userID">userID:</label>
          <input
            type="text"
            id="userID"
            value={userID}
            onChange={(e) => setuserID(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            required
          />
        </div>
  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
  {/* Login Button */}
  <button
    type="submit"
    style={{
      flex: 2,
      padding: "10px",
      marginRight: "10px",
      backgroundColor: "#0070f3",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    }}
  >
    Login
  </button>

  {/* Register Button */}
  <button
    type="button"
    onClick={() => window.location.href = "/auth/register"}
    style={{
      flex: 2,
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      cursor: "pointer",
    }}
  >
    Register
  </button>
</div>
      </form>



      {/* Flip Switch for Dashboard Type */}
      <div style={{ marginBottom: "20px" }}>
  <label>
    <input
      type="radio"
      name="dashboardType"
      value="trainer"
      checked={dashboardType === "trainer"}
      onChange={() => setDashboardType("trainer")}
    />
    Trainer
  </label>
  <label style={{ marginLeft: "10px" }}>
    <input
      type="radio"
      name="dashboardType"
      value="mobile"
      checked={dashboardType === "mobile"}
      onChange={() => setDashboardType("mobile")}
    />
    Mobile
  </label>
</div>
    </div>
  );
}
