import React, { useState, useEffect } from "react";
import { ProductCard } from "..";
import { apiGetProducts } from "../../apis";
const FeatureProducts = () => {
  const [products, settProducts] = useState(null);

  const fetchProducts = async () => {
    const response = await apiGetProducts({
      limit: 9,
      page: 1,

      totalRatings: 0,
    });
    if (response.success) settProducts(response.products);
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="w-full ">
      <div className="rounded-lg shadow-lg w-full border bg-gray-50">
        <h3 className="text-[20px] font-semibold py-[15px] border-b-4 border-main ">
          SẢN PHẨM SẮP VỀ
        </h3>
        <div className="flex flex-wrap mt-[15px] mx-[-10px]">
          {products?.map((el) => (
            <ProductCard
              key={el._id}
              image={el.thumb}
              title={el.title}
              totalRatings={el.totalRatings}
              price={el.price}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner1-bottom-home2_b96bc752-67d4-45a5-ac32-49dc691b1958.jpg"
          alt=""
          className="w-full h-full object-cover col-span-2 row-span-2"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner2-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner4-bottom-home2_92e12df0-500c-4897-882a-7d061bb417fd.jpg"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-2"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/1903/4853/files/banner3-bottom-home2_400x.jpg?v=1613166661"
          alt=""
          className="w-full h-full object-cover col-span-1 row-span-1"
        />
      </div>
    </div>
  );
};

export default FeatureProducts;
