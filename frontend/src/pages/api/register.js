export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({message: "Method Not allowed"});
    }

    const { userID, password } = req.body;

    console.log(userID);
    console.log(password);
    try {
        const response = await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID, password }),
        });
        
        
        const data = await response.json();
        
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