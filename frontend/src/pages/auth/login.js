// pages/auth/signin.js
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import '../../styles/globals.css';


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
    console.log(data);
    if (res.ok) {
     

      
      // Redirect to the appropriate dashboard
      if (dashboardType === "mobile") {
        router.push({
          pathname: "/dashboard/mobile",
          query: {userID},
        });
      } else {
        router.push({
          pathname: "/dashboard/trainer",
          query: {userID},
        });
      }
    } else {
      // On error, display an error message
      setError(data.message || "Something went wrong");
    }
  };
  

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center">
      {/* Outer Box */}
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userID" className="block font-medium mb-2">
              UserID:
            </label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setuserID(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-between items-center mb-6">
            {/* Login Button */}
            <button
              type="submit"
              className="login-button-nocolor  hover:bg-blue-600 hover:text-white"
            >
              Login
            </button>
            {/* Register Button */}
            <button
              type="button"
              onClick={() => (window.location.href = "/auth/register")}
              className=" button-primary-light  bg-gray-500 hover:bg-gray-600"
            >
              Register
            </button>
          </div>
        </form>
        {/* Flip Switch for Dashboard Type */}
        <div className="flex justify-center gap-4">
          <label>
            <input
              type="radio"
              name="dashboardType"
              value="trainer"
              checked={dashboardType === "trainer"}
              onChange={() => setDashboardType("trainer")}
              className="mr-2"
            />
            Trainer
          </label>
          <label>
            <input
              type="radio"
              name="dashboardType"
              value="mobile"
              checked={dashboardType === "mobile"}
              onChange={() => setDashboardType("mobile")}
              className="mr-2"
            />
            Mobile
          </label>
        </div>
      </div>
    </div>
  );
  
}
