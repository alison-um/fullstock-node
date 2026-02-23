const ERROR_TITLE = {
  400: "Solicitud Incorrecta",
  401: "No autorizado",
  403: "Prohibido",
  404: "No encontrado",
  500: "Error interno del servidor",
};

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Ocurrio un problema inesperado";
  const path = err.path || "/";

  res.status(status).render("error", {
    title: `${status} - ${ERROR_TITLE[status] || "Error"} `, // 402 - Error
    message,
    path,
  });
}

export function notFoundHandler(_req, res, _next) {
  res.status(404).render("error", {
    title: "404 - Página no encontrada",
    message: "La página que estas buscando no existe o ha sido cambiada",
    path: "/",
  });
}
