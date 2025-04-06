import { ShowOrder } from "components";
import React, { useEffect, useState } from "react";
import NoProduct from "assets/no-product.png";
import * as apis from "apis";
import { formatMoney } from "ultils/helpers";
import moment from "moment";
import { showModal } from "store/appSlice";
import withBase from "hocs/withBase";

const History = ({ dispatch }) => {
  const [orders, setOrders] = useState(null);

  const fetchGetAllUsers = async () => {
    const response = await apis.apiGetOrderUsers();
    if (response.success) setOrders(response.response);
  };

  useEffect(() => {
    fetchGetAllUsers();
  }, []);

  return (
    <div className="w-full pb-10">
      <div className="w-full h-full bg-[#f6f6f6]">
        <div className="w-main mx-auto py-20 flex items-center">
          <span className="text-xl uppercase font-semibold">
            Lịch sử mua hàng
          </span>
        </div>
      </div>
      {orders ? (
        <div className="w-main mx-auto">
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[15px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Tên người nhận</th>
                <th className="px-4 py-2 max-w-[500px]">Địa chỉ nhận hàng</th>
                <th className="px-4 py-2">Danh sách sản phẩm</th>
                <th className="px-4 py-2">Tổng tiền (VNĐ)</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((el, idx) => (
                <tr key={el._id} className="border border-gray-500">
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">{`${el.orderby.firstname} ${el.orderby.lastname}`}</td>
                  <td className="py-2 px-4">
                    <span className="line-clamp-1">{el.orderby.address}</span>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className="hover:underline hover:text-sky-500 transition-all cursor-pointer"
                      onClick={() =>
                        dispatch(
                          showModal({
                            isShowModal: true,
                            modalChildren: (
                              <ShowOrder
                                dataOrder={el.products}
                                fullName={`${el.orderby.firstname} ${el.orderby.lastname}`}
                              />
                            ),
                          })
                        )
                      }
                    >{`${el.products.length} sản phẩm`}</span>
                  </td>
                  <td className="py-2 px-4">{formatMoney(el.total)}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`font-semibold ${
                        el.status === "Successed"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    >
                      {el.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-center items-center p-20">
          <img
            src={NoProduct}
            alt="No Products"
            className="w-[300px] object-contain opacity-60"
          />
          <span className="text-xl flex font-semibold opacity-60">
            Không có đơn nào
          </span>
        </div>
      )}
    </div>
  );
};

export default withBase(History);
