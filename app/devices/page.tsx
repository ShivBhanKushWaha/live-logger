"use client";
import { useEffect, useState } from "react";

export default function DevicesPage() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 logs se device uthao
  useEffect(() => {
    const device = localStorage.getItem("selectedDevice");
    if (device) setSearch(device);
  }, []);

  // 🔍 API search
  useEffect(() => {
    if (!search) return;

    const delay = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/search?q=${search}`);
        const data = await res.json();

        setImages(
          data.items?.map((item: any) => item.link) || []
        );
      } catch {
        setImages([]);
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-lg mb-4">📱 Device Explorer</h1>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search device..."
        className="w-full p-3 mb-6 rounded bg-zinc-900"
      />

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* IMAGES */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="rounded-xl h-40 w-full object-cover"
          />
        ))}
      </div>

      {!loading && images.length === 0 && search && (
        <p>No results</p>
      )}
    </div>
  );
}