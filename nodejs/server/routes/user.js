const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
router.post("/register", ctrls.register);
router.post("/check-email-mobile", ctrls.checkEmailMobile);
router.get("/finalregister/:token", ctrls.finalRegister);
router.post("/login", ctrls.login);
router.get("/current", [verifyAccessToken], ctrls.getCrurrent);
router.post("/refreshtoken", ctrls.refeshAccessToken);
router.get("/logout", [verifyAccessToken], ctrls.logout);
router.post("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.put("/current", [verifyAccessToken], uploader.single('avatar') , ctrls.updateUser);
router.put("/address/", [verifyAccessToken, isAdmin], ctrls.updateUserAdress);
router.put("/cart/:pid", [verifyAccessToken], ctrls.updateCart);
router.delete(
  "/remove-cart/:pid/:color",
  [verifyAccessToken],
  ctrls.removeProductInCart
);
router.delete("/:uid", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.get("/:uid", [verifyAccessToken, isAdmin], ctrls.getUsersById);
router.put("/:uid", [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);

module.exports = router;

//CRUD | Create - read- update - delete | post - get - update - delete
