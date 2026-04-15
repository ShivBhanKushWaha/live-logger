export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q) {
    return Response.json({ items: [] });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX}&q=${q}&searchType=image`
    );

    const data = await res.json();

    return Response.json(data);
  } catch (err) {
    return Response.json({ items: [] });
  }
}