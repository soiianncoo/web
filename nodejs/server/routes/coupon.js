const router = require("express").Router();
const ctrls = require("../controllers/coupon");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

// Route dành cho coupon
router.post("/", [verifyAccessToken, isAdmin], ctrls.createCoupon);
router.get("/", ctrls.getCoupon);
router.put("/:cid", [verifyAccessToken, isAdmin], ctrls.updateCoupon);
router.delete("/:cid", [verifyAccessToken, isAdmin], ctrls.deleteCoupon);

// Route áp dụng giảm giá cho sản phẩm
router.post("/apply-discount", [verifyAccessToken], ctrls.applyDiscount);

module.exports = router;
