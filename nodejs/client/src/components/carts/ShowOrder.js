import withBase from "hocs/withBase";
import React, { memo } from "react";
import { showModal } from "store/appSlice";
import { formatMoney } from "ultils/helpers";
import icons from "ultils/icons";

const { MdOutlineClear } = icons;

const ShowOrder = ({ dataOrder, dispatch, fullName }) => {
  return (
    <div
      className="w-3/5 h-[700px] rounded-md bg-white relative flex flex-col item-center gap-10"
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="absolute text-xl right-0 top-1 cursor-pointer"
        onClick={() =>
          dispatch(showModal({ isShowModal: false, modalChildren: null }))
        }
      >
        <MdOutlineClear />
      </span>
      <h1 className="text-2xl font-bold py-3 text-center border-b">{`Thông chi tiết đơn hàng của ${fullName}`}</h1>
      <table className="table table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>price(VNĐ)</th>
            <th>quantity</th>
            <th>color</th>
          </tr>
        </thead>
        <tbody>
          {dataOrder &&
            dataOrder.map((el) => (
              <tr key={el._id}>
                <td>
                  <img
                    src={el.thumb}
                    alt={`thumb`}
                    className="w-[60px] h-[60px] object-contain rounded-md"
                  />
                </td>
                <td>{formatMoney(el.price)}</td>
                <td>{el.quantity}</td>
                <td>{el.color}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default withBase(memo(ShowOrder));
