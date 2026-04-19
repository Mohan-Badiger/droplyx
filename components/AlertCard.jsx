import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Edit2, Check, X, Bell } from "lucide-react";

export default function AlertCard({ alert, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(alert.targetPrice);
  const [loading, setLoading] = useState(false);

  const product = alert.product;
  if (!product) return null;

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

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(alert._id, product._id, editPrice);
    setLoading(false);
    setIsEditing(false);
  };

  const isTriggered = alert.status === "triggered" || product.currentPrice <= alert.targetPrice;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100/60 overflow-hidden relative group hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
      <Link href={`/product/${product._id}`} className="block">
        <div className="relative aspect-[16/9] bg-slate-50 flex items-center justify-center p-4">
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
      </Link>

      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(!isEditing);
          }}
          className="p-2 rounded-full bg-white/70 hover:bg-orange-50 text-slate-400 hover:text-orange-500 hover:shadow-lg backdrop-blur-md border border-white transition-all duration-300"
          title="Edit target price"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(alert._id);
          }}
          className="p-2 rounded-full bg-white/70 hover:bg-red-50 text-slate-400 hover:text-red-500 hover:shadow-lg backdrop-blur-md border border-white transition-all duration-300"
          title="Delete alert"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-5 border-t border-slate-100">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-slate-800 line-clamp-2 text-[14px] leading-snug hover:text-orange-500 transition-colors cursor-pointer mb-3">
            {product.title}
          </h3>
        </Link>
        
        {isEditing ? (
          <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-2">
            <input 
              type="number" 
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm outline-none font-bold text-slate-700"
              autoFocus
            />
            <button onClick={handleSave} disabled={loading} className="px-3 bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center">
              <Check size={16} />
            </button>
            <button onClick={() => setIsEditing(false)} className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-end justify-between mt-1">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current</p>
              <p className="text-lg font-bold text-slate-900">{formatCurrency(product.currentPrice)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-end gap-1">
                <Bell size={10} /> Target
              </p>
              <p className={`text-lg font-bold ${isTriggered ? 'text-green-600' : 'text-orange-500'}`}>
                {formatCurrency(alert.targetPrice)}
              </p>
            </div>
          </div>
        )}

        {isTriggered && !isEditing && (
          <div className="mt-3 bg-green-50 text-green-700 border border-green-200 rounded-xl px-3 py-1.5 text-xs font-bold flex justify-center items-center gap-1 shadow-sm">
            <Check size={14} /> Target Reached!
          </div>
        )}
      </div>
    </div>
  );
}
