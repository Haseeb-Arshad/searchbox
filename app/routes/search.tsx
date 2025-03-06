// app/routes/search.tsx
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  title: string;
  image: string;
  storeName: string;
  likes?: number;
}

interface LoaderData {
  results: Product[];
  query: string | null;
  error?: string;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return json<LoaderData>({ results: [], query: null });
  }

  try {
    const response = await fetch(`http://localhost:8080/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
    }

    const results = await response.json();
    
    // Ensure results is always an array
    return json<LoaderData>({ 
      results: Array.isArray(results) ? results : [], 
      query 
    });

  } catch (error: any) {
    console.error("Detailed error:", error.message);
    return json<LoaderData>({
      results: [],
      query,
      error: `Unable to load results. Error: ${error.message}`,
    }, { status: 500 });
  }
};

export default function SearchResults() {
  const { results = [], query, error } = useLoaderData<LoaderData>();

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // Handle case where no query was provided
  if (!query) {
    return <div className="p-6 text-center">Enter a search term to begin</div>;
  }

  return (
    <main className="px-8 py-10">
      <h2 className="text-3xl font-bold mb-8">Results for "{query}"</h2>
      {results.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No products found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
