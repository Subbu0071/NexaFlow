const jwt = require("jsonwebtoken");
const { User, ActiveSession } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    // 1. Read the access token from the Authorization header.
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify JWT signature and expiration.
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 3. Check whether this session still exists.
    const session = await ActiveSession.findOne({
      where: {
        userId: decoded.sub,
        sessionId: decoded.sessionId,
      },
    });

    const now = new Date();

    const isExpired =
      !session ||
      new Date(session.expiresAt) <= now ||
      now.getTime() - new Date(session.lastHeartbeat).getTime() > 90 * 1000;

    if (isExpired) {
      if (session) {
        await session.destroy();
      }

      return res.status(401).json({
        success: false,
        message: "Session is invalid or expired. Please log in again.",
      });
    }

    // 4. Check whether the account is still active.
    const user = await User.findByPk(decoded.sub);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account is unavailable.",
      });
    }

    // 5. Attach authenticated user details to the request.
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      sessionId: session.sessionId,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed due to a server error.",
    });
  }
};

module.exports = authenticate;
