const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const sendMail = require("../ultils/sendMail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefeshToken,
} = require("../middlewares/jwt");
const { nextTick } = require("process");

const makeToken = require("uniqid");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;

  // Kiểm tra đầu vào
  if (!email || !password || !lastname || !firstname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Bạn chưa điền đầy đủ thông tin!",
    });
  }

  // Kiểm tra xem email đã tồn tại chưa
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({
      success: false,
      mes: "Email này đã được sử dụng",
    });
  }

  // Kiểm tra xem số điện thoại đã tồn tại chưa
  const existingMobile = await User.findOne({ mobile });
  if (existingMobile) {
    return res.status(400).json({
      success: false,
      mes: "Số điện thoại này đã được sử dụng",
    });
  }

  // Tạo token và lưu vào cookie
  const token = makeToken();
  res.cookie(
    "dataregister",
    { ...req.body, token },
    { httpOnly: true, maxAge: 15 * 60 * 1000 } // Cookie hết hạn sau 15 phút
  );

  // Tạo nội dung email và gửi
  const html = `Xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký. Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
      <a href=${process.env.URL_SERVER}/api/user/finalregister/${token}>Click here</a>`;
  await sendMail({ email, html, subject: "Hoàn tất đăng ký Giang Phone" });

  // Trả về phản hồi
  return res.status(200).json({
    success: true,
    mes: "Làm ơn kiểm tra email của bạn!",
  });
});

const finalRegister = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const { token } = req.params;

  // Kiểm tra cookie hoặc token
  if (!cookie || cookie.dataregister?.token !== token) {
    res.clearCookie("dataregister");
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }
  // Tạo người dùng mới từ thông tin lưu trong cookie
  const newUser = await User.create({
    email: cookie.dataregister.email,
    password: cookie.dataregister.password,
    mobile: cookie.dataregister.mobile,
    firstname: cookie.dataregister.firstname,
    lastname: cookie.dataregister.lastname,
  });
  res.clearCookie("dataregister");
  // Kiểm tra việc tạo người dùng thành công hay thất bại
  if (newUser) {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/success`);
  } else {
    return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`);
  }
});
// API kiểm tra email và số điện thoại
const checkEmailMobile = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;

  // Kiểm tra nếu không có email và số điện thoại trong yêu cầu
  if (!email && !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing email or mobile",
    });
  }

  // Kiểm tra email đã tồn tại chưa
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        mes: "Email đã được sử dụng",
      });
    }
  }

  // Kiểm tra số điện thoại đã tồn tại chưa
  if (mobile) {
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        mes: "Số điện thoại đã được sử dụng",
      });
    }
  }

  // Nếu không có trùng lặp
  return res.status(200).json({
    success: true,
    mes: "Email và số điện thoại hợp lệ",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({
      success: false,
      mes: "Vui lòng điền đầy đủ thông tin!!",
    });
  }

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tách password và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    //tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // tạo refesh token
    const newrefreshToken = generateRefeshToken(response._id);

    // Lưu refesh token  vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newrefreshToken },
      { new: true }
    );

    // Lưu refesh token vào cookie
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials! ");
  }
});
const getCrurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id)
    .select(
      "-password -passwordResetExpiress -passwordResetToken -passwordChangedAt -refreshToken"
    )
    .populate({
      path: "cart",
      populate: {
        path: "product",
        select: "title slug category quantity price thumb color",
      },
    });

  return res.status(user ? 200 : 401).json({
    success: !!user,
    userData: user ? user : undefined,
    mes: !user ? "User not found" : undefined,
  });
});

const refeshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie && !cookie.refreshToken)
    throw new Error("No refreshToken in cookies");
  jwt.verify(
    cookie.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err) throw new Error("Invalid resfresh token");
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });
      return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
          ? generateAccessToken(response._id, response.role)
          : "refresh token not matched",
      });
    }
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //  xóa rèfresh token khỏi db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: null },
    { new: true }
  );
  // xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });

  return res.status(200).json({
    success: true,
    mes: "Đăng xuất thành công.",
  });
});

// client guiwr email
// server check email có hợp lệ hay khồn => Gửi email + kèm theo link (password change token)
// client check mail => click link
// client gửi api kèm token
// check token  có giống với token mà server gửi hay không
// change password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      mes: "Làm ơn hãy nhập email",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      mes: "Email bạn nhập không đúng!",
    });
  }
  const resetToken = user.createPasswordChangeToken();
  await user.save();
  const html = `xin vui lòng click vào link dưới đây để đổi mật khẩu. link này sẽ hết hạn sau 15p 
  <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
  const data = { email, html, subject: "Quên mật khẩu" };
  await sendMail(data);
  return res.status(200).json({
    success: true,
    mes: "Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpiress: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpiress = undefined;

  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "updated password" : "somthing went wrong",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // Tách các trường đặc biệt ra khỏi query
  const excludefields = ["limit", "sort", "page", "fields"];
  excludefields.forEach((el) => delete queries[el]);
  // Format lại các operators cho đúng cú pháp của mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  // Filltering
  if (queries?.name)
    formatedQueries.name = { $regex: queries.name, $options: "i" };
  if (req.query.q) {
    delete formatedQueries.q;
    formatedQueries["$or"] = [
      { email: { $regex: req.query.q, $options: "i" } },
      { mobile: { $regex: req.query.q, $options: "i" } },
    ];
  }

  let queryCommand = User.find(formatedQueries);
  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  // Fields limitimg
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCT;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);
  //Execute query
  try {
    const response = await queryCommand.exec();
    const counts = await User.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      users: response ? response : "cannot get users",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});
const getUsersById = asyncHandler(async (req, res) => {
  const { uid } = req.params; // Lấy ID từ route params
  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "Missing user ID",
    });
  }

  try {
    const response = await User.findById(uid).select(
      "-password -passwordResetToken -passwordResetExpiress -passwordChangedAt -refreshToken"
    );
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;

  // Tìm user theo ID
  const user = await User.findById(uid);
  // Kiểm tra role, không cho phép xóa admin (role = 2003)
  if (+user.role === 2003) {
    return res.status(403).json({
      success: false,
      mes: "Không thể xóa admin",
    });
  }
  // Nếu không phải admin, tiến hành xóa
  const response = await User.findByIdAndDelete(uid);

  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? `User với email ${response.email} đã bị xóa.`
      : "Không thể xóa người dùng.",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user; // Lấy _id từ thông tin người dùng (đã được xác thực từ middleware)

  // Kiểm tra nếu không có _id thì không thể cập nhật
  if (!_id) {
    return res.status(400).json({
      success: false,
      mes: "ID người dùng không hợp lệ.",
    });
  }

  // Lấy các thông tin từ request body
  const { firstname, lastname, email, mobile, address } = req.body;

  // Tạo đối tượng để lưu trữ dữ liệu cần cập nhật
  const updatedFields = { firstname, lastname, email, mobile, address };

  // Kiểm tra nếu có file avatar thì gán đường dẫn file vào updatedFields
  if (req.file) {
    updatedFields.avatar = req.file.path;
  }

  // Nếu không có thông tin để cập nhật, trả về lỗi
  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({
      success: false,
      mes: "Không có thông tin để cập nhật.",
    });
  }

  // Cập nhật người dùng trong cơ sở dữ liệu
  const response = await User.findByIdAndUpdate(_id, updatedFields, {
    new: true, // Trả về bản cập nhật mới nhất
  }).select("-password -role -refreshToken"); // Loại bỏ các trường không cần thiết (password, role, refreshToken)

  // Kiểm tra xem dữ liệu có được cập nhật hay không
  if (!response) {
    return res.status(500).json({
      success: false,
      mes: "Cập nhật thất bại, vui lòng thử lại.",
    });
  }

  // Trả về phản hồi thành công
  return res.status(200).json({
    success: true,
    mes: "Cập nhật tài khoản thành công.",
    user: response, // Trả về dữ liệu người dùng đã cập nhật
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? response : "something went wrong",
  });
});

const updateUserAdress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role");
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? response : "something went wrong",
  });
});
//them gio hang
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid } = req.params;
  const { quantity, color, price } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing input");
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (
      alreadyProduct.product.toString() === pid &&
      alreadyProduct.color === color
    ) {
      // Nếu trùng sản phẩm và màu sắc, cộng số lượng mới vào
      const response = await User.updateOne(
        { _id, "cart.product": pid, "cart.$.price": price },
        { $inc: { "cart.$.quantity": quantity } }, // Cộng số lượng mới vào
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedCart: response ? response : "Something went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: pid, quantity, color, price } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedCart: response ? response : "Something went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: pid, quantity, color, price } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedCart: response ? response : "something went wrong",
    });
  }
});

const removeProductInCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, color } = req.params;
  const cartUser = await User.findById(_id).select("cart");
  const alreadyProduct = cartUser?.cart?.find(
    (el) => el.product.toString() === pid && el.color === color
  );
  if (!alreadyProduct)
    return res.status(200).json({
      success: true,
      mes: "updated your cart.",
    });
  else {
    const response = await User.findByIdAndUpdate(
      _id,
      { $pull: { cart: { product: pid, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "updated your cart." : "Some thing went wrong",
    });
  }
});
module.exports = {
  register,
  checkEmailMobile,
  login,
  getCrurrent,
  refeshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  getUsersById,
  updateUserAdress,
  updateCart,
  finalRegister,
  removeProductInCart,
};
