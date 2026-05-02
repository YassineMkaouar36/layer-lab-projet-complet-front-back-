import { useState } from 'react';

function CustomService() {
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [intendedUse, setIntendedUse] = useState('Prototype');
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [selectedColor, setSelectedColor] = useState('#f6e9e6');
  const [infillPercentage, setInfillPercentage] = useState(40);
  const [layerHeight, setLayerHeight] = useState('0.2mm');
  const [finishType, setFinishType] = useState('Matte');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('24.00 DT');
  const [productionTime, setProductionTime] = useState('3-5 business days');

  const materials = [
    { name: 'PLA', icon: '🎨' },
    { name: 'ABS', icon: '⚙️' },
    { name: 'TPU', icon: '✨' },
  ];

  const colors = [
    { name: 'Cream', value: '#f6e9e6' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#1a1a1a' },
    { name: 'Red', value: '#e74c3c' },
    { name: 'Blue', value: '#3498db' },
    { name: 'Green', value: '#2ecc71' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          setUploadProgress(100);
          clearInterval(interval);
        } else {
          setUploadProgress(Math.min(progress, 99));
        }
      }, 200);
    }
  };

  const calculatePrice = () => {
    const basePrice = 24;
    const quantityMultiplier = quantity;
    const materialPrices = { PLA: 1, ABS: 1.2, TPU: 1.5 };
    const finishPrices = { Matte: 0, Glossy: 5 };
    
    const total = basePrice * quantityMultiplier * (materialPrices[selectedMaterial] || 1) + (finishPrices[finishType] || 0);
    setEstimatedPrice(`${total.toFixed(2)} DT`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7f8' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          style={{
            background: 'linear-gradient(to right, #004aad, #22223b)',
          }}
          className="px-6 py-20 md:py-28 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Custom 3D Printing Service
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Upload your design, customize your print, we handle the rest.
            </p>
            <button 
              onClick={() => document.getElementById('uploadInput').click()}
              className="px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 text-white mx-auto transition-all hover:scale-[1.05]"
              style={{ backgroundColor: '#004aad' }}
            >
              📤 Upload Your File
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload & Product Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <div 
              className="border-2 border-dashed rounded-2xl p-8 text-center"
              style={{
                backgroundColor: '#f2e9e4',
                borderColor: '#004aad',
              }}
            >
              <div className="flex flex-col items-center">
                <div className="text-5xl mb-4">📁</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#22223b' }}>
                  Drag and drop your design
                </h3>
                <p className="text-sm mb-6" style={{ color: '#4a4e69' }}>
                  Accepted formats: .STL, .OBJ, .STEP (Max 50MB)
                </p>

                <input
                  id="uploadInput"
                  type="file"
                  accept=".stl,.obj,.step"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {fileName ? (
                  <div className="w-full max-w-md bg-white rounded-lg p-4 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span>📄</span>
                      <span className="text-sm font-bold truncate">{fileName}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all"
                        style={{
                          backgroundColor: '#004aad',
                          width: `${uploadProgress}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-right">{uploadProgress}%</div>
                  </div>
                ) : (
                  <button
                    onClick={() => document.getElementById('uploadInput').click()}
                    className="px-6 py-3 rounded-lg font-bold text-white"
                    style={{ backgroundColor: '#004aad' }}
                  >
                    Choose File
                  </button>
                )}
              </div>
            </div>

            {/* Product Description Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#22223b' }}>
                📝 Product Details
              </h3>

              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Custom Bracket, Decorative Vase"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none"
                    style={{
                      borderColor: '#9a8c98',
                      backgroundColor: '#f2e9e4',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                    onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                  />
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                    Product Description
                  </label>
                  <textarea
                    placeholder="Describe what you're printing and any specific requirements..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows="4"
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none resize-none"
                    style={{
                      borderColor: '#9a8c98',
                      backgroundColor: '#f2e9e4',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                    onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value) || 1);
                      calculatePrice();
                    }}
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none"
                    style={{
                      borderColor: '#9a8c98',
                      backgroundColor: '#f2e9e4',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                    onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                  />
                </div>

                {/* Intended Use */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                    Intended Use
                  </label>
                  <select
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none"
                    style={{
                      borderColor: '#9a8c98',
                      backgroundColor: '#f2e9e4',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                    onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                  >
                    <option>Prototype</option>
                    <option>Decorative</option>
                    <option>Mechanical</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Print Customization */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#22223b' }}>
                ⚙️ Print Customization
              </h3>

              <div className="space-y-8">
                {/* Material Selection */}
                <div>
                  <label className="block text-sm font-bold mb-4" style={{ color: '#22223b' }}>
                    Select Material
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {materials.map((material) => (
                      <button
                        key={material.name}
                        onClick={() => {
                          setSelectedMaterial(material.name);
                          calculatePrice();
                        }}
                        className="p-4 rounded-xl border-2 transition-all font-bold"
                        style={{
                          borderColor: selectedMaterial === material.name ? '#004aad' : '#9a8c98',
                          backgroundColor:
                            selectedMaterial === material.name ? '#f2e9e4' : 'white',
                          color: '#22223b',
                        }}
                      >
                        <div className="text-2xl mb-2">{material.icon}</div>
                        {material.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-bold mb-4" style={{ color: '#22223b' }}>
                    Color Selection
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className="w-12 h-12 rounded-full border-4 transition-all shadow-sm hover:scale-110"
                        style={{
                          backgroundColor: color.value,
                          borderColor: selectedColor === color.value ? '#004aad' : 'transparent',
                          boxShadow:
                            selectedColor === color.value
                              ? '0 0 0 2px #004aad'
                              : 'none',
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Infill Percentage */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold" style={{ color: '#22223b' }}>
                      Infill Percentage
                    </label>
                    <span className="text-lg font-bold" style={{ color: '#004aad' }}>
                      {infillPercentage}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={infillPercentage}
                    onChange={(e) => setInfillPercentage(parseInt(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      accentColor: '#004aad',
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                  <div className="flex justify-between text-xs mt-2" style={{ color: '#9a8c98' }}>
                    <span>Hollow (Lighter)</span>
                    <span>Solid (Stronger)</span>
                  </div>
                </div>

                {/* Layer Height */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                    Layer Height
                  </label>
                  <select
                    value={layerHeight}
                    onChange={(e) => setLayerHeight(e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none"
                    style={{
                      borderColor: '#9a8c98',
                      backgroundColor: '#f2e9e4',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                    onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                  >
                    <option>0.1mm (High Detail)</option>
                    <option>0.2mm (Standard)</option>
                    <option>0.3mm (Fast)</option>
                  </select>
                </div>

                {/* Finish Type */}
                <div>
                  <label className="block text-sm font-bold mb-4" style={{ color: '#22223b' }}>
                    Finish Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Matte', 'Glossy'].map((finish) => (
                      <button
                        key={finish}
                        onClick={() => {
                          setFinishType(finish);
                          calculatePrice();
                        }}
                        className="p-4 rounded-xl border-2 transition-all font-bold"
                        style={{
                          borderColor: finishType === finish ? '#004aad' : '#9a8c98',
                          backgroundColor:
                            finishType === finish ? '#f2e9e4' : 'white',
                          color: '#22223b',
                        }}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Notes */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#22223b' }}>
                💬 Special Instructions
              </h3>

              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#22223b' }}>
                  File Notes / Tolerances
                </label>
                <textarea
                  placeholder="Add any special requirements, tolerances, or additional notes..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows="4"
                  className="w-full border-2 rounded-lg px-4 py-3 focus:outline-none resize-none"
                  style={{
                    borderColor: '#9a8c98',
                    backgroundColor: '#f2e9e4',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#004aad')}
                  onBlur={(e) => (e.target.style.borderColor = '#9a8c98')}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Submission */}
          <div className="space-y-6">
            {/* Pricing & Estimation */}
            <div className="rounded-2xl p-6 shadow-lg text-white" style={{ backgroundColor: '#22223b' }}>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                💰 Pricing & Estimation
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Base Price</span>
                  <span className="font-bold">24.00 DT</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Quantity (x{quantity})</span>
                  <span className="font-bold">{(24 * quantity).toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span>Material Markup</span>
                  <span className="font-bold">+{selectedMaterial !== 'PLA' ? '20%' : '0%'}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-3">
                  <span>Estimated Total</span>
                  <span style={{ color: '#c9ada7' }}>{estimatedPrice}</span>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-white/80">
                  ⏱️ <strong>Production Time:</strong><br />
                  {productionTime}
                </p>
                <p className="text-xs text-white/60 mt-3">
                  💡 Final price confirmed after manual review
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold mb-4 uppercase" style={{ color: '#22223b' }}>
                Why Trust Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <span className="text-sm" style={{ color: '#4a4e69' }}>
                    Secure upload
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">👁️</span>
                  <span className="text-sm" style={{ color: '#4a4e69' }}>
                    Manual review
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⭐</span>
                  <span className="text-sm" style={{ color: '#4a4e69' }}>
                    Professional printing
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="space-y-3">
              <button
                onClick={calculatePrice}
                className="w-full py-4 rounded-xl font-black text-lg text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#004aad' }}
              >
                ✉️ Request a Quote
              </button>
              <button
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{
                  backgroundColor: '#f2e9e4',
                  color: '#22223b',
                  border: '2px solid #9a8c98',
                }}
              >
                💾 Save Draft
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomService;
