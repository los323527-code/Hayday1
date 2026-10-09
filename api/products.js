// Vercel serverless function: GET = read products, POST = save (needs ADMIN_KEY)
// Storage: Neon Postgres (via Neon's HTTP SQL endpoint, no extra package needed)
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const KEY = "hayday_products";

async function sql(query, params = []) {
  const host = new URL(DB_URL).hostname;
  const r = await fetch(`https://${host}/sql`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Neon-Connection-String": DB_URL },
    body: JSON.stringify({ query, params }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.message || "db error");
  return j.rows || [];
}

async function ensureTable() {
  await sql("CREATE TABLE IF NOT EXISTS kv (k text PRIMARY KEY, v text)");
}

function validItems(items) {
  if (!Array.isArray(items) || items.length > 200) return false;
  return items.every(
    (it) =>
      it &&
      typeof it.id === "number" &&
      typeof it.name === "string" &&
      typeof it.desc === "string" &&
      typeof it.img === "string" &&
      (it.oldPrice === null || typeof it.oldPrice === "string") &&
      Array.isArray(it.sets) &&
      it.sets.length <= 30 &&
      it.sets.every(
        (s) =>
          s &&
          typeof s.qty === "number" &&
          typeof s.price === "number" &&
          (s.priceMax === undefined || typeof s.priceMax === "number")
      )
  );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    if (!DB_URL) return res.status(200).json({ items: null });
    try {
      await ensureTable();
      const rows = await sql("SELECT v FROM kv WHERE k = $1", [KEY]);
      return res.status(200).json({ items: rows[0] ? JSON.parse(rows[0].v) : null });
    } catch {
      return res.status(200).json({ items: null });
    }
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) return res.status(500).json({ error: "ADMIN_KEY មិនទាន់កំណត់ក្នុង Vercel" });
    if (body.key !== adminKey) return res.status(401).json({ error: "Key មិនត្រឹមត្រូវ" });
    if (body.items === undefined) return res.status(200).json({ ok: true }); // login check only

    if (!validItems(body.items)) return res.status(400).json({ error: "ទិន្នន័យមិនត្រឹមត្រូវ" });
    if (!DB_URL) return res.status(500).json({ error: "មិនទាន់តភ្ជាប់ Neon (Storage) ក្នុង Vercel" });

    try {
      await ensureTable();
      await sql(
        "INSERT INTO kv (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v",
        [KEY, JSON.stringify(body.items)]
      );
      return res.status(200).json({ ok: true });
    } catch {
      return res.status(500).json({ error: "រក្សាទុកមិនបាន" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
