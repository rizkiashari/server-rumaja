exports.errorResponse = (res, code, msg) => {
  return res.status(code).send({
    code,
    status: false,
    message: msg,
  });
};

exports.successResWithData = (res, code, msg, data) => {
  return res.status(code).send({
    code,
    status: true,
    message: msg,
    data: data,
  });
};

exports.successRes = (res, code, msg) => {
  return res.status(code).send({
    code,
    status: true,
    message: msg,
  });
};
