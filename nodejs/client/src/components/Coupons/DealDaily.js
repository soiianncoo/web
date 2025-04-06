import React, { useState, useEffect, memo } from "react";
import { apiGetProducts } from "../../apis/product";
import { renderStarFromNumber } from "../../ultils/helpers";
import Countdown from "./Countdown";
import Product from "../products/Product";
import icons from "../../ultils/icons";

const { AiFillStar } = icons;

const DealDaily = () => {
  const [dealdaily, setDealdaily] = useState(null);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const fetchDealDaily = async () => {
    try {
      const response = await apiGetProducts({ limit: 1 });
      if (response.success) {
        setDealdaily(response.products[0]);
        const h = 24 - new Date().getHours();
        const m = 60 - new Date().getMinutes();
        const s = 60 - new Date().getSeconds();
        setHour(h);
        setMinute(m);
        setSecond(s);
      }
    } catch (error) {
      console.error("Failed to fetch deal daily", error);
      setHour(0);
      setMinute(59);
      setSecond(59);
    }
  };

  useEffect(() => {
    fetchDealDaily();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (second > 0) {
        setSecond((prev) => prev - 1);
      } else if (minute > 0) {
        setMinute((prev) => prev - 1);
        setSecond(59);
      } else if (hour > 0) {
        setHour((prev) => prev - 1);
        setMinute(59);
        setSecond(59);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hour, minute, second]);

  return (
    <div className="border rounded-lg shadow-lg w-full flex-auto bg-gray-50">
      <div className="flex items-center justify-between p-4 w-full">
        <span className="flex-1 flex justify-center">
          <AiFillStar size={20} color="#DD1111" />
        </span>
        <span className="flex-8 font-semibold text-[20px] flex justify-center text-gray-700">
          ƯU ĐÃI
        </span>
        <span className="flex-1"></span>
      </div>
      <div className="w-full flex flex-col items-center pt-8 px-4 gap-2">
        {dealdaily && (
          <>
            <Product productData={dealdaily} />
          </>
        )}
      </div>
      <div className="px-4 mt-8">
        <div className="flex justify-center gap-2 items-center mb-4">
          <Countdown unit={"Giờ"} number={hour} />
          <Countdown unit={"Phút"} number={minute} />
          <Countdown unit={"Giây"} number={second} />
        </div>
      </div>
    </div>
  );
};

export default memo(DealDaily);
 