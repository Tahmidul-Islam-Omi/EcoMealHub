import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
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
        setError(err.message);
        setResources([]);
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
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-200 mb-3 bg-gradient-to-r from-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Sustainability Resources
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-light">
            Discover guides, tips, and strategies for reducing food waste and eating sustainably
          </p>
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
    </div>
  );
};

export default ResourcesPage;
