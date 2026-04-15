let clients: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const log = {
    ...body,
    time: new Date().toLocaleTimeString(),
  };

  const message = `data: ${JSON.stringify(log)}\n\n`;

  clients.forEach((client) => {
    try {
      client.enqueue(message);
    } catch {}
  });

  return Response.json({ ok: true });
}

// 🔥 stream
export async function GET() {
  let controller: any;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      clients.push(ctrl);
    },
    cancel() {
      clients = clients.filter((c) => c !== controller);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}