let clients: any[] = [];

export async function GET() {
  let controller: any;

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl;
      clients.push(ctrl);
    },
    cancel() {
      clients = clients.filter(c => c !== controller);
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