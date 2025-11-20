import { useState, useCallback } from 'react';
import { 
  Upload, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Camera,
  Scan,
  ShoppingCart,
  Package
} from 'lucide-react';

const ReceiptUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Mock extracted items for demonstration
  const mockExtractedItems = [
    { name: 'Organic Bananas', quantity: '2 lbs', price: 3.99, category: 'fruits', confidence: 0.95 },
    { name: 'Whole Milk', quantity: '1 gallon', price: 4.29, category: 'dairy', confidence: 0.92 },
    { name: 'Bread', quantity: '1 loaf', price: 2.49, category: 'grains', confidence: 0.88 },
    { name: 'Chicken Breast', quantity: '2 lbs', price: 8.99, category: 'protein', confidence: 0.93 },
    { name: 'Spinach', quantity: '1 bag', price: 2.99, category: 'vegetables', confidence: 0.89 }
  ];

  const handleFileUpload = useCallback((files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      status: 'uploaded'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const processReceipts = async () => {
    setProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setExtractedItems(mockExtractedItems);
      setProcessing(false);
      setShowResults(true);
    }, 3000);
  };

  const addToInventory = async (items) => {
    // TODO: Add API call to add items to inventory
    // await fetch('http://localhost:3000/api/inventory/bulk', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ items })
    // });
    
    console.log('Adding to inventory:', items);
    alert(`Added ${items.length} items to inventory!`);
    
    // Reset state
    setUploadedFiles([]);
    setExtractedItems([]);
    setShowResults(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      fruits: 'bg-orange-500/20 text-orange-400',
      vegetables: 'bg-green-500/20 text-green-400',
      dairy: 'bg-blue-500/20 text-blue-400',
      protein: 'bg-red-500/20 text-red-400',
      grains: 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Scan className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-200">Receipt Scanner</h1>
              <p className="text-slate-400">Upload receipts to automatically add items to your inventory</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showResults ? (
          <>
            {/* Upload Section */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Upload Receipt Images</h2>
              
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-purple-500/20 rounded-full">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                      Drag & drop receipt images here
                    </h3>
                    <p className="text-slate-400 mb-4">
                      Supports JPG, PNG, and PDF files up to 10MB
                    </p>
                    <div className="flex gap-3 justify-center">
                      <label className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-pointer">
                        <FileImage className="w-4 h-4" />
                        Choose Files
                        <input
                          type="file"
                          multiple
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                      <button className="flex items-center gap-2 bg-slate-700/60 text-slate-300 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-200 mb-4">Uploaded Files</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="relative bg-slate-700/40 rounded-lg p-4">
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      
                      {file.file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      ) : (
                        <div className="w-full h-32 bg-slate-600/60 rounded mb-2 flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      
                      <div className="text-sm text-slate-200 font-medium truncate mb-1">
                        {file.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      
                      <div className="flex items-center gap-1 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={processReceipts}
                    disabled={processing}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        Process Receipts
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* How it Works */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">How it Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-slate-200 mb-2">1. Upload</h4>
                  <p className="text-slate-400 text-sm">
                    Take a photo or upload an image of your grocery receipt
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Scan className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-slate-200 mb-2">2. Process</h4>
                  <p className="text-slate-400 text-sm">
                    Our AI extracts item names, quantities, and prices automatically
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-slate-200 mb-2">3. Add to Inventory</h4>
                  <p className="text-slate-400 text-sm">
                    Review and add the extracted items to your food inventory
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Results Section */
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200">Extracted Items</h2>
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Processing Complete</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {extractedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-200">{item.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        {item.quantity} • ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {item.confidence > 0.9 ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <div className="text-slate-300">
                <span className="font-semibold">{extractedItems.length}</span> items found • 
                <span className="font-semibold"> ${extractedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span> total
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResults(false)}
                  className="px-4 py-2 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  Back to Upload
                </button>
                <button
                  onClick={() => addToInventory(extractedItems)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Inventory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptUpload;
