const express = require("express");
const { decryptAndValidateSession, authenticateAndSetVendorToken } = require("../middleware/auth.middleware");
const { encrypt } = require("../middleware/encryption");

const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
  const { username } = req.body;

  if (username === "testuser") {
    const sessionToken = "session-token-123";
    const encryptedToken = encrypt(sessionToken); 
    res.cookie("sessionID", encryptedToken, {
      httpOnly: true,
      secure: false, //* Set true in production
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Login successful" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

//? Protected route to get data, using session and vendor token
authRouter.get("/protected", decryptAndValidateSession, authenticateAndSetVendorToken, (req, res) => {
  console.log("Vendor Token:", req.vendorToken);
  res.status(200).json({
    data: "This is protected data.",
    sessionToken: req.sessionToken,
    vendorToken: req.vendorToken,
  });
});

module.exports = authRouter;
