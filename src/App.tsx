type StoreItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  oldPrice: string | null;
  img: string;
  buyUrl: string;
};

const FALLBACK_IMG = "https://cdn-icons-png.flaticon.com/512/679/679720.png";
const CONTACT_URL = "https://t.me/theanlay";

const storeItems: StoreItem[] = [
  {
    id: 1,
    name: "Bem, Lem, Sem",
    desc: "1set = 700៛, 7set = 4800៛, 30set = 20000៛",
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
