const router = require("express").Router();
const ctrls = require("../controllers/orders");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken], ctrls.createOrder);
router.get("/", [verifyAccessToken], ctrls.getUserOder);
router.get("/admin", [verifyAccessToken, isAdmin], ctrls.getOrder);

router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrls.updateStatus);

module.exports = router;
