import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen, Plus, X, Save } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import FilterChip from '../components/FilterChip';
import { SAMPLE_RESOURCES } from '../utills/resourcesData';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    url: '',
    tags: []
  });

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/api/v1/resources');
        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }
        const data = await response.json();
        // Handle both array and object response
        const resourcesArray = Array.isArray(data) ? data : data.data || data.resources || [];
        setResources(resourcesArray);
      } catch (err) {
        console.error('Error fetching resources:', err);
        // Fall back to sample data when API fails
        console.log('Falling back to sample data');
        setResources(SAMPLE_RESOURCES);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = useMemo(() => ['all', ...new Set(resources.map(r => r.category || ''))], [resources]);
  const types = useMemo(() => ['all', ...new Set(resources.map(r => r.type || ''))], [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      const matchesType = selectedType === 'all' || r.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, selectedType]);

  const clearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
  };

  const hasFilters = searchQuery || selectedCategory !== 'all' || selectedType !== 'all';

  // Handle adding new resource
  const handleAddResource = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('http://localhost:3000/api/v1/resources', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newResource)
      // });
      // const addedResource = await response.json();
      
      // For now, add to local state
      const addedResource = {
        id: Date.now(),
        ...newResource,
        createdAt: new Date().toISOString()
      };
      
      setResources(prev => [addedResource, ...prev]);
      setShowAddResourceModal(false);
      setNewResource({
        title: '',
        description: '',
        category: '',
        type: '',
        url: '',
        tags: []
      });
    } catch (err) {
      console.error('Error adding resource:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="resources-page">
        <header className="resources-header">
          <div className="resources-header-content">
            <h1 className="resources-title">Sustainability Resources</h1>
            <p className="resources-subtitle">
              Discover guides, tips, and strategies for reducing food waste and eating sustainably
            </p>
          </div>
        </header>
        <main className="resources-content">
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="empty-title">Loading resources...</h3>
            <p className="empty-message">Please wait while we fetch the latest resources</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="resources-page">
        <header className="resources-header">
          <div className="resources-header-content">
            <h1 className="resources-title">Sustainability Resources</h1>
            <p className="resources-subtitle">
              Discover guides, tips, and strategies for reducing food waste and eating sustainably
            </p>
          </div>
        </header>
        <main className="resources-content">
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="empty-title">Error loading resources</h3>
            <p className="empty-message">{error}</p>
            <button onClick={() => window.location.reload()} className="empty-action">
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700 shadow-xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-3 bg-gradient-to-r from-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Sustainability Resources
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto font-light">
                Discover guides, tips, and strategies for reducing food waste and eating sustainably
              </p>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg ml-8"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-lg backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Filters</h2>
          </div>

          {/* Category Filters */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <FilterChip
                  key={c}
                  label={c}
                  active={selectedCategory === c}
                  onClick={() => setSelectedCategory(c)}
                  onRemove={() => setSelectedCategory('all')}
                />
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {types.map(t => (
                <FilterChip
                  key={t}
                  label={t}
                  active={selectedType === t}
                  onClick={() => setSelectedType(t)}
                  onRemove={() => setSelectedType('all')}
                />
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          {hasFilters && (
            <button 
              onClick={clearAll} 
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="text-sm text-slate-400 mb-6">
          Showing <span className="text-slate-200 font-semibold">{filteredResources.length}</span> {filteredResources.length === 1 ? 'resource' : 'resources'}
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl bg-slate-800/40">
            <div className="w-18 h-18 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No resources found</h3>
            <p className="text-slate-400 mb-5">Try adjusting your search or filters</p>
            <button 
              onClick={clearAll} 
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200">Add New Resource</h2>
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newResource.title}
                  onChange={handleInputChange}
                  placeholder="Resource title"
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newResource.description}
                  onChange={handleInputChange}
                  placeholder="Resource description"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Category</label>
                <select
                  name="category"
                  value={newResource.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  <option value="food-waste">Food Waste</option>
                  <option value="sustainable-eating">Sustainable Eating</option>
                  <option value="meal-planning">Meal Planning</option>
                  <option value="gardening">Urban Gardening</option>
                  <option value="composting">Composting</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Type</label>
                <select
                  name="type"
                  value={newResource.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="guide">Guide</option>
                  <option value="tool">Tool</option>
                  <option value="recipe">Recipe</option>
                </select>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">URL (optional)</label>
                <input
                  type="url"
                  name="url"
                  value={newResource.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddResourceModal(false)}
                className="flex-1 px-4 py-3 text-slate-400 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResource}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-indigo-600 transition-all"
              >
                <Save className="w-4 h-4" />
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
