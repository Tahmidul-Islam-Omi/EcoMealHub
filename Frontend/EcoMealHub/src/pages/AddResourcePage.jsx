import { useState } from 'react';
import { PlusCircle, Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { ResourceAPI } from '../services/api';

const AddResourcePage = () => {

  const user_id = localStorage.getItem('user_id') || '';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    user_id: user_id, // Placeholder user ID; replace with actual user context
    type: 'article'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = [
    'waste reduction',
    'budget tips',
    'storage tips',
    'meal planning',
    'nutrition',
    'composting',
    'sustainable shopping',
    'cooking tips'
  ];

  const types = ['article', 'video', 'guide', 'tool', 'recipe'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 400) {
      newErrors.title = 'Title must be less than 400 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual API integration later
      // await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call to backend
      const response = await ResourceAPI.createResource(formData);
      
      console.log('Resource data to be submitted:', formData);
      
      setSubmitSuccess(true);
      setFormData({
        title: '',
        description: '',
        url: '',
        category: '',
        type: 'article'
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error submitting resource:', error);
      setErrors({ submit: 'Failed to submit resource. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500/10 to-indigo-500/10 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PlusCircle className="w-10 h-10 text-green-400" />
            <h1 className="text-4xl font-bold text-slate-200">Add Resource</h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Share your knowledge and help others learn about sustainable eating and food waste reduction
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-8 bg-green-500/20 border border-green-500/30 text-green-300 px-6 py-4 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Resource submitted successfully! It will be reviewed before being published.
            </div>
          </div>
        )}

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-200 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-700/60 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                  errors.title ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Enter a descriptive title for your resource"
                maxLength={400}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </div>
              )}
              <div className="mt-1 text-xs text-slate-500 text-right">
                {formData.title.length}/400 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-200 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-slate-700/60 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-slate-600'
                }`}
                placeholder="Provide a detailed description of what this resource offers and how it helps with sustainability"
              />
              {errors.description && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-slate-200 mb-2">
                URL (Optional)
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-700/60 border rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.url ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="https://example.com/your-resource"
                />
              </div>
              {errors.url && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.url}
                </div>
              )}
            </div>

            {/* Category and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-200 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-700/60 border rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.category ? 'border-red-500' : 'border-slate-600'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-slate-200 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  {types.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {errors.submit}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    url: '',
                    category: '',
                    type: 'article'
                  });
                  setErrors({});
                }}
                className="px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Submit Resource
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-3">Submission Guidelines</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>• Resources should be relevant to sustainable eating, food waste reduction, or meal planning</li>
            <li>• Provide accurate and helpful information in your description</li>
            <li>• If including a URL, make sure it leads to valuable, accessible content</li>
            <li>• All submissions will be reviewed before being published to maintain quality</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AddResourcePage;
