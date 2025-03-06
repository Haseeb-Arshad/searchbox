export default function Suggestions({ suggestions }) {
    return (
      <div className="my-4">
        <h3 className="text-lg font-semibold">You might also search for:</h3>
        <ul className="mt-2 flex space-x-3 overflow-x-auto">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate(`/search?q=${item}`)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }