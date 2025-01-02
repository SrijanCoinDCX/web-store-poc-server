const { decrypt } = require("./encryption");

//? Vendor Token Mapping
const vendorTokens = {
  organizationA: "vendor-token-orgA-123",
  organizationB: "vendor-token-orgB-456",
};

//? Simulated session-to-organization mapping
const userSessionMapping = {
  "session-token-123": "organizationA",
  "session-token-456": "organizationB",
};

//? Authenticate middleware to check session validity
const authenticate = (req, res, next) => {
  const token = req.cookies.sessionID;

  //? Validate session token directly (for demonstration, you may want to fetch from DB or cache)
  if (token === "session-token-123" || token === "session-token-456") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

//? Decrypt and validate session token
const decryptAndValidateSession = (req, res, next) => {
  const encryptedToken = req.cookies.sessionID;

  if (!encryptedToken) {
    return res.status(401).json({ message: "Session token missing or invalid" });
  }

  try {
    const sessionToken = decrypt(encryptedToken);
    console.log("Decrypted Session Token:", sessionToken);

    //* Validate session token against the predefined mapping
    const organization = userSessionMapping[sessionToken];

    if (!organization) {
      return res.status(401).json({ message: "Invalid session token" });
    }

    req.sessionToken = sessionToken; //* Pass the decrypted session token to the request
    req.organization = organization; //* Pass the associated organization
    next();
  } catch (error) {
    console.error("Failed to decrypt session token:", error.message);
    return res.status(401).json({ message: "Invalid session" });
  }
};

//? Authenticate and set the vendor token based on the organization
const authenticateAndSetVendorToken = (req, res, next) => {
  const organization = req.organization;

  //* Check if the vendor token exists for the organization
  if (!organization || !vendorTokens[organization]) {
    return res.status(403).json({ message: "Unauthorized or invalid session" });
  }

  //* Set the vendor token on the request
  req.vendorToken = vendorTokens[organization];
  next();
};

module.exports = {
  authenticate,
  decryptAndValidateSession,
  authenticateAndSetVendorToken,
};
