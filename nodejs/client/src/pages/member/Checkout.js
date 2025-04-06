import withBase from "hocs/withBase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "ultils/path";
import Payment from "assets/payment.gif";
import { Link } from "react-router-dom";
import { CheckOutOption, PayPal } from "components";

const CheckOut = ({ navigate }) => {
  const { isLoggedIn, currentCart, current } = useSelector(
    (state) => state.user
  );
  const [address, setAddress] = useState(current?.address || "");

  useEffect(() => {
    if (!isLoggedIn)
      Swal.fire(
        "Oops!",
        "Đăng nhập để thực hiện thao tác này!",
        "warning"
      ).then(() => navigate(`/${path.LOGIN}`));
  }, [isLoggedIn]);

  return (
    <div className="w-main mx-auto grid grid-cols-10 gap-6">
      <div className="w-full flex items-center justify-center col-span-4"></div>
      <div className="fixed w-[473px] h-full">
        <Link
          to={`/${path.HOME}`}
          className="py-2 text-lg w-full flex items-center justify-start text-sky-500 hover:underline hover:text-orange-500 transition-all"
        >
          Quay lại trang chủ
        </Link>
        <img
          src={Payment}
          alt="Payment"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="col-span-6 flex flex-col items-center gap-6">
        <div className="h-[115px]"></div>
        <div className="fixed bg-white z-10 w-[722px]">
          <h1 className="flex justify-between items-center text-xl font-semibold border-b border-gray-300 px-[30px] py-[39px]">
            <span className="uppercase">kiểm tra đơn đặt hàng của bạn</span>
          </h1>
        </div>
        <div className="w-full flex flex-col gap-6">
          <CheckOutOption cartData={currentCart} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <label>Địa chỉ:</label>
              <input
                type="text"
                placeholder="nhập địa chỉ nhận hàng..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
        {address ? (
          <div className="w-full flex flex-col gap-5 justify-center">
            <label className="label label-text">Thanh toán bằng:</label>
            <PayPal
              payload={{
                products: currentCart,
                total: Math.round(
                  +currentCart?.reduce(
                    (sum, el) => sum + Number(el.quantity) * Number(el.price),
                    0
                  ) / 23500
                ),
                address,
              }}
              amount={Math.round(
                +currentCart?.reduce(
                  (sum, el) => sum + Number(el.quantity) * Number(el.price),
                  0
                ) / 23500
              )}
            />
          </div>
        ) : (
          <span>Bạn chưa có địa chỉ nhận hàng</span>
        )}
      </div>
    </div>
  );
};

export default withBase(CheckOut);
