import React, { memo } from "react";
import { Button, OrderItem } from "components";
import { formatMoney } from "ultils/helpers";
import icons from "ultils/icons";
import withBase from "hocs/withBase";
import { getCurrent } from "store/user/asyncActions";
import path from "ultils/path";
import * as apis from "apis";

const { HiArrowLongRight } = icons;

const CartProduct = ({ carts, dispatch, navigate }) => {
  // UPDATE CART
  const handleCheckOut = async () => {
    const promises = [];
    for (let cart of carts)
      promises.push(
        apis.apiUpdateCart(
          {
            pid: cart?.product?._id,
            color: cart?.color,
            price: cart?.price,
            thumb: cart?.product?.thumb,
            quantity: cart?.quantity,
          },
          cart?.product._id
        )
      );
    const response = await Promise.all(promises);
    if (response[0].success) {
      dispatch(getCurrent());
      navigate(`/${path.CHECKOUT}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5  bg-gray-100">
      <table className="table border">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Số lượng</th>
            <th>Giá tiền</th>
            <th className="w-[210px]">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((el) => (
            <OrderItem key={el?._id} cart={el} defaultQuantity={el.quantity} />
          ))}
        </tbody>
      </table>
      <div className="w-full flex flex-col justify-center items-end">
        <div className="flex flex-col justify-end items-end gap-4">
          <div className="flex items-center gap-5 text-xl">
            <span>Tổng tiền: </span>
            <span className="font-semibold">{`${formatMoney(
              carts?.reduce(
                (sum, el) => sum + Number(el.quantity) * Number(el.price),
                0
              )
            )} VND`}</span>
          </div>
          <span className="text-sm text-gray-500 italic">
            Phí vận chuyển, thuế và chiết khấu được tính khi thanh toán
          </span>
          <div className="flex items-center gap-2">
            <Button
              name={"thanh toán"}
              iconAfter={<HiArrowLongRight size={20} />}
              styles={"border-main whitespace-nowrap"}
              handleOnclick={handleCheckOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(memo(CartProduct));
