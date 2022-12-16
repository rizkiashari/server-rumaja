const {
  User,
  Riwayat,
  Notifikasi,
  Lowongan,
  Pencari,
  Penyedia,
  Bidang_Kerja,
} = require("../../models");
const { errorResponse, successResWithData } = require("../helper/response");

exports.getAllDaftarNotifikasi = async (req, res) => {
  try {
    const userLogin = req.user;

    if (userLogin.id_role === 2) {
      const pencari = await Pencari.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const notifikasi = await Notifikasi.findAll({
        include: [
          {
            model: Riwayat,
            as: "riwayat",
            where: {
              id_pencari: pencari.id,
            },
            attributes: ["id", "id_pencari", "id_lowongan"],
            include: [
              {
                model: Lowongan,
                as: "lowongan",
                attributes: ["id"],
                include: [
                  {
                    model: Penyedia,
                    as: "penyedia",
                    attributes: ["id"],
                    include: [
                      {
                        model: User,
                        as: "users",
                        attributes: ["nama_user"],
                      },
                    ],
                  },
                  {
                    model: Bidang_Kerja,
                    as: "bidang_kerja",
                    attributes: ["id", "detail_bidang"],
                  },
                ],
              },
            ],
          },
        ],
        attributes: {
          exclude: ["updatedAt"],
        },
      });

      const newNotifikasi = notifikasi.map((item) => {
        const pencariNotif = item?.detail_notifikasi.split("-");
        let detailNotif = "";
        if (pencariNotif[1] === "pencari") {
          detailNotif = pencariNotif[0];
        }

        return {
          id: item?.id,
          detail_notifikasi: detailNotif,
          isRead: item?.isRead,
          createdAt: item?.createdAt,
          id_pencari: item?.riwayat?.id_pencari,
          nama_penyedia: item?.riwayat?.lowongan?.penyedia?.users?.nama_user,
          detail_bidang: item?.riwayat?.lowongan?.bidang_kerja?.detail_bidang,
          photo_bidang:
            item?.riwayat?.lowongan?.bidang_kerja?.id === 1
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/art_tqnghe.png"
              : item?.riwayat?.lowongan?.bidang_kerja?.id === 2
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/pengasuh_chdloc.png"
              : item?.riwayat?.lowongan?.bidang_kerja?.id === 3
              ? "https://res.cloudinary.com/drcocoma3/image/upload/v1669642546/Rumaja/sopir_pribadi_quexmw.png"
              : "https://res.cloudinary.com/drcocoma3/image/upload/v1669642547/Rumaja/tukang_kebun_skhz9a.png",
        };
      });

      successResWithData(
        res,
        200,
        "SUCCESS_DAFTAR_NOTIFIKASIS",
        newNotifikasi.filter((item) => item.detail_notifikasi !== "")
      );
    } else {
      const penyedia = await Penyedia.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const notifikasi = await Notifikasi.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: Riwayat,
            as: "riwayat",
            attributes: ["id", "id_pencari", "id_lowongan"],
            include: [
              {
                model: Lowongan,
                as: "lowongan",
                attributes: ["id", "id_penyedia"],
                where: {
                  id_penyedia: penyedia.id,
                },
                include: [
                  {
                    model: Penyedia,
                    as: "penyedia",
                    attributes: ["id"],
                    include: [
                      {
                        model: User,
                        as: "users",
                        attributes: ["nama_user"],
                      },
                    ],
                  },
                ],
              },
              {
                model: Pencari,
                as: "pencari",
                attributes: ["id"],
                include: [
                  {
                    model: Bidang_Kerja,
                    as: "bidang_kerja",
                    attributes: ["id", "detail_bidang"],
                  },
                  {
                    model: User,
                    as: "users",
                    attributes: ["nama_user", "photo_profile"],
                  },
                ],
              },
            ],
          },
        ],
      });

      const newNotifikasi = notifikasi.map((item) => {
        const penyediaNotif = item.detail_notifikasi.split("-");

        let detailNotif = "";

        if (penyediaNotif[1] === "penyedia") {
          detailNotif = penyediaNotif[0];
        }

        return {
          id: item.id,
          detail_notifikasi: detailNotif,
          isRead: item.isRead,
          createdAt: item.createdAt,
          nama_pelamar: item?.riwayat?.pencari?.users?.nama_user,
          detail_bidang: item?.riwayat?.pencari?.bidang_kerja?.detail_bidang,
          id_penyedia: item?.riwayat?.lowongan?.id_penyedia,
          photo_profile: item?.riwayat?.pencari?.users?.photo_profile,
          nama_penyedia: item?.riwayat?.lowongan?.penyedia?.users?.nama_user,
        };
      });

      successResWithData(
        res,
        200,
        "SUCCESS_DAFTAR_NOTIFIKASI",
        newNotifikasi.filter((item) => item.detail_notifikasi !== "")
      );
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.countNotifikasi = async (req, res) => {
  try {
    const userLogin = req.user;

    if (userLogin.id_role === 2) {
      const pencari = await Pencari.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const notifikasi = await Notifikasi.findAll({
        where: {
          isRead: false,
        },
        include: [
          {
            model: Riwayat,
            as: "riwayat",
            where: {
              id_pencari: pencari.id,
            },
            attributes: ["id", "id_pencari", "id_lowongan"],
          },
        ],
        attributes: {
          exclude: ["updatedAt"],
        },
      });

      const newNotifikasi = notifikasi.map((item) => {
        const pencariNotif = item?.detail_notifikasi.split("-");
        let detailNotif = "";
        if (pencariNotif[1] === "pencari") {
          detailNotif = pencariNotif[0];
        }

        return {
          id: item?.id,
          detail_notifikasi: detailNotif,
          isRead: item?.isRead,
          createdAt: item?.createdAt,
        };
      });

      const countNotifikasi = newNotifikasi.filter(
        (item) => item.detail_notifikasi !== ""
      ).length;

      successResWithData(res, 200, "SUCCESS_COUNT_NOTIFIKASI", countNotifikasi);
    } else {
      const penyedia = await Penyedia.findOne({
        where: {
          id_user: userLogin.id,
        },
      });

      const notifikasi = await Notifikasi.findAll({
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: Riwayat,
            as: "riwayat",
            attributes: ["id", "id_pencari", "id_lowongan"],
            include: [
              {
                model: Lowongan,
                as: "lowongan",
                attributes: ["id", "id_penyedia"],
                where: {
                  id_penyedia: penyedia.id,
                },
              },
            ],
          },
        ],
      });

      const newNotifikasi = notifikasi.map((item) => {
        const penyediaNotif = item.detail_notifikasi.split("-");

        let detailNotif = "";

        if (penyediaNotif[1] === "penyedia") {
          detailNotif = penyediaNotif[0];
        }

        return {
          id: item.id,
          detail_notifikasi: detailNotif,
          isRead: item.isRead,
          createdAt: item.createdAt,
        };
      });

      successResWithData(
        res,
        200,
        "SUCCESS_DAFTAR_NOTIFIKASI",
        newNotifikasi.filter((item) => item.detail_notifikasi !== "").length
      );
    }
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.readNotifikasi = async (req, res) => {
  try {
    const { id } = req.params;

    await Notifikasi.update(
      {
        isRead: true,
      },
      {
        where: {
          id,
        },
      }
    );

    successRes(res, 200, "SUCCESS_READ_NOTIFIKASI");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
