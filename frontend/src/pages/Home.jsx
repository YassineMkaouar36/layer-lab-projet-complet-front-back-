function Home() {
  const products = [
    {
      id: 1,
      name: 'Poignee interieur',
      price: '60 DT',
      image: '/image/poignee.webp',
    },
    {
      id: 2,
      name: 'lampe rétro',
      price: '80 DT',
      image: '/layerlab_market/lampe1.webp',
    },
    {
      id: 3,
      name: 'Vases toroïdaux imbriqués',
      price: '80 DT',
      image: '/layerlab_market/vase2.webp',
    },
    {
      id: 4,
      name: 'Articulated Cat',
      price: '12 DT',
      image: '/layerlab_market/toys/chat.webp',
    },
  ]

  return (
    <main className="min-h-screen text-gray-900" style={{ backgroundColor: '#dcdcdd' }}>
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">Welcome to Layer Lab</h1>
            <p className="text-lg text-gray-700 max-w-xl">Layer Lab is a 3D printing project specializing in custom designs, decor, automotive parts, and creative products.</p>

            <div className="flex flex-wrap gap-4">
              <button className="rounded-lg px-6 py-4 border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">Explore social media</button>
              <button className="rounded-lg px-6 py-4 border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">Explore Materials</button>
            </div>

            <div className="flex items-center gap-8 mt-6">
              <div>
                <div className="text-3xl font-bold">1k+</div>
                <div className="text-sm text-gray-500">Parts Printed</div>
              </div>
              <div className="w-px h-10 bg-gray-100"></div>
              <div>
                <div className="text-3xl font-bold">0.01mm</div>
                <div className="text-sm text-gray-500">Layer Precision</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="/3d printer head.jpg" alt="3D printer close-up" className="w-full h-96 object-cover" />
            </div>
           
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Best Sellers</h2>
              <p className="text-gray-600">Engineered for precision and performance.</p>
            </div>
            <a className="text-primary font-semibold" href="#">View All</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <article key={p.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
                <div className="h-56 bg-gray-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">High-quality 3D printed component with precision finish.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-primary font-bold">{p.price}</div>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">Add to Cart</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Brands */}
        <section className="mt-20">
          <h3 className="text-xl font-bold mb-6">Brands We Work With</h3>
              <div className="flex flex-wrap items-center justify-center gap-8 bg-white p-6 rounded-xl shadow-sm">
                <img src="/bambulogo.png" alt="Bambu Lab" className="h-20 w-48 md:h-24 md:w-56 object-contain p-2" />
                <img src="/polymakerlogo.png" alt="Polymaker" className="h-24 w-56 md:h-28 md:w-64 object-contain p-2" />
                <img src="/3dprint.png" alt="3dprint" className="h-20 w-48 md:h-24 md:w-56 object-contain p-2" />
                <img src="/bmc.jpg" alt="bmc" className="h-24 w-56 md:h-28 md:w-64 object-contain p-2" />
                <img src="/cultslogo.png" alt="cults" className="h-20 w-48 md:h-24 md:w-56 object-contain p-2" />
                <img src="/smulogo.jpg" alt="smu" className="h-24 w-56 md:h-28 md:w-64 object-contain p-2" />


            </div>
        </section>

        {/* CTA Section: Custom Blueprint */}
        <section style={{ backgroundColor: '#004aad' }} className="mt-20 rounded-2xl p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Got a custom blueprint?</h2>
              <p className="text-base text-blue-100">Upload your CAD files and our engineers will optimize your design for additive manufacturing. We support .STL, .STEP, and .OBJ formats.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  <span>📤</span> Upload Project
                </button>
                <button className="flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">Talk to an Engineer</button>
              </div>
            </div>
            <div className="hidden lg:block max-w-sm ml-auto">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUt2kh-1VUBTncvHgF6SltKKT9-1rNIwYk0r-NirHfgpY7srvXwPLqe-ui2W8KMcPV1NSw-hVNXbvwjLioN5orWLw0ScCqxl0urww8aBU-mE4SDEqYRXBqZtuo3Wryc0xUFaNRs3n2OqOes_MzuRd4nq1LLidt-wDuF48s9Nzj7Ky5Ej0X9yY-ossZS92PZ_38U4jqJvvZ49QkcDmDftcE055YzOxh7yMNMNqZr89bB3zpfx8uIEcnCd7DoIMPx1nh6Ihk7wOKMA" alt="3D car blueprint" className="w-full rounded-lg shadow-lg" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home
