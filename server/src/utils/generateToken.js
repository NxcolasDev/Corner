import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "corner-dev-secret";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;