const Cart = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* LEFT COLUMN – CART ITEMS */}
        <div className="flex-grow lg:w-2/3">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-heading">
              Your Cart
              <span className="text-xl font-normal text-body-text/60 ml-2">
                (3 items)
              </span>
            </h1>
            <button className="text-primary hover:underline text-sm font-semibold">
              Clear all items
            </button>
          </div>

          <div className="space-y-6">

            {/* CART ITEM */}
            {[
              {
                title: "lampe rétro",
                price: "80 DT",
                material: "Industrial Resin",
                colorName: "Warm Amber",
                colorClass: "bg-amber-200",
                qty: 1,
                img: "/layerlab_market/lampe1.webp",
              },
              {
                title: "Crystal Dragon",
                price: "18 DT",
                material: "Iridescent Blue",
                colorName: "Crystal Blue",
                colorClass: "bg-blue-300",
                qty: 2,
                img: "/layerlab_market/toys/ggdino.webp",
              },
              {
                title: "Vases Japandi",
                price: "60 DT",
                material: "Carbon PLA",
                colorName: "Natural Beige",
                colorClass: "bg-stone-300",
                qty: 1,
                img: "/layerlab_market/vase1.webp",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-border-muted/20 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full md:w-40 h-40 object-cover rounded-lg"
                  />

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-heading">
                          {item.title}
                        </h3>
                        <span className="text-xl font-bold text-primary">
                          {item.price}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-accent/20 text-heading text-xs font-semibold rounded-full uppercase">
                          {item.material}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-body-text/60">
                            Color:
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full ${item.colorClass} border`}
                          />
                          <span className="text-sm font-medium">
                            {item.colorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button className="p-2 text-primary">−</button>
                        <span className="px-4 font-bold text-heading">
                          {item.qty}
                        </span>
                        <button className="p-2 text-primary">+</button>
                      </div>

                      <button className="text-red-400 hover:text-red-600 text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN – ORDER SUMMARY */}
        <div className="lg:w-1/3">
        
          <div className="sticky top-28 bg-accent text-heading rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-heading/70">
                <span>Subtotal</span>
                <span className="font-medium">176 DT</span>
              </div>

              <div className="flex justify-between text-heading/70">
                <span>delivery</span>
                <span className="font-medium">10 DT</span>
              </div>

            

              <div className="pt-4 border-t border-heading/20 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold">186 DT</span>
              </div>
            </div>

            {/* PROMO CODE */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-heading/70 uppercase tracking-widest mb-2">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="LAYERLAB10"
                  className="flex-grow bg-background-light border border-border-muted rounded px-4 py-2 text-heading placeholder:text-heading/40 focus:ring-1 focus:ring-heading outline-none"
                />
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded font-bold transition">
                  Apply
                </button>
              </div>
            </div>

            {/* CHECKOUT BUTTON */}
            <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg">
              Proceed to Checkout
            </button>

            {/* TRUST INFO */}
            <div className="mt-8 flex items-center gap-3 text-heading/60 text-sm">
              <span className="material-icons-round text-lg">verified_user</span>
              <span>Secure 256-bit SSL encrypted payment</span>
            </div>
          </div>
        </div>

          
          
      </div>
    </main>
  );
};

export default Cart;
