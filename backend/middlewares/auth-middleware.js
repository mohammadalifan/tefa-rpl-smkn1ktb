function requireAuth(request, response, next) {
  if (!request.session.user) {
    if (request.originalUrl.startsWith("/api/")) {
      return response.status(401).json({ message: "Silakan login terlebih dahulu." });
    }

    return response.redirect("/login");
  }

  next();
}

module.exports = { requireAuth };
