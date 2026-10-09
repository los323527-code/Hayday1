import { useEffect, useState } from "react";
import productsData from "./products.json";
import { FALLBACK_IMG, fmtPrice, makeSets } from "./types";
import type { StoreItem } from "./types";

// Change this password before publishing!
const ADMIN_PASSWORD = "hayday2026";
const DRAFT_KEY = "hd_admin_draft";
const AUTH_KEY = "hd_admin_ok";

const deployed = productsData as unknown as StoreItem[];

type Form = {
  name: string;
  desc: string;
  img: string;
  unit: string;
  unitMax: string;
  seven: string;
  oldPrice: string;
};

const emptyForm: Form = { name: "", desc: "", img: "", unit: "", unitMax: "", seven: "", oldPrice: "" };

function loadDraft(): StoreItem[] {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as StoreItem[];
  } catch {
    /* ignore */
  }
  return deployed;
}

function toForm(it: StoreItem): Form {
  const first = it.sets[0];
  const last = it.sets[6];
  const unit = first ? first.price : 0;
  const seven = last && last.price !== unit * 7 ? String(last.price) : "";
  return {
    name: it.name,
    desc: it.desc,
    img: it.img,
    unit: String(unit || ""),
    unitMax: first?.priceMax ? String(first.priceMax) : "",
    seven,
    oldPrice: it.oldPrice ?? "",
  };
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [pw, setPw] = useState("");
  const [items, setItems] = useState<StoreItem[]>(loadDraft);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const json = JSON.stringify(items, null, 2);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
      setAuthed(true);
    } else {
      setMsg("Key មិនត្រឹមត្រូវ");
    }
  };

  const save = () => {
    const unit = Number(form.unit);
    const unitMax = form.unitMax ? Number(form.unitMax) : undefined;
    const seven = form.seven ? Number(form.seven) : undefined;
    if (!form.name.trim()) return setMsg("សូមបញ្ចូលឈ្មោះទំនិញ");
    if (!unit || unit <= 0) return setMsg("សូមបញ្ចូលតម្លៃ 1 set (ជាលេខ)");
    const base = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      img: form.img.trim() || FALLBACK_IMG,
      oldPrice: form.oldPrice.trim() || null,
      sets: makeSets(unit, unitMax, seven),
    };
    if (editId === null) {
      const id = items.reduce((m, x) => Math.max(m, x.id), 0) + 1;
      setItems([...items, { id, ...base }]);
      setMsg("✅ បានបន្ថែមទំនិញថ្មី");
    } else {
      setItems(items.map((x) => (x.id === editId ? { id: x.id, ...base } : x)));
      setMsg("✅ បានកែប្រែទំនិញ");
    }
    setForm(emptyForm);
    setEditId(null);
  };

  const edit = (it: StoreItem) => {
    setEditId(it.id);
    setForm(toForm(it));
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = (it: StoreItem) => {
    if (window.confirm(`លុប "${it.name}" ?`)) {
      setItems(items.filter((x) => x.id !== it.id));
    }
  };

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setMsg("📋 បានចម្លង products.json ហើយ");
    } catch {
      setMsg("ចម្លងមិនបាន សូមចុចលើប្រអប់ខាងក្រោម ហើយ Select all → Copy");
    }
  };

  const reset = () => {
    if (window.confirm("ត្រឡប់ទៅទំនិញដែលកំពុងដាក់លើគេហទំព័រ?")) {
      setItems(deployed);
      setForm(emptyForm);
      setEditId(null);
    }
  };

  if (!authed) {
    return (
      <div className="adm-wrap">
        <div className="adm-card">
          <h2 className="adm-title">🔐 Admin</h2>
          <input
            className="adm-input"
            type="password"
            placeholder="Key"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button className="adm-btn adm-green" onClick={login}>
            ចូល
          </button>
          {msg && <p className="adm-msg">{msg}</p>}
          <a className="adm-link" href="#">
            ← ត្រឡប់ទៅហាង
          </a>
        </div>
      </div>
    );
  }

  const field = (label: string, key: keyof Form, props: { placeholder?: string; inputMode?: "numeric" } = {}) => (
    <label className="adm-label">
      {label}
      <input
        className="adm-input"
        value={form[key]}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <div className="adm-wrap">
      <div className="adm-card">
        <h2 className="adm-title">🛠️ Admin · Hayday Store</h2>
        <a className="adm-link" href="#">
          ← ត្រឡប់ទៅហាង
        </a>

        <h3 className="adm-sub">{editId === null ? "➕ បន្ថែមទំនិញថ្មី" : "✏️ កែប្រែទំនិញ"}</h3>
        {field("ឈ្មោះទំនិញ", "name")}
        <label className="adm-label">
          ការពិពណ៌នា
          <textarea
            className="adm-input"
            rows={3}
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
        </label>
        {field("តំណរូបភាព (URL)", "img", { placeholder: "https://i.ibb.co/..." })}
        {field("តម្លៃ 1 set (៛)", "unit", { inputMode: "numeric", placeholder: "700" })}
        {field("តម្លៃខ្ពស់បំផុត 1 set (ទុកទទេ បើតម្លៃតែមួយ)", "unitMax", { inputMode: "numeric" })}
        {field("តម្លៃ 7 set ពិសេស (ទុកទទេ បើគុណធម្មតា)", "seven", { inputMode: "numeric", placeholder: "4800" })}
        {field("តម្លៃចាស់ (ឧ. 1000៛ ទុកទទេ បើគ្មាន)", "oldPrice")}

        <div className="adm-row">
          <button className="adm-btn adm-green" onClick={save}>
            {editId === null ? "បន្ថែម" : "រក្សាទុក"}
          </button>
          {editId !== null && (
            <button
              className="adm-btn adm-gray"
              onClick={() => {
                setEditId(null);
                setForm(emptyForm);
              }}
            >
              បោះបង់
            </button>
          )}
        </div>
        {msg && <p className="adm-msg">{msg}</p>}

        <h3 className="adm-sub">📦 ទំនិញទាំងអស់ ({items.length})</h3>
        {items.map((it, idx) => (
          <div className="adm-item" key={it.id}>
            <img
              src={it.img}
              alt=""
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
            <div className="adm-item-info">
              <b>{it.name}</b>
              <span>{it.sets[0] ? fmtPrice(it.sets[0]) : ""} / 1 set</span>
              <div className="adm-row">
                <button className="adm-mini" onClick={() => move(idx, -1)}>↑</button>
                <button className="adm-mini" onClick={() => move(idx, 1)}>↓</button>
                <button className="adm-mini" onClick={() => edit(it)}>កែ</button>
                <button className="adm-mini adm-red" onClick={() => remove(it)}>លុប</button>
              </div>
            </div>
          </div>
        ))}

        <h3 className="adm-sub">🚀 ដាក់ឡើងគេហទំព័រ</h3>
        <p className="adm-note">
          ការកែនៅទីនេះរក្សាទុកក្នុងទូរស័ព្ទអ្នកប៉ុណ្ណោះ។ ដើម្បីឱ្យអតិថិជនឃើញ ចុច «ចម្លង» រួចយកទៅជំនួសក្នុងឯកសារ
          <b> src/products.json </b>
          លើ GitHub (Edit → Paste → Commit)។
        </p>
        <button className="adm-btn adm-blue" onClick={copy}>
          📋 ចម្លង products.json
        </button>
        <textarea className="adm-input adm-json" readOnly value={json} onFocus={(e) => e.currentTarget.select()} />
        <button className="adm-btn adm-gray" onClick={reset}>
          ↩︎ ត្រឡប់ទៅកំណែលើគេហទំព័រ
        </button>
      </div>
    </div>
  );
}
