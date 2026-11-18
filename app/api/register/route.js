export async function POST(req) {
  const body = await req.json();
  if (!body.name || !body.email || !body.phone) return Response.json({ error: "Missing fields" }, { status: 400 });
  // TODO: save to your database, Google Sheet, or email service.
  console.log("New registration:", body);
  return Response.json({ ok: true });
}
