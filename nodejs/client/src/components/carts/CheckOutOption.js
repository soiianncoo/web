import React, { memo } from "react";
import { formatMoney } from "ultils/helpers";
import noImage from "assets/logo-image.jpg";

const CheckOutOption = ({ cartData }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <table className="table table-zebra border max-h-[700px] hover:overflow-y-auto">
        <thead>
          <tr className="bg-gray-100">
            <th></th>
            <th></th>
            <th>Giá tiền(VND)</th>
            <th>Thành tiền(VND)</th>
          </tr>
        </thead>
        <tbody>
          {cartData &&
            cartData.length > 0 &&
            cartData.map((el) => (
              <tr key={el._id}>
                <td>
                  <div className="w-[50px] h-[50px]">
                    <img
                      src={el.product.thumb || noImage}
                      alt={el.product?.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </td>
                <td>
                  <span className="flex flex-col items-start capitalize gap-1">
                    <span className="font-semibold line-clamp-1">
                      {el.product?.title?.toLowerCase()}
                    </span>
                    <span className="flex items-center text-xs gap-2">
                      <span>{`màu: ${el.color?.toLowerCase()}`}</span>
                      <span>/</span>
                      <span>{`số lương: ${el.quantity}`}</span>
                    </span>
                  </span>
                </td>
                <td>
                  <span>{`${formatMoney(el.price)}`}</span>
                </td>
                <td>
                  <span>{`${formatMoney(el.quantity * el.price)}`}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-3">
        <span>Tổng tiền:</span>
        <span className="font-semibold text-main">{`${formatMoney(
          cartData?.reduce(
            (sum, el) => sum + Number(el.quantity) * Number(el.price),
            0
          )
        )} VND`}</span>
      </div>
    </div>
  );
};

export default memo(CheckOutOption);
