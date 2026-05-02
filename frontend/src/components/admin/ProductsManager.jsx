import { useState } from 'react';

const ProductsManager = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [products, setProducts] = useState([
    { id: 1, name: 'lampe rétro', category: 'Home Decor', price: '80 DT', material: 'Industrial Resin', printTime: '4h 30min', stock: 15 },
    { id: 2, name: 'Crystal Dragon', category: 'Toys', price: '18 DT', material: 'Iridescent Blue', printTime: '2h 15min', stock: 8 },
    { id: 3, name: 'Vases Japandi', category: 'Home Decor', price: '60 DT', material: 'Carbon PLA', printTime: '3h 45min', stock: 12 },
    { id: 4, name: 'Gym Life Tag', category: 'Keychains', price: '6 DT', material: 'Rubberized PLA', printTime: '45min', stock: 25 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ['Home Decor', 'Toys', 'Keychains', 'Accessories'];
  const materials = ['PLA', 'ABS', 'PETG', 'Resin', 'Carbon PLA', 'Industrial Resin'];

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData
    };
    setProducts([...products, newProduct]);
    setShowAddForm(false);
  };

  const handleEditProduct = (productData) => {
    setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...productData } : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(product || {
      name: '', category: '', price: '', material: '', printTime: '', stock: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-xl font-bold mb-4" style={{ color: palette.navy }}>
            {product ? 'Modifier le Produit' : 'Ajouter un Produit'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Nom du produit
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Prix
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: 50 DT"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Matériau
              </label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un matériau</option>
                {materials.map(mat => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: palette.indigo }}>
                Temps d'impression
              </label>
              <input
                type="text"
                value={formData.printTime}
                onChange={(e) => setFormData({...formData, printTime: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ex: 2h 30min"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {product ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
            Gestion des Produits 3D
          </h1>
          <p className="mt-2" style={{ color: palette.mauve }}>
            Gérez votre catalogue de produits imprimés en 3D
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Ajouter un Produit
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matériau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temps d'impression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium" style={{ color: palette.navy }}>
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ color: palette.navy }}>
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {product.material}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {product.printTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 
                      product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <ProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Product Form */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsManager;