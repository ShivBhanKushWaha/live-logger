let logs: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const log = {
      ...body,
      time: new Date().toLocaleTimeString(),
    };

    logs.push(log);

    // 🔥 memory safe (last 100 logs)
    if (logs.length > 100) logs.shift();

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false });
  }
}

// 🔥 GET logs
export async function GET() {
  return Response.json(logs);
}