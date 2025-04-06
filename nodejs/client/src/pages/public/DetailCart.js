import React from "react";
import { Breadcrumb, CartProduct } from "components";
import { useSelector } from "react-redux";
import noProduct from "assets/no-product.png";
import { Link } from "react-router-dom";
import path from "ultils/path";
import withBase from "hocs/withBase";

const DetailCart = () => {
  const { current } = useSelector((state) => state.user);

  return (
    <div className="w-main mx-auto  bg-gray-100">
      <div className="flex flex-col gap-4 mb-5">
        <h1 className="uppercase text-xl font-semibold">Giỏ hàng của bạn</h1>
        <Breadcrumb category={"giỏ hàng của bạn"} />
      </div>
      {current && current?.cart?.length > 0 ? (
        <CartProduct carts={current.cart} />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h3 className="capitalize text-xl font-medium py-5 border-b border-black">
            giỏ hàng của bạn
          </h3>
          <img
            src={noProduct}
            alt="No product"
            className="w-[300px] h-full object-contain"
          />
          <span className="text-gray-500">
            Xem sản phẩm{" "}
            <Link
              to={`/${path.PRODUCTS}`}
              className="hover:text-main transition-all"
            >
              ở đây
            </Link>
            .
          </span>{" "}
        </div>
      )}
    </div>
    // <div className="w-full">
    //   <div className=" h-[81px] flex justify-center items-center font-semibold bg-gray-100">
    //     <div className="w-main">
    //       <h3 className="font-semibold uppercase">Giỏ hàng của bạn</h3>
    //       <Breadcrumb category={"giỏ hàng của bạn"} />
    //     </div>
    //   </div>
    //   <div className="w-main mx-auto font-bold my-8 border py-3 grid grid-cols-10">
    //     <span className="col-span-6 w-full text-center">Sản phẩm</span>
    //     <span className="col-span-1 w-full text-center">Số lượng</span>
    //     <span className="col-span-3 w-full text-center">Giá</span>
    //   </div>
    //   {current?.cart?.map((el) => (
    //     <div
    //       key={el.id}
    //       className="w-main mx-auto font-bold my-8 border py-3 grid grid-cols-10"
    //     >
    //       <span className="col-span-6 w-full text-center">
    //         <div className="flex gap-2">
    //           <img
    //             src={el.product?.thumb}
    //             alt="thumb"
    //             className="w-16 h-16 object-cover"
    //           />
    //           <div className="flex flex-col gap-1">
    //             <span className="text-sm text-main">{el.product?.title}</span>
    //             <span className="text-[10px]">{el.color}</span>
    //             <span className="text-sm">{formatMoney(el.product?.price) + }</span>
    //           </div>
    //         </div>
    //       </span>
    //       <span className="col-span-1 w-full text-center">Số lượng</span>
    //       <span className="col-span-3 w-full text-center">Giá</span>
    //     </div>
    //   ))}
    // </div>
  );
};

export default withBase(DetailCart);
