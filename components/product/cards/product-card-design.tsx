import Image, { StaticImageData } from "next/image";
import React, { memo } from "react";

interface ProductCardDesignProps {
  imageSrc: StaticImageData | string;
  category: string;
  price: number;
  soldPercent: number;
  onClick?: () => void;
}

export const ProductCardDesign: React.FC<ProductCardDesignProps> = memo(({
  imageSrc,
  category,
  price,
  soldPercent,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 w-[290px] flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="w-[200px] h-[140px] relative mb-4">
        <Image
          src={imageSrc}
          alt={category}
          fill
          sizes="(max-width: 768px) 100vw, 290px"
          style={{ objectFit: "contain" }}
          className="rounded-lg"
        />
      </div>
      <div className="text-[#004AAD] text-base font-medium mb-1 text-center">{category}</div>
      <div className="text-[#004AAD] text-2xl font-bold mb-4 text-center">Starting at ₹{price}</div>
      <div className="w-full flex flex-col items-center">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-[#004AAD] rounded-full transition-all duration-500"
            style={{ width: `${soldPercent}%` }}
          ></div>
        </div>
        <div className="text-[#004AAD] text-sm font-semibold text-right w-full">{soldPercent}% sold</div>
      </div>
    </div>
  );
});

ProductCardDesign.displayName = "ProductCardDesign";