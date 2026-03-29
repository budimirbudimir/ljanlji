import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type Props = {
  images: { src: string; alt: string }[]
  photosLabel: string
}

export default function ProductGallery({ images, photosLabel }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null

  const [cover, ...rest] = images

  return (
    <div className="gallery">
      {/* Main cover image */}
      <button
        className="gallery-cover"
        onClick={() => { setIndex(0); setOpen(true) }}
        aria-label={`${photosLabel}: ${cover.alt}`}
      >
        <img src={cover.src} alt={cover.alt} className="gallery-cover-img" />
        {images.length > 1 && (
          <span className="gallery-count">+{images.length} {photosLabel}</span>
        )}
      </button>

      {/* Thumbnails row */}
      {rest.length > 0 && (
        <div className="gallery-thumbs">
          {rest.map((img, i) => (
            <button
              key={i}
              className="gallery-thumb"
              onClick={() => { setIndex(i + 1); setOpen(true) }}
              aria-label={img.alt}
            >
              <img src={img.src} alt={img.alt} loading="lazy" className="gallery-thumb-img" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      />

      <style>{`
        .gallery { display: flex; flex-direction: column; gap: 10px; }
        .gallery-cover {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          background: var(--paper);
        }
        .gallery-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.3s;
        }
        .gallery-cover:hover .gallery-cover-img { transform: scale(1.03); }
        .gallery-count {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(58,32,16,0.72);
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          padding: 5px 12px;
          border-radius: 2px;
          pointer-events: none;
        }
        .gallery-thumbs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .gallery-thumb {
          width: 72px;
          height: 72px;
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: 4px;
          overflow: hidden;
          background: var(--paper);
          opacity: 0.85;
          transition: opacity 0.15s;
        }
        .gallery-thumb:hover { opacity: 1; }
        .gallery-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  )
}
