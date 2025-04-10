const md5= require("md5")
const User = require("../../model/user.model")
const Cart = require("../../model/cart.model")
const ForgotPassword = require("../../model/forgot-password.model")
const sendMailHelper=require("../../helpers/sendMail")
const generateHelper=require("../../helpers/generate")
// [GET] /user/register
module.exports.register =async (req,res)=>{
    
    res.render('client/pages/user/register',{
        pageTitle:"Đăng ký tài khoản",
    });
}

// [POST] /user/register
module.exports.registerPost =async (req,res)=>{
    const existEmail = await User.findOne({
        email: req.body.email
    })
    if(existEmail){
        req.flash("error","Email đã tồn tại!")
        res.redirect("back")
        return;
    }
    req.body.password=md5(req.body.password)
    const user = new User(req.body);
    await user.save()
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/")
}


// [GET] /user/login
module.exports.login =async (req,res)=>{
    
    res.render('client/pages/user/login',{
        pageTitle:"Đăng nhập tài khoản",
    });
}

// [POST] /user/loginPost
module.exports.loginPost =async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    const remember = req.body.remember
    const user = await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("back")
        return
    }
    if(md5(password)!=user.password){
        req.flash("error","Sai mật khẩu")
        res.redirect("back")
        return
    }
    if(user.status ==="inactive"){
        req.flash("error","Tài khoản đang bị khóa")
        res.redirect("back")
        return
    }
    const cart = await Cart.findOne({
        user_id:user.id
    })
    if(cart){
        res.cookie("cartId",cart.id)
    }else{
        await Cart.updateOne({
            _id:req.cookies.cartId
        },{
            user_id:user.id
        })
    }
    if(remember){
        res.cookie("tokenUser", user.tokenUser, { maxAge: 30 * 24 * 60 * 60 * 1000 });
    }else{
        res.cookie("tokenUser",user.tokenUser)
    }
    

    
    // res.cookie("cartId",cart.id)
    res.redirect("/")

}


// [GET] /user/logout
module.exports.logout =async (req,res)=>{
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/")
}

// [GET] /user/password/forgot
module.exports.forgotPassword =async (req,res)=>{
    res.render('client/pages/user/forgot-password',{
        pageTitle:"Quên mật khẩu",
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost =async (req,res)=>{
    const email =req.body.email
    const user = await User.findOne({
        email:email,
        deleted:false
    })
    if(!user){
        req.flash("error","Email không tồn tại")
        res.redirect("back")
        return
    }
    const otp =generateHelper.generateRandomNumber(8)
    const objectForgotPassword={
        email:email,
        otp:otp,
        expireAt: Date.now() + 600000
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

   //GỬi mã otp qua email
    const subject = "Mã xác thực OTP lấy lại mật khẩu"
    const html = `Mã otp để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 10p`
    sendMailHelper.sendMail(email,subject,html);
    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword =async (req,res)=>{
    const email= req.query.email
    res.render('client/pages/user/otp-password',{
        pageTitle:"Nhập mã OTP",
        email:email
    });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost =async (req,res)=>{
    const email= req.body.email
    const otp= req.body.otp

    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })
    if(!result){
        req.flash("error","OTP không hợp lệ")
        res.redirect("back")
        return
    }

    const user = await User.findOne({
        email:email
    })
    res.cookie("tokenUser",user.tokenUser)
    res.redirect("/user/password/reset")
}
  


// [Get] /user/password/reset
module.exports.resetPassword =async (req,res)=>{
    
    res.render('client/pages/user/reset-password',{
        pageTitle:"Đổi mật khẩu",
    });
}


// [POST] /user/password/reset
module.exports.resetPasswordPost =async (req,res)=>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser:tokenUser
    },{
        password:md5(password)
    })
    req.flash("success","Đổi mật khẩu thành công")
    res.redirect("/")
}


// [Get] /user/info
module.exports.info =async (req,res)=>{
    const userInfo = await User.findOne({
        tokenUser:req.cookies.tokenUser,
        deleted:false,
        status:"active"
    })
    userInfo.password = md5(userInfo.password)
    res.render('client/pages/user/info',{
        pageTitle:"Thông tin cá nhân",
        userInfo:userInfo
    });
}

// [Get] /user/changePasword
module.exports.changePassword =async (req,res)=>{
    const userInfo = await User.findOne({
        tokenUser:req.cookies.tokenUser,
        deleted:false,
        status:"active"
    })
    userInfo.password = md5(userInfo.password)
    res.render('client/pages/user/change-password',{
        pageTitle:"Đổi mật khẩu",
        userInfo:userInfo
    });
}

// [POST] /user/changePasword
module.exports.changePasswordPost =async (req,res)=>{
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userInfo = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false,
        status: "active"
    });
    if (md5(currentPassword) !== userInfo.password) {
        req.flash("error","Mật khẩu hiện tại không đúng")
        return res.redirect("back")
    }
    if (newPassword !== confirmPassword) {
        req.flash("error","Mật khẩu mới không khớp.")
        return res.redirect("back")
    }
    userInfo.password = md5(newPassword);
    await userInfo.save();
    req.flash("success","Đổi mật khẩu thành công.")
    res.redirect("/")
}