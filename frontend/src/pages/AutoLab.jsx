import { useState, useEffect } from 'react';

function AutoLab() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const animationImages = [
    '/image/animation/e30.jpg',
    '/image/animation/e36.jpeg',
    
    '/image/animation/e92_145.jpg',
    '/image/animation/portee30.webp',
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

  const electricBlue = '#e5e7eb'; // Electric blue accent

  const bmwE30 = [
    {
      id: 1,
      name: 'Poignee interieur',
      price: '60 DT',
      image: '/image/poignee.webp',
      alt: 'Poignee interieur'
    },
    {
      id: 2,
      name: 'Garniture Retroviseur (paire)',
      price: '70 DT',
      image: '/image/GarnitureRetroviseur.webp',
      alt: 'Garniture Retroviseur'
    },
    {
      id: 3,
      name: 'CupHolder',
      price: '100 DT',
      image: '/image/cupHolder.webp',
      alt: 'CupHolder'
    }
  ];

  const bmwE36 = [
    {
      id: 4,
      name: 'Garniture Poignée Porte Intérieure',
      price: '20 DT',
      image: '/image/Garniture Poignée Porte Intérieure.webp',
      alt: 'Garniture Poignée Porte Intérieure'
    },
    {
      id: 5,
      name: 'Calandre de pare-chocs avant BMW E36 M',
      price: '80 DT',
      image: '/image/Calandrepce36.webp',
      alt: 'Calandre de pare-chocs avant BMW E36 M'
    },
    {
      id: 6,
      name: 'CupHolder',
      price: '40 DT',
      image: '/image/portegoublee36.jpeg',
      alt: 'CupHolder'
    }
  ];

  const bmwE46 = [
    {
      id: 7,
      name: 'BMW E46 Flexible Ashtray',
      price: '50 DT',
      image: '/image/BMW E46 Flexible Ashtray.webp',
      alt: 'BMW E46 Flexible Ashtray'
    },
    {
      id: 8,
      name: 'E46 FOG GRILL',
      price: '70 DT',
      image: '/image/E46 FOG GRILL.webp',
      alt: 'E46 FOG GRILL'
    },
    {
      id: 9,
      name: 'x2 Silentblocs de transmission BMW ',
      price: '100 DT',
      image: '/image/x2 Silentblocs de transmission BMW.webp',
      alt: 'x2 Silentblocs de transmission BMW '
    }
  ];

  function ProductCard({ p }) {
    return (
      <article className="rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 overflow-hidden border" style={{ backgroundColor: palette.indigo, borderColor: electricBlue }}>
        <div className="h-48 flex items-center justify-center" style={{ backgroundColor: palette.navy }}>
          <img
            src={p.image}
            alt={p.alt}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold" style={{ color: palette.offwhite }}>{p.name}</h3>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-base font-bold" style={{ color: electricBlue }}>{p.price}</div>
            <button className="px-4 py-2 rounded-full text-white text-sm font-medium transition" style={{ backgroundColor: electricBlue, color: palette.navy }} onMouseEnter={(e) => e.target.style.opacity = '0.8'} onMouseLeave={(e) => e.target.style.opacity = '1'}>Add to Cart</button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: palette.navy }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight" style={{ color: electricBlue }}>Premium Auto Parts for Your BMW</h1>
            <p className="max-w-xl" style={{ color: palette.offwhite }}>High-quality 3D printed automotive components designed for precision and durability. Perfectly tailored for your BMW model.</p>
            <div className="flex gap-4">
              <button className="rounded-full px-6 py-3 font-semibold shadow-sm transition" style={{ backgroundColor: electricBlue, color: palette.navy, border: `2px solid ${electricBlue}` }}>Shop Parts</button>
              <button className="rounded-full px-6 py-3 font-medium transition" style={{ backgroundColor: 'transparent', color: electricBlue, border: `2px solid ${electricBlue}` }}>Contact Us</button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border relative" style={{ borderColor: electricBlue }}>
            <div className="w-full h-80 flex items-center justify-center relative bg-black" style={{ backgroundColor: palette.navy }}>
              {/* Image carousel with fade animation */}
              <div className="absolute inset-0">
                {animationImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`BMW Animation ${index + 1}`}
                    className="w-full h-full object-cover absolute transition-opacity duration-1000"
                    style={{
                      opacity: index === currentImageIndex ? 1 : 0,
                    }}
                  />
                ))}
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Text overlay */}
              <div className="relative z-10 text-3xl font-bold" style={{ color: electricBlue }}></div>
              
              {/* Dots navigation */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {animationImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: index === currentImageIndex ? electricBlue : palette.beige,
                      opacity: index === currentImageIndex ? 1 : 0.5,
                      width: index === currentImageIndex ? '24px' : '8px',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BMW E30 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: electricBlue }}>BMW E30</h2>
            <a className="text-sm font-medium transition" style={{ color: electricBlue }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bmwE30.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        {/* BMW E36 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: electricBlue }}>BMW E36</h2>
            <a className="text-sm font-medium transition" style={{ color: electricBlue }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bmwE36.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>

        {/* BMW E46 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: electricBlue }}>BMW E46</h2>
            <a className="text-sm font-medium transition" style={{ color: electricBlue }} href="#">View All →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bmwE46.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AutoLab;
