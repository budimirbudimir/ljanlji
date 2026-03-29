import { useState } from 'react'

type Product = {
  slug: string
  title: string
  category: string
  categoryLabel: string
  coverImage: string | null
  href: string
  viewLabel: string
}

type Props = {
  products: Product[]
  categories: { value: string; label: string }[]
  filterAllLabel: string
  emptyLabel: string
}

export default function ProductFilter({ products, categories, filterAllLabel, emptyLabel }: Props) {
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? products : products.filter((p) => p.category === active)

  return (
    <div>
      {/* Filter buttons */}
      <div className="filter-bar" role="group" aria-label="Filter">
        <button
          className={`filter-btn ${active === 'all' ? 'active' : ''}`}
          onClick={() => setActive('all')}
        >
          {filterAllLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-btn ${active === cat.value ? 'active' : ''}`}
            onClick={() => setActive(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="empty-msg">{emptyLabel}</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <a key={product.slug} href={product.href} className="product-card">
              <div className="product-img-wrap">
                {product.coverImage ? (
                  <img src={product.coverImage} alt={product.title} loading="lazy" className="product-img" />
                ) : (
                  <div className="product-img-placeholder" />
                )}
              </div>
              <div className="product-info">
                <span className="tag">{product.categoryLabel}</span>
                <h2 className="product-name">{product.title}</h2>
                <span className="product-link">{product.viewLabel} →</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <style>{`
        .filter-bar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .filter-btn {
          font-family: var(--font-body);
          font-size: 0.625rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 2px;
          border: 1px solid rgba(90,144,96,0.35);
          background: transparent;
          color: var(--mid);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          font-weight: 600;
        }
        .filter-btn:hover { border-color: var(--sage); color: var(--sage-dark); }
        .filter-btn.active {
          background: var(--sage);
          color: #fff;
          border-color: var(--sage);
        }
        .empty-msg {
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--mid);
          padding: 40px 0;
          text-align: center;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .product-card {
          display: block;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(90,144,96,0.15);
          box-shadow: 0 3px 14px rgba(58,32,16,0.07);
          transition: box-shadow 0.2s, transform 0.2s;
          text-decoration: none;
          color: inherit;
        }
        .product-card:hover {
          box-shadow: 0 8px 28px rgba(58,32,16,0.14);
          transform: translateY(-2px);
        }
        .product-img-wrap { overflow: hidden; aspect-ratio: 4/3; }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .product-card:hover .product-img { transform: scale(1.04); }
        .product-img-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--paper) 0%, var(--brown-paper) 100%);
        }
        .product-info { padding: 14px 16px 18px; }
        .product-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          color: var(--dark);
          margin: 8px 0 10px;
          font-weight: 400;
        }
        .product-link {
          font-family: var(--font-body);
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          color: var(--terracotta);
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .product-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
