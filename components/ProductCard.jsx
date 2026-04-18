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
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100/60 overflow-hidden hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 transform group-hover:-translate-y-2">
        <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-6">
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
            className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${getPlatformColors(
              product.platform
            )} shadow-sm`}
          >
            {product.platform}
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex flex-col justify-between h-[140px]">
          <h3 className="font-semibold text-slate-800 line-clamp-2 text-[15px] leading-snug group-hover:text-orange-500 transition-colors">
            {product.title}
          </h3>
          
          {(product.trackingCount > 1) && (
            <div className="mt-1 flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${product.trackingCount > 50 ? 'bg-orange-50 text-orange-600 border-orange-200/50' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                🔥 {product.trackingCount} tracking
              </span>
            </div>
          )}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900">
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
