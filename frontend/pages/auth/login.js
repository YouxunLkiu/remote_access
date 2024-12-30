// pages/auth/signin.js
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";


export default function SignIn() {
  const [userID, setuserID] = useState("");
  const [password, setPassword] = useState("");
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
      // On success, you can redirect or show a success message
      router.push("/dashboard");
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
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
      </form>

      {/* Register Button */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => window.location.href = "/Create new account"} // Replace "/register" with your actual registration page route
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50", // Different color for Register
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
