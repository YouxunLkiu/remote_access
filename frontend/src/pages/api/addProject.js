export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
    
   
    const {userID, projectName, projectDescription, pcid } = req.body;
    console.log(req.credentials);
    try {
        const response = await fetch("http://localhost:4000/addProject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ userID:userID, userprojectNameID: projectName, projectDescription: projectDescription, pcid: pcid }),
          
        });
        
        
        const data = await response.json();
        
        if (response.ok) {
          // Successful login: return the token or user data
          return res.status(200).json(data);
          
          
        } else {
          // Authentication failed: forward the error
          return res.status(response.status).json(data);
        }
      } catch (error) {
        console.error("Error connecting to Express backend:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

}