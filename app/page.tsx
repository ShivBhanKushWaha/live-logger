"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLogType } from "./utils/getLogType";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isPaused, setIsPaused] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (i: number) => {
    setExpanded(prev => ({
      ...prev,
      [i]: !prev[i],
    }));
  };

  // 🔥 SAFE stringify (no crash)
  const getLogString = (log: any) => {
    try {
      return JSON.stringify(log, null, 2);
    } catch {
      return "Invalid JSON";
    }
  };

  // 🔥 scroll detect
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setIsAtTop(el.scrollTop < 50);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 polling
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/log");
        const data = await res.json();

        if (!data?.length) return;

        const reversed = [...data].reverse();
        setLogs(reversed);

        if (containerRef.current && isAtTop) {
          containerRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isAtTop]);

  const handleSendToDevice = (log: any) => {
    const device =
      log.deviceName || log.device || log.userAgent || "Unknown Device";

    localStorage.setItem("selectedDevice", device);
    router.push("/devices");
  };

  const handleClear = () => {
    setLogs([]);
    setExpanded({});
    setIsPaused(true);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white font-mono">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h1 className="text-lg font-semibold">⚡ Live Logs</h1>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-600 rounded text-sm"
          >
            Clear
          </button>

          <button
            onClick={() => setIsPaused(false)}
            className="px-3 py-1 bg-green-600 rounded text-sm"
          >
            Resume
          </button>
        </div>
      </div>

      {/* LOG LIST */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.map((log, i) => {
          const isLatest = i === 0;
          const type = getLogType(log);
          const isOpen = expanded[i];

          const logString = getLogString(log); // ✅ FIX
          const size = logString.length;

          const previewLimit = size > 5000 ? 500 : 1000;

          const styles =
            type === "error"
              ? "border-red-500 bg-red-500/10"
              : type === "warn"
              ? "border-yellow-500 bg-yellow-500/10"
              : isLatest
              ? "border-green-500 bg-green-500/10"
              : "bg-[#1a1a1a] border-zinc-800";

          return (
            <div key={i} className={`p-3 rounded-lg border ${styles}`}>

              {/* HEADER */}
              <div className="flex justify-between items-center mb-2 text-xs text-zinc-400">
                <span>
                  {isLatest && type === "normal" ? "🟢 Latest " : ""}
                  {type === "error" ? "🔴 Error " : ""}
                  {type === "warn" ? "🟡 Warn " : ""}
                  [{log.time || "no-time"}]
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendToDevice(log)}
                    className="px-2 py-1 bg-blue-600 rounded"
                  >
                    Device
                  </button>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(logString)
                    }
                    className="px-2 py-1 bg-zinc-700 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={() => toggleExpand(i)}
                  className="text-xs px-2 py-1 bg-purple-600 rounded"
                >
                  {isOpen ? "Collapse" : "Expand"}
                </button>

                <span className="text-xs text-zinc-500">
                  {Math.round(size / 1024)} KB
                </span>
              </div>

              {/* LARGE WARNING */}
              {size > 8000 && (
                <span className="text-red-400 text-xs block mb-2">
                  ⚠ Large payload (expand carefully)
                </span>
              )}

              {/* CONTENT */}
              <pre className="text-sm whitespace-pre-wrap wrap-break-words">
                {isOpen
                  ? logString
                  : logString.slice(0, previewLimit) +
                    (size > previewLimit ? "\n... (expand)" : "")}
              </pre>
            </div>
          );
        })}

        {!logs.length && (
          <div className="text-center text-zinc-500 mt-10">
            No logs available
          </div>
        )}
      </div>

      {/* FLOAT BUTTON */}
      {!isAtTop && (
        <button
          onClick={() =>
            containerRef.current?.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="fixed bottom-5 right-5 bg-blue-600 px-3 py-2 rounded shadow-lg"
        >
          ↑ Latest
        </button>
      )}
    </div>
  );
}