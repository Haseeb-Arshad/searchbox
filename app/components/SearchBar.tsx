
import { useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl">
      <input
        className="w-full py-3 px-5 rounded-full shadow-lg border border-gray-300 outline-none transition-shadow focus:ring-2 focus:ring-blue-400"
        placeholder="Search for products, stores..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}