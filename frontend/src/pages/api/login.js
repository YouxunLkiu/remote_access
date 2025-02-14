import cookie from "cookie"; 

export default async function handler(req, res) {
    
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { userID, password } = req.body;
    
    // Forward the login request to your Express backend
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userID, password }),
        
      });
      
      
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Successful login: return the token or user data
       

        res.status(200).json(data);
      } else {
        // Authentication failed: forward the error
        res.status(response.status).json(data);
      }
    } catch (error) {
      console.error("Error connecting to Express backend:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  