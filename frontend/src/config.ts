const base =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : import.meta.env.VITE_PDF_BASE_URL;

if (!base) {
  console.warn("⚠️ Missing VITE_PDF_BASE_URL in environment");
}

export const PDF_BASE_URL = base.replace(/\/+$/, "");