"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [latestLog, setLatestLog] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 🔥 POLLING (Vercel compatible)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/log");
        const data = await res.json();

        setLogs(data);
        setLatestLog(data[data.length - 1]);

        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } catch {}
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 send to /devices
  const handleSendToDevice = (log: any) => {
    const device =
      log.deviceName ||
      log.device ||
      log.userAgent ||
      "Unknown Device";

    localStorage.setItem("selectedDevice", device);
    router.push("/devices");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-mono p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">⚡ Live Logs</h1>

        <button
          onClick={() => setLogs([])}
          className="px-3 py-1 bg-red-600 rounded text-sm"
        >
          Clear UI
        </button>
      </div>

      {/* 🔥 LATEST LOG */}
      {latestLog && (
        <div className="mb-6 p-4 rounded-xl border border-green-500 bg-green-500/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400 text-sm">🟢 Latest Log</span>

            <button
              onClick={() => handleSendToDevice(latestLog)}
              className="text-xs px-2 py-1 bg-blue-600 rounded"
            >
              View Device
            </button>
          </div>

          <pre className="text-sm whitespace-pre-wrap wrap-break-word">
            {JSON.stringify(latestLog, null, 2)}
          </pre>
        </div>
      )}

      {/* 🧠 ALL LOGS */}
      <div className="space-y-3">
        {logs.map((log, i) => (
          <div
            key={i}
            className="p-3 bg-[#1a1a1a] rounded-lg border border-zinc-800 hover:border-zinc-600 transition"
          >
            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-2 text-xs text-zinc-400">
              <span>[{log.time || "no-time"}]</span>

              <div className="flex gap-2">
                {/* DEVICE */}
                <button
                  onClick={() => handleSendToDevice(log)}
                  className="px-2 py-1 bg-blue-600 rounded"
                >
                  Device
                </button>

                {/* COPY */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      JSON.stringify(log, null, 2)
                    )
                  }
                  className="px-2 py-1 bg-zinc-700 rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <pre className="text-sm whitespace-pre-wrap wrap-break-word">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}