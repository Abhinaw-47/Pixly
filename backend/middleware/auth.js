import jwt from "jsonwebtoken";



export default (req, res, next) => {
    
    try {
         const token = req.headers.authorization.split(" ")[1];
        
  const isCustomAuth = token.length < 500;

  let decodedData;

  if (token && isCustomAuth) {
    decodedData = jwt.verify(token, "test");
    req.userId = decodedData?.id;
  }
  else{
    decodedData = jwt.decode(token);
    req.userId = decodedData?.sub;
  }
   
    next();
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
   
}