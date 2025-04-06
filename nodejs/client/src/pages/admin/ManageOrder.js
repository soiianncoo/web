import React, { useEffect, useState } from "react";
import * as apis from "apis";
import NoProduct from "assets/no-product.png";
import moment from "moment";
import { showModal } from "store/appSlice";
import withBase from "hocs/withBase";
import { Button, Select, ShowOrder } from "components";
import { formatMoney } from "ultils/helpers";
import icons from "ultils/icons";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const { FaRegEdit, IoMdClose } = icons;

const options = [
  { code: "Cancelled", value: "Hủy bỏ" },
  { code: "Processing", value: "Đang chờ" },
  { code: "Succeed", value: "Hoàn tất" },
];

const ManagerOrder = ({ dispatch }) => {
  const [orders, setOrders] = useState(null);
  const [editElm, setEditElm] = useState(null);
  const [update, setUpdate] = useState(false);

  const handleGetAllOrders = async (queries) => {
    const response = await apis.apiGetAllOrder(queries);
    if (response.success) setOrders(response.response);
  };

  const rerender = () => setUpdate((prev) => !prev);

  useEffect(() => {
    handleGetAllOrders();
  }, [update]);

  return (
    <div className="w-full">
      <div className="h-[115px]"></div>
      {editElm && (
        <EditStatus
          setEditElm={setEditElm}
          editElm={editElm}
          rerender={rerender}
        />
      )}
      <div className="fixed z-10 bg-gray-50 top-0 w-full">
        <h1 className="flex justify-between items-center text-3xl font-semibold border-b px-[30px] py-[39px]">
          <span className="uppercase">quản lý đơn hàng</span>
        </h1>
      </div>
      <div className="w-full py-4 px-10 flex flex-col gap-10">
        {orders ? (
          <table className="table-auto mb-6 text-left w-full">
            <thead className="font-bold bg-gray-700 text-[15px] text-white">
              <tr className="border border-gray-500">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Họ và tên</th>
                <th className="px-4 py-2 max-w-[500px]">Địa chỉ</th>
                <th className="px-4 py-2">Số lượng</th>
                <th className="px-4 py-2">Giá (VNĐ)</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Ngày đặt</th>
                <th className="px-4 py-1">Hành động</th>
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
                        el.status === "Succeed" && "text-green-500"
                      } ${el.status === "Processing" && "text-orange-500"} ${
                        el.status === "Cancelled" && "text-red-500"
                      }`}
                    >
                      {
                        options.find((option) => el.status === option.code)
                          .value
                      }
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {moment(el.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td className="flex gap-2 capitalize text-blue-500 px-2 py-1 text-center">
                    <span
                      title="Sửa sản phẩm"
                      className="hover:underline cursor-pointer text-lg text-yellow-500 px-2"
                      onClick={() => setEditElm(el)}
                    >
                      <FaRegEdit />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col gap-5 justify-center items-center p-20">
            <img
              src={NoProduct}
              alt="No Products"
              className="w-[300px] object-contain opacity-60"
            />
            <span className="text-xl flex font-semibold opacity-60">
              Chưa có đơn nào
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default withBase(ManagerOrder);

const EditStatus = ({ setEditElm, editElm, rerender }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleStatus = async (data) => {
    const response = await apis.apiUpdateOrder(editElm._id, data);
    if (response.success)
      Swal.fire({
        icon: "success",
        title: "Cập nhập trạng thái.",
        text: "Cập nhập trạng thái thành công.",
      }).then(() => {
        rerender();
        setEditElm(null);
      });
    else
      Swal.fire({
        icon: "error",
        title: "Cập nhập trạng thái.",
        text: "Cập nhập trạng thái thất bại.",
      });
  };

  useEffect(() => {
    if (editElm) reset({ status: editElm.status });
  }, [editElm]);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-20 flex justify-center items-center">
      <div className="size-1/3 bg-white flex flex-col gap-4 p-4 rounded-md relative animate-scale-in-center">
        <span
          onClick={() => setEditElm(null)}
          className="absolute top-1 right-1 text-2xl cursor-pointer"
        >
          <IoMdClose />
        </span>
        <h1 className="text-2xl font-bold text-center">
          Cập nhập trạng thái đơn hàng
        </h1>
        <form onSubmit={handleSubmit(handleStatus)} className="space-y-5">
          <Select
            register={register}
            id={"status"}
            options={options}
            errors={errors}
            wf
            validate={{ required: "Điền thông tin bắt buộc." }}
            label={"Cập nhật trạng thái"}
            classSelect={"rounded-md"}
          />
          <Button type="submit" name={"Cập nhật"} fw />
        </form>
      </div>
    </div>
  );
};
