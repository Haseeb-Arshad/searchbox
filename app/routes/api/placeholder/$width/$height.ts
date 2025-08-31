import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const width = Math.max(1, Math.min(2000, parseInt(params.width || "300", 10)));
  const height = Math.max(1, Math.min(2000, parseInt(params.height || "300", 10)));

  const bg = "#e5e7eb"; // zinc-200
  const fg = "#6b7280"; // zinc-500

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.floor(Math.min(width, height) / 6)}">
    ${width}×${height}
  </text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

