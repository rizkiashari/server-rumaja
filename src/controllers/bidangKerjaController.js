const { Bidang_Kerja } = require("../../models");
const { errorResponse, successResWithData } = require("../helper/response");

exports.listBidangKerja = async (req, res) => {
  try {
    const listKerja = await Bidang_Kerja.findAll();

    if (!listKerja) {
      return errorResponse(res, 404, "BIDANG_KERJA_NOT_FOUND");
    }

    successResWithData(res, 200, "BIDANG_KERJA_FOUND", listKerja);
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
