import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  // 2. Check if no token exists
  if (!token) {
    // Return 401 Unauthorized status
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 3. Verify token (decode the payload)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    );

    // 4. Attach the user object (with ID) to the request
    req.user = decoded.user;

    // 5. Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid token (e.g., expired or malformed)
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
