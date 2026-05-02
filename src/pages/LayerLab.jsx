import { useState, useEffect } from 'react';

function LayerLab() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const animationImages = [
    '/layerlab_market/annimation/lampe1.webp',
    '/layerlab_market/annimation/vase1.webp',
    '/layerlab_market/annimation/vase2.webp',
    '/layerlab_market/annimation/vase3.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % animationImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [animationImages.length]);
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  }

  const homeDecor = [
    { id: 1, name: 'lampe rétro', price: '80 DT', tag: 'Industrial Resin', image: '/layerlab_market/lampe1.webp', },
    { id: 2, name: 'Vases Japandi', price: '60 DT', tag: 'Carbon PLA', image: '/layerlab_market/vase1.webp', color: '#d8c6c2' },
    { id: 3, name: 'Vases toroïdaux imbriqués', price: '80 DT', tag: 'Translucent PETG', image: '/layerlab_market/vase2.webp', color: '#bdb0ad' },
  ]

  const toys = [
    { id: 11, name: 'Articulated Cat', price: '12 DT', tag: 'Silk Rainbow PLA', image: '/layerlab_market/toys/chat.webp', color: '#f6e9e6' },
    { id: 12, name: 'Infinite Cube', price: '12 DT', tag: 'Tough Resin', image: '/layerlab_market/toys/cube.webp', color: '#e6eef0' },
    { id: 13, name: 'Pixel Figurine', price: '20 DT', tag: 'Matte Green PLA', image: '/layerlab_market/toys/figurine.webp', color: '#eaf0e9' },
    { id: 14, name: 'Crystal Dragon', price: '18 DT', tag: 'Iridescent Blue', image: '/layerlab_market/toys/ggdino.webp', color: '#e6eef6' },
  ]

  const keychains = [
    { id: 21, name: 'Gym Life Tag', price: '6 DT', tag: 'Rubberized PLA', image: '/layerlab_market/keychains/gymbro.webp', color: '#efe4e1' },
    { id: 22, name: 'Turbo Fan Key', price: '8 DT', tag: 'ABS Blend', image: '/layerlab_market/keychains/turbo.webp', color: '#f0e8e6' },
    { id: 23, name: 'One Piece - Chapeau de Luffy', price: '8 DT', tag: 'Detail Resin', image: '/layerlab_market/keychains/lufihat.webp', color: '#f3e9ea' },
    { id: 21, name: 'Gym Life Tag', price: '6 DT', tag: 'Rubberized PLA', image: '/layerlab_market/keychains/gymbro.webp', color: '#efe4e1' },
    { id: 22, name: 'Turbo Fan Key', price: '8 DT', tag: 'ABS Blend', image: '/layerlab_market/keychains/turbo.webp', color: '#f0e8e6' },
    { id: 23, name: 'One Piece - Chapeau de Luffy', price: '8 DT', tag: 'Detail Resin', image: '/layerlab_market/keychains/lufihat.webp', color: '#f3e9ea' },

  ]

  function ProductCard({ p, accent }) {
    return (
      <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        <div className="h-48 flex items-center justify-center" style={{ background: p.color || accent }}>
          {p.image ? (
            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
          ) : (
            <div className="text-2xl font-semibold text-navy/90" style={{ color: palette.navy }}>{p.name.split(' ')[0]}</div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
          <div className="mt-auto flex items-center justify-between">
            <div className="text-base font-bold" style={{ color: palette.navy }}>{p.price}</div>
            <button className="px-4 py-2 rounded-full bg-[#4a4e69] text-white text-sm font-medium hover:bg-[#3f4156] transition">Add to Cart</button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: palette.offwhite }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight" style={{ color: palette.navy }}>Design the Future, Print the Present.</h1>
            <p className="text-gray-700 max-w-xl" style={{ color: palette.mauve }}>Discover high-quality 3D printed originals for your home and lifestyle. Sustainable materials meet precision engineering.</p>
            <div className="flex gap-4">
              <button className="rounded-full px-6 py-3 bg-white border border-[#e6e0dc] text-[#22223b] font-semibold shadow-sm hover:shadow-md transition">Shop Collections</button>
              <button className="rounded-full px-6 py-3 bg-transparent border border-[#9a8c98] text-[#4a4e69] font-medium hover:bg-[#f5f0ef] transition">Contact us</button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <div className="w-full h-80 flex items-center justify-center relative" style={{ backgroundColor: palette.beige }}>
              {/* Image carousel with fade animation */}
              <div className="absolute inset-0">
                {animationImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`LayerLab Product ${index + 1}`}
                    className="w-full h-full object-contain absolute transition-opacity duration-1000"
                    style={{
                      opacity: index === currentImageIndex ? 1 : 0,
                    }}
                  />
                ))}
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Dots navigation */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {animationImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: index === currentImageIndex ? palette.navy : palette.mauve,
                      opacity: index === currentImageIndex ? 1 : 0.5,
                      width: index === currentImageIndex ? '24px' : '8px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Home Decor */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: palette.navy }}>Home Decor</h2>
            <a className="text-sm font-medium" style={{ color: palette.indigo }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeDecor.map((p) => (
              <ProductCard key={p.id} p={p} accent={palette.beige} />
            ))}
          </div>
        </section>

        {/* Toys & Fidgets */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: palette.navy }}>Toys & Fidgets</h2>
            <a className="text-sm font-medium" style={{ color: palette.indigo }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toys.map((p) => (
              <ProductCard key={p.id} p={p} accent={palette.offwhite} />
            ))}
          </div>
        </section>

        {/* Keychains */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: palette.navy }}>Keychains</h2>
            <a className="text-sm font-medium" style={{ color: palette.indigo }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {keychains.map((p) => (
              <div key={p.id} className="bg-transparent h-full">
                <ProductCard p={p} accent={palette.beige} />
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </main>
  )
}

export default LayerLab
