const debug = require("debug")("robots:error");
const { ValidationError } = require("express-validation");

const noEncontradoHandler = (req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado!" });
};

// eslint-disable-next-line no-unused-vars
const finalErrorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    error.code = 400;
    error.message = "Credenciales erroneas!";
  }
  debug("Ha ocurrido un error: ", error.message);
  const message = error.code ? error.message : "Error General";
  res.status(error.code || 500).json({ error: message });
};

module.exports = { noEncontradoHandler, finalErrorHandler };
