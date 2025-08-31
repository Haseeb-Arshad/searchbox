import type { LoaderFunctionArgs } from "@remix-run/node";

// 1x1 transparent PNG as a placeholder icon (base64)
const PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

export async function loader({}: LoaderFunctionArgs) {
  const body = Buffer.from(PNG_BASE64, "base64");
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

