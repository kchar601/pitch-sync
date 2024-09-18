import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is not valid" });
      }

      req.user = user; // Add user info to request object
      next();
    });
  } else {
    res.status(401).json({ error: "Authentication required" });
  }
};

export default authenticateJWT;
