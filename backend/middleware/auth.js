import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export default (req, res, next) => {
    
    try {
         const token = req.headers.authorization.split(" ")[1];
        
  const isCustomAuth = token.length < 500;

  let decodedData;

  if (token && isCustomAuth) {
    decodedData = jwt.verify(token,process.env.JWT_AcessSecret);
    req.userId = decodedData?.id;
  }
  else{
    decodedData = jwt.decode(token);
    req.userId = decodedData?.sub;
  }
   
    next();
        
    } catch (error) {
        // res.status(500).json({message:error.message})
                   if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid token", error: error.message });
    }
   
}