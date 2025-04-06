import React, { useState } from "react";
import { formatMoney } from "../../ultils/helpers";
import { renderStarFromNumber } from "../../ultils/helpers";
import  SelectOption from "../Selects/SelectOption";
import icons from "../../ultils/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import withBase from "hocs/withBase";
import { showModal } from "store/appSlice";
import { DetailProduct } from "pages/public";

const { FaRegEye, FaHeart } = icons;
const Product = ({ productData, isNew, normal, navigate, dispatch }) => {
  const [isShowOption, setisShowOption] = useState(false);
  // const handleClickOptions = (e, flag) => {
  //   e.stopPropagation()
  //   if (flag === 'Thêm giỏ hàng') navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
  //   if (flag === 'Sản phẩm yêu thích') console.log('WISHLIST')
  // }
  return (
    <div className="w-full text-base px-[10px]">
      <div
        className="w-full border p-[15px] flex flex-col items-center"
        onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setisShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setisShowOption(false);
        }}
      >
        <div className="w-full relative">
          {isShowOption && (
            <div className=" absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
             {/* <span title='Sản phẩm yêu thích' onClick={(e) => handleClickOptions(e, 'Sản phẩm yêu thích')}> <SelectOption icons={<FaHeart />} /></span>
             <span title='Thêm giỏ hàng' onClick={(e) => handleClickOptions(e, 'Thêm giỏ hàng')}><SelectOption icons={<AiOutlineShoppingCart />} /></span> */}
            </div>
          )}
          <img
            src={
              productData?.images[0] ||
              "https://tse1.mm.bing.net/th?id=OIP.KeKY2Y3R0HRBkPEmGWU3FwHaHa&pid=Api&P=0&h=180"
            }
            alt=""
            className="w-[274px] h-[274px] object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="flex h-4">
            {renderStarFromNumber(productData?.totalRatings)}
          </span>
          <span className="line-clamp-1">{productData?.title}</span>
          <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
        </div>
      </div>
    </div>
  );
};

export default withBase(Product);
