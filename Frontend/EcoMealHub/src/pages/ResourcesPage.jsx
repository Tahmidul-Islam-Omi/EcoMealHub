import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import FilterChip from '../components/FilterChip';
import './ResourcesPage.css';

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
    <div className="resources-page">
      {/* Header */}
      <header className="resources-header">
        <div className="resources-header-content">
          <h1 className="resources-title">Sustainability Resources</h1>
          <p className="resources-subtitle">
            Discover guides, tips, and strategies for reducing food waste and eating sustainably
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="resources-content">
        {/* Search */}
        <div className="search-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-header">
            <Filter className="filter-icon" />
            <h2 className="filters-header-title">Filters</h2>
          </div>

          {/* Category Filters */}
          <div className="filter-group">
            <label className="filter-group-label">Category</label>
            <div className="filter-chips-row">
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
          <div className="filter-group">
            <label className="filter-group-label">Type</label>
            <div className="filter-chips-row">
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
            <button onClick={clearAll} className="clear-all-btn">
              Clear all filters
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="results-info">
          Showing <strong>{filteredResources.length}</strong> {filteredResources.length === 1 ? 'resource' : 'resources'}
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="resources-grid">
            {filteredResources.map(r => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="empty-title">No resources found</h3>
            <p className="empty-message">Try adjusting your search or filters</p>
            <button onClick={clearAll} className="empty-action">
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourcesPage;
