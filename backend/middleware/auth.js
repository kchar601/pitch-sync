import jwt from "jsonwebtoken";

// Middleware to authenticate and extract JWT token
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract the token from 'Bearer <token>'
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user; // Attach the user object (which includes the userId) to the request
      next();
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};
