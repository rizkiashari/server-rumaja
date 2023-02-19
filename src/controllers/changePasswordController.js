const { User } = require("../../models");
const { errorResponse, successRes, successResWithData } = require("../helper/response");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const joi = require("joi");
const bcrypt = require("bcrypt");

const env = dotenv.config().parsed;

exports.findEmailResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const dataUser = req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
    });

    const { error } = schema.validate(dataUser);

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, 400, "EMAIL_NOT_FOUND");
    }

    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: env.EMAIL,
        pass: env.PASSWORD,
      },
      secure: true,
    });

    const rekomendasiPass = Math.random().toString(36).slice(-8);

    const mailData = {
      from: env.EMAIL,
      to: email,
      subject: "No reply - Permintaan Kata Sandi Baru untuk Rumaja",
      html: `
      <p>Kepada Pengguna yang Terhormat,</p>
      <br>
      <p>Kami menerima permintaan dari Anda untuk membuat kata sandi baru karena Anda telah lupa kata sandi Anda. Jika Anda tidak merasa melakukan permintaan, dimohon untuk mengabaikan email ini.</p>
      <br>
      <p>Berikut adalah kata sandi baru Anda: ${rekomendasiPass}. Silahkan masukan kata sandi berikut pada halaman Kata Sandi Baru, untuk melakuakn konfirmasi permintaan kata sandi baru Anda.</p>
      <br>
      <p>Kami sangat menyarankan Anda untuk mengganti kata sandi ini setelah Anda berhasil login dengan mengikuti langkah berikut:</p>
      <br>
      <p>1. Buka halaman Profil Anda </p>
      <p>2. Tekan ikon Pengaturan</p>
      <p>3. Pilih "Ubah kata sandi"</p>
      <br>
      <br>
      <p> Salam Hormat,</p>
      <br>
      <p>Rumaja Dev</p>
      `,
    };

    transporter.sendMail(mailData, async function (err, info) {
      if (err) {
        console.log(err);
        errorResponse(res, 500, `Error sending email: ${err}`);
      } else {
        const resetPassword = jwt.sign(
          { rekomendasiPass },
          env.JWT_RESET_PASSWORD_SECRET
        );

        await user.update({ resetPassword });

        successResWithData(res, 200, "SUCCESS_FIND_EMAIL", { link: resetPassword });
      }
    });
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { resetPassword, password } = req.body;

    const schema = joi.object({
      password: joi.string().min(8).required(),
    });

    const { error } = schema.validate({ password });

    if (error) {
      return errorResponse(res, 400, error.details[0].message);
    }

    const user = await User.findOne({ where: { resetPassword } });

    if (!user) {
      return errorResponse(res, 400, "DATA_NOT_FOUND");
    }

    let salt = await bcrypt.genSalt(+env.SALT);
    let hash = await bcrypt.hash(password, salt);

    await user.update({ password: hash, resetPassword: null });

    successRes(res, 200, "SUCCESS_CHANGE_PASSWORD");
  } catch (error) {
    errorResponse(res, 500, "Internal Server Error");
  }
};
