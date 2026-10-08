import type { CSSProperties } from "react";

type SocialLink = {
  name: string;
  icon: string;
  url: string;
  color: string;
  bg: string;
};

type StoreItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  oldPrice: string | null;
  img: string;
  buyUrl: string;
};

const AVATAR_URL = "https://i.ibb.co/QjNVj6Ft/photo-2026-09-16-19-31-24.jpg";
const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/679/679720.png";
const CONTACT_URL = "https://t.me/theanlay";

const socials: SocialLink[] = [
  {
    name: "TikTok",
    icon: "🎵",
    url: "https://www.tiktok.com/@arixo_prime?_r=1&_t=ZS-99VTX0Eoo56",
    color: "#000000",
    bg: "#ffe4ef",
  },
  {
    name: "Facebook",
    icon: "📘",
    url: "https://www.facebook.com/share/1EueHCGZe4/?mibextid=wwXIfr",
    color: "#1877f2",
    bg: "#e7f0ff",
  },
  {
    name: "Telegram Admin",
    icon: "✈️",
    url: "https://t.me/theanlay",
    color: "#0088cc",
    bg: "#e6f6ff",
  },
  {
    name: "Group Telegram",
    icon: "👥",
    url: "https://t.me/hd_store_kh",
    color: "#0068ff",
    bg: "#e8f0ff",
  },
  {
    name: "Channel Telegram",
    icon: "📢",
    url: "https://t.me/hd_store_khmer",
    color: "#ff0000",
    bg: "#fff0f0",
  },
  {
    name: "Group និយាយគ្នាលេង",
    icon: "💬",
    url: "https://t.me/HD_Store_Communications",
    color: "#ff0000",
    bg: "#fff0f0",
  },
];

const storeItems: StoreItem[] = [
  {
    id: 1,
    name: "Bem, Lem, Sem",
    desc: "1set = 700៛, 7set = 4800៛, 30set = 20000៛ (Cream ឬ Butter ចំនួន 100 🧀🍨)",
    price: "700៛",
    oldPrice: "1000៛",
    img: "https://i.ibb.co/zWxymcq8/photo-2026-09-09-15-08-06.jpg",
    buyUrl: CONTACT_URL,
  },
  {
    id: 2,
    name: "TNT, Saw, Axe, Shovel",
    desc: "គ្រាប់បែក 100💣 = 200៛, រណា 100🪚 = 300៛, ពែល 100🪏 = 300៛, ពូថៅ 100🪓 = 300៛",
    price: "200៛ - 300៛",
    oldPrice: null,
    img: "https://i.ibb.co/1fgQywJy/photo-2026-09-13-09-19-11.jpg",
    buyUrl: CONTACT_URL,
  },
  {
    id: 3,
    name: "Lobster🦞, Duck Feather🪽",
    desc: "កសិដ្ឋានពេញលេញ",
    price: "1000៛",
    oldPrice: null,
    img: "https://i.ibb.co/XkjbmW4Y/photo-2026-09-13-22-03-47.jpg",
    buyUrl: CONTACT_URL,
  },
  {
    id: 4,
    name: "Jam Group 🍓🍑",
    desc: "Strawberry Jam, Peach Jam, Blueberry Jam, Raspberry Jam, Blackberry Jam, Cherry Jam, Apricot Jam, Plum Jam, Grape Jam, Mango Jam",
    price: "1000៛",
    oldPrice: null,
    img: "https://i.ibb.co/YFdbPhfg/photo-2026-09-14-05-54-37.jpg",
    buyUrl: CONTACT_URL,
  },
  {
    id: 5,
    name: "Account Hayday",
    desc: "Level 36, Barn 1050, Silo 525",
    price: "6000៛",
    oldPrice: null,
    img: "https://i.ibb.co/N2NFh3y1/photo-2026-09-17-16-44-54.jpg",
    buyUrl: CONTACT_URL,
  },
];

function SocialButton({ name, icon, url, color, bg, delay }: SocialLink & { delay: number }) {
  const style = {
    "--btn-color": color,
    "--btn-bg": bg,
    animationDelay: `${delay}s`,
  } as CSSProperties;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-btn"
      style={style}
    >
      <span className="btn-icon">{icon}</span>
      <span className="btn-name">{name}</span>
      <span className="btn-arrow">➜</span>
    </a>
  );
}

function StoreCard({ item, delay }: { item: StoreItem; delay: number }) {
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
        <div className="store-bottom">
          <div className="price-box">
            <span className="price-tag">
              <span className="coin">🪙</span> {item.price}
            </span>
            {item.oldPrice && <span className="old-price">{item.oldPrice}</span>}
          </div>
          <a
            href={item.buyUrl}
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
  const grass = ["🌾", "🌻", "🐄", "🌾", "🐔", "🌻", "🐑", "🌾"];

  return (
    <div className="app">
      <div className="sky">
        <div className="sun">🌞</div>
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
        <div className="cloud cloud-4">☁️</div>
      </div>

      <div className="bio-card">
        <div className="avatar-wrapper">
          <img src={AVATAR_URL} alt="avatar" className="avatar" />
          <span className="badge">🐔</span>
        </div>

        <h1 className="name">HD-Store 🌻</h1>
        <p className="tagline">Hayday Seller • Content Creator 🎮</p>
        <p className="bio-text">
          សូមស្វាគមន៍មកកាន់ bio របស់ខ្ញុំ! 🐄🌾
          <br />
          តាមដានខ្ញុំគ្រប់បណ្តាញខាងក្រោម 👇
        </p>

        <div className="socials">
          {socials.map((s, i) => (
            <SocialButton key={s.name} {...s} delay={0.4 + 0.12 * i} />
          ))}
        </div>

        <div className="store-section">
          <h2 className="store-title">🛒 Hayday Store</h2>
          <div className="store-grid">
            {storeItems.map((item, i) => (
              <StoreCard key={item.id} item={item} delay={1 + 0.15 * i} />
            ))}
          </div>
        </div>

        <p className="footer-text">🌾 Create by Theanlay 2026 🌾</p>
      </div>

      <div className="grass">
        {grass.map((g, i) => (
          <span key={i}>{g}</span>
        ))}
      </div>
    </div>
  );
}
