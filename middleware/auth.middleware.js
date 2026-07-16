import jwt from "jsonwebtoken";

function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| API guards -> respond with JSON errors
|--------------------------------------------------------------------------
*/

export function requireAuthApi(req, res, next) {
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to continue."
    });
  }

  req.user = user;
  next();
}

export function requireAdminApi(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required."
    });
  }

  next();
}

/*
|--------------------------------------------------------------------------
| Page guards -> redirect instead of JSON, since these serve HTML
|--------------------------------------------------------------------------
*/

export function requireAuthPage(req, res, next) {
  const user = verifyToken(req);

  if (!user) {
    return res.redirect("/login.html");
  }

  req.user = user;
  next();
}

export function requireAdminPage(req, res, next) {
  if (req.user.role !== "admin") {
    return res.redirect("/index.html");
  }

  next();
}
