import axios from "../axios";

// API để tạo coupon mới
export const apiCreateCoupon = (data) =>
  axios({
    url: "/coupon",
    method: "post",
    data,
  });

// API để lấy danh sách tất cả coupon
export const apiGetCoupons = () =>
  axios({
    url: "/coupon",
    method: "get",
  });

// API để cập nhật thông tin coupon (dựa trên coupon ID)
export const apiUpdateCoupon = (data, cid) =>
  axios({
    url: "/coupon/" + cid,
    method: "put",
    data,
  });

// API để xóa coupon (dựa trên coupon ID)
export const apiDeleteCoupon = (cid) =>
  axios({
    url: "/coupon/" + cid,
    method: "delete",
  });

// API để áp dụng giảm giá (apply discount)
export const apiApplyDiscount = (data) =>
  axios({
    url: "/coupon/apply-discount",
    method: "post",
    data,
  });
