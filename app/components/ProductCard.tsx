import { Link } from "@remix-run/react";

interface Product {
  id: string;
  title: string;
  image: string;
  storeName: string;
  likes?: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        {product.likes !== undefined && (
          <div className="absolute top-2 right-2">
            <span className="bg-white px-2 py-1 rounded-full text-sm">
              ❤️ {product.likes}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-sm text-blue-600">{product.storeName}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-2 inline-block text-sm text-blue-500 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}