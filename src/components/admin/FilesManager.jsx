import { useState } from 'react';

const FilesManager = () => {
  const palette = {
    navy: '#22223b',
    indigo: '#4a4e69',
    mauve: '#9a8c98',
    beige: '#c9ada7',
    offwhite: '#f2e9e4',
  };

  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'lampe_retro_v2.stl',
      type: 'STL',
      size: '2.4 MB',
      uploadDate: '2024-01-20',
      category: 'Home Decor',
      status: 'Actif',
      downloads: 15
    },
    {
      id: 2,
      name: 'crystal_dragon.3mf',
      type: '3MF',
      size: '1.8 MB',
      uploadDate: '2024-01-19',
      category: 'Toys',
      status: 'Actif',
      downloads: 23
    },
    {
      id: 3,
      name: 'vase_japandi_set.stl',
      type: 'STL',
      size: '3.1 MB',
      uploadDate: '2024-01-18',
      category: 'Home Decor',
      status: 'En révision',
      downloads: 8
    },
    {
      id: 4,
      name: 'keychain_gym.stl',
      type: 'STL',
      size: '0.5 MB',
      uploadDate: '2024-01-17',
      category: 'Keychains',
      status: 'Actif',
      downloads: 42
    },
  ]);

  const [dragActive, setDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    Array.from(fileList).forEach(file => {
      if (file.name.endsWith('.stl') || file.name.endsWith('.3mf')) {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.name.endsWith('.stl') ? 'STL' : '3MF',
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          category: 'Non classé',
          status: 'En révision',
          downloads: 0
        };
        setFiles(prev => [...prev, newFile]);
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En révision': return 'bg-yellow-100 text-yellow-800';
      case 'Inactif': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type) => {
    return type === 'STL' ? '🔷' : '📦';
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4" style={{ color: palette.navy }}>
          Upload Fichier 3D
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4">📤</div>
          <p className="text-lg font-medium mb-2" style={{ color: palette.navy }}>
            Glissez vos fichiers ici
          </p>
          <p className="text-sm mb-4" style={{ color: palette.mauve }}>
            ou cliquez pour sélectionner
          </p>
          <input
            type="file"
            multiple
            accept=".stl,.3mf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
          >
            Sélectionner fichiers
          </label>
          <p className="text-xs mt-2" style={{ color: palette.mauve }}>
            Formats supportés: STL, 3MF (Max 10MB)
          </p>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: palette.navy }}>
            Gestion des Fichiers 3D
          </h1>
          <p className="mt-2" style={{ color: palette.mauve }}>
            Gérez vos fichiers STL et 3MF pour l'impression 3D
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <span>📤</span>
          Upload Fichier
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Total Fichiers</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>{files.length}</p>
            </div>
            <span className="text-2xl">📁</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Fichiers Actifs</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {files.filter(f => f.status === 'Actif').length}
              </p>
            </div>
            <span className="text-2xl">✅</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Total Downloads</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {files.reduce((sum, f) => sum + f.downloads, 0)}
              </p>
            </div>
            <span className="text-2xl">⬇️</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: palette.mauve }}>Espace Utilisé</p>
              <p className="text-2xl font-bold" style={{ color: palette.navy }}>
                {files.reduce((sum, f) => sum + parseFloat(f.size), 0).toFixed(1)} MB
              </p>
            </div>
            <span className="text-2xl">💾</span>
          </div>
        </div>
      </div>

      {/* Files Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getFileIcon(file.type)}</span>
                      <div>
                        <div className="font-medium" style={{ color: palette.navy }}>
                          {file.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      file.type === 'STL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {file.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {file.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {file.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: palette.navy }}>
                    {file.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: palette.mauve }}>
                    {file.uploadDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">⬇️</button>
                      <button className="text-green-600 hover:text-green-800">👁️</button>
                      <button className="text-red-600 hover:text-red-800">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default FilesManager;