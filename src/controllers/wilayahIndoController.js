const { errorResponse, successResWithData, successRes } = require("../helper/response");
const fetch = require("node-fetch");

exports.provinsi = async (req, res) => {
  try {
    const dataProvinsi = await fetch(
      "https://dev.farizdotid.com/api/daerahindonesia/provinsi"
    ).then((respon) => respon.json());

    if (dataProvinsi) {
      const sortNamaProvinsi = dataProvinsi.provinsi.sort((a, b) => {
        if (a.nama < b.nama) {
          return -1;
        }
        if (a.nama > b.nama) {
          return 1;
        }
        return 0;
      });
      successResWithData(res, 200, "SUCCESS_GET_PROVINSI", sortNamaProvinsi);
    } else {
      errorResponse(res, 400, "FAILED_GET_PROVINSI");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.detailProvinsi = async (req, res) => {
  try {
    const { id_provinsi } = req.params;

    const dataDetailProvinsi = await fetch(
      `https://dev.farizdotid.com/api/daerahindonesia/provinsi/${id_provinsi}`
    ).then((respon) => respon.json());

    if (dataDetailProvinsi) {
      successResWithData(res, 200, "SUCCESS_GET_DETAIL_PROVINSI", dataDetailProvinsi);
    } else {
      errorResponse(res, 400, "FAILED_GET_DETAIL_PROVINSI");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.kota = async (req, res) => {
  try {
    const { id_provinsi } = req.query;

    const dataKota = await fetch(
      `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id_provinsi}`
    ).then((respon) => respon.json());

    if (dataKota) {
      const sortNamaKota = dataKota.kota_kabupaten.sort((a, b) => {
        if (a.nama < b.nama) {
          return -1;
        }
        if (a.nama > b.nama) {
          return 1;
        }
        return 0;
      });

      successResWithData(res, 200, "SUCCESS_GET_KOTA", sortNamaKota);
    } else {
      errorResponse(res, 400, "FAILED_GET_KOTA");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.detailKota = async (req, res) => {
  try {
    const { id_kota } = req.params;

    const dataDetailKota = await fetch(
      `https://dev.farizdotid.com/api/daerahindonesia/kota/${id_kota}`
    ).then((respon) => respon.json());

    if (dataDetailKota) {
      successResWithData(res, 200, "SUCCESS_GET_DETAIL_KOTA", dataDetailKota);
    } else {
      errorResponse(res, 400, "FAILED_GET_DETAIL_KOTA");
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
