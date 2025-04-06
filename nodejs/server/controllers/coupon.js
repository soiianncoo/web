const mongoose = require("mongoose");
const Coupon = require("../models/coupon");
const Product = require("../models/product"); // Schema của sản phẩm
const asyncHandler = require("express-async-handler");

// API tạo mã giảm giá
const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("missing input");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: !!response,
    createCoupon: response || "Can't create new coupon",
  });
});

// API lấy danh sách mã giảm giá
const getCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createdAt -updatedAt");
  return res.json({
    success: !!response,
    coupons: response || "Can't get coupons",
  });
});

// API cập nhật mã giảm giá
const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("missing input");
  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  }
  const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
  return res.json({
    success: !!response,
    updateCoupon: response || "Can't update coupon",
  });
});

// API xóa mã giảm giá
const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  return res.json({
    success: !!response,
    deleteCoupon: response || "Can't delete coupon",
  });
});

// API áp dụng giảm giá cho sản phẩm
const applyDiscount = asyncHandler(async (req, res) => {
  const { productId, couponName } = req.body;

  if (!productId || !couponName) {
    throw new Error("Missing productId or couponName");
  }

  // Kiểm tra mã giảm giá
  const coupon = await Coupon.findOne({ name: couponName });
  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid coupon code",
    });
  }

  // Kiểm tra mã giảm giá còn hiệu lực
  if (new Date(coupon.expiry) < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Coupon has expired",
    });
  }

  // Áp dụng giảm giá cho sản phẩm
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Tính giá sau giảm
  const discountedPrice = product.price - (product.price * coupon.discount) / 100;

  // Cập nhật giá và gắn thông tin giảm giá tạm thời
  product.discount = coupon.discount;
  product.discountedPrice = discountedPrice;
  product.discountExpiry = coupon.expiry;

  const updatedProduct = await product.save();

  return res.json({
    success: true,
    message: "Discount applied successfully",
    product: updatedProduct,
  });
});

module.exports = {
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyDiscount,
};
