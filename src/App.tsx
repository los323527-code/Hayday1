import { useEffect, useRef, useState } from "react";
import Admin from "./Admin";
import productsData from "./products.json";
import { fetchProducts } from "./api";
import { CONTACT_URL, FALLBACK_IMG, fmtPrice } from "./types";
import type { StoreItem } from "./types";

const defaultItems = productsData as unknown as StoreItem[];

function StoreCard({ item, delay }: { item: StoreItem; delay: number }) {
  const [qty, setQty] = useState(1);
  const picked = item.sets?.find((x) => x.qty === qty);

  const fmt = fmtPrice;
  const priceText = picked ? fmt(picked) : "";

  let buyHref = CONTACT_URL;
  if (picked) {
    const msg = [
      "សួស្តី Admin! ខ្ញុំចង់ទិញ 🛍️",
      "",
      `📦 ទំនិញ: ${item.name}`,
      `🔢 ចំនួន: ${picked.qty} set`,
      `💰 តម្លៃសរុប: ${fmt(picked)}`,
      "",
      `🖼️ ${item.img.startsWith("/") ? window.location.origin + item.img : item.img}`,
    ].join("\n");
    buyHref = `${CONTACT_URL}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="store-item" style={{ animationDelay: `${delay}s` }}>
      <div className="store-img-wrapper">
        <img
          src={item.img}
          alt={item.name}
          className="store-img"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        {item.oldPrice && <span className="sale-badge">SALE</span>}
      </div>
      <div className="store-info">
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
        {item.sets.length > 0 && (
          <div className="set-picker">
            <span className="set-label">ជ្រើស set:</span>
            <div className="set-chips">
              {item.sets.map((x) => (
                <button
                  key={x.qty}
                  type="button"
                  className={`set-chip${x.qty === qty ? " active" : ""}`}
                  onClick={() => setQty(x.qty)}
                >
                  {x.qty}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="store-bottom">
          <div className="price-box">
            <span className="price-tag">
              <span className="coin">🪙</span> {priceText}
            </span>
            {item.oldPrice && qty === 1 && <span className="old-price">{item.oldPrice}</span>}
          </div>
          <a
            href={buyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="buy-btn"
          >
            🛍️ ទិញ
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(defaultItems);
  useEffect(() => {
    let alive = true;
    fetchProducts().then((live) => {
      if (alive && live) setStoreItems(live);
    });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Secret entry: tap the cat's tongue 7 times quickly to open Admin
  const taps = useRef({ count: 0, last: 0 });
  const onSecretTap = () => {
    const now = Date.now();
    const t = taps.current;
    t.count = now - t.last > 1500 ? 1 : t.count + 1;
    t.last = now;
    if (t.count >= 7) {
      t.count = 0;
      window.location.hash = "#admin";
    }
  };

  if (route === "#admin") return <Admin />;

  return (
    <div className="app">
      <div className="secret-spot" onClick={onSecretTap} />
      <div className="sky">
        <div className="sun">🌞</div>
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
        <div className="cloud cloud-4">☁️</div>
      </div>

      <div className="bio-card">
        <div className="store-section">
          <h2 className="store-title">🛒 Hayday Store</h2>
          <div className="store-grid">
            {storeItems.map((item, i) => (
              <StoreCard key={item.id} item={item} delay={1 + 0.15 * i} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
