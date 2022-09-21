exports.errorResponse = (res, code, msg) => {
  return res.status(code).send({
    code,
    status: false,
    message: msg,
  });
};
