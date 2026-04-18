import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function ProductCard({ product }) {
  const getPlatformColors = (platform) => {
    switch (platform) {
      case "Amazon":
        return "bg-slate-900 text-[#FF9900]";
      case "Flipkart":
        return "bg-[#2874F0] text-[#FFE500]";
      case "Meesho":
        return "bg-[#F43397] text-white";
      case "Ajio":
        return "bg-[#2C4152] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Link href={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
        <div className="relative aspect-square bg-white flex items-center justify-center p-4">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-gray-300">No Image</div>
          )}
          <div
            className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-wider ${getPlatformColors(
              product.platform
            )} shadow-sm`}
          >
            {product.platform}
          </div>
        </div>
        <div className="p-4 border-t border-gray-50 flex flex-col justify-between h-32">
          <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm leading-snug group-hover:text-orange-500 transition-colors">
            {product.title}
          </h3>
          
          {(product.trackingCount > 1) && (
            <div className="mt-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-none border ${product.trackingCount > 50 ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                🔥 {product.trackingCount} tracking
              </span>
            </div>
          )}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {formatCurrency(product.currentPrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-xs text-green-600 font-medium">
                Drop!
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
