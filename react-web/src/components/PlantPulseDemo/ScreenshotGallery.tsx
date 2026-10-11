import './PlantPulseDemo.css'

type CarouselSlide = {
  src: string
  alt: string
  label?: string
}

type ScreenshotGalleryProps = {
  slides: CarouselSlide[]
  orientation?: 'portrait' | 'landscape'
}

export function ScreenshotGallery({ slides, orientation = 'portrait' }: ScreenshotGalleryProps) {
  const duplicated = [...slides, ...slides]

  return (
    <div className={`screenshot-gallery screenshot-gallery--${orientation}`}>
      <div className="screenshot-gallery__track">
        <div className="screenshot-gallery__set">
          {duplicated.map((slide, idx) => (
            <figure key={idx} className="screenshot-gallery__item">
              <img src={slide.src} alt={slide.alt} className="screenshot-gallery__img" />
              {slide.label && (
                <figcaption className="screenshot-gallery__label">{slide.label}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
