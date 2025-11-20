import { useState, useMemo } from 'react';
import { 
  ChefHat, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star,
  Leaf,
  Plus,
  Heart,
  BookOpen,
  Utensils,
  Timer
} from 'lucide-react';
import { SAMPLE_RECIPES, RECIPE_CATEGORIES, RECIPE_CUISINES, DIFFICULTY_LEVELS, DIETARY_TAGS } from '../utills/recipesData';

const Recipes = () => {
  const [recipes] = useState(SAMPLE_RECIPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Filter recipes based on search and filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => recipe.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesCuisine && matchesDifficulty && matchesTags;
    });
  }, [recipes, searchQuery, selectedCategory, selectedCuisine, selectedDifficulty, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCuisine('all');
    setSelectedDifficulty('all');
    setSelectedTags([]);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSustainabilityColor = (level) => {
    switch (level) {
      case 'very high': return 'text-green-400';
      case 'high': return 'text-green-300';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      case 'very low': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="w-10 h-10 text-orange-400" />
                <h1 className="text-4xl font-bold text-slate-200">Sustainable Recipes</h1>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Discover delicious recipes that reduce food waste and promote sustainable cooking practices
              </p>
            </div>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg">
              <Plus className="w-5 h-5" />
              Add Recipe
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8">
          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes, ingredients, or cooking methods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <div className="w-5 h-5 flex flex-col gap-1">
                  <div className="h-1 bg-current rounded"></div>
                  <div className="h-1 bg-current rounded"></div>
                  <div className="h-1 bg-current rounded"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              {RECIPE_CATEGORIES.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category.replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="all">All Cuisines</option>
              {RECIPE_CUISINES.map(cuisine => (
                <option key={cuisine} value={cuisine} className="capitalize">
                  {cuisine.replace('-', ' ')}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            >
              <option value="all">All Difficulties</option>
              {DIFFICULTY_LEVELS.map(difficulty => (
                <option key={difficulty} value={difficulty} className="capitalize">
                  {difficulty}
                </option>
              ))}
            </select>
            
            <button
              onClick={clearAllFilters}
              className="px-4 py-3 text-orange-400 hover:text-orange-300 border border-slate-600 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Dietary Tags */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-slate-700/60 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-400">
            Showing <span className="text-slate-200 font-semibold">{filteredRecipes.length}</span> recipes
          </div>
        </div>

        {/* Recipes Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800/80 transition-all cursor-pointer group"
              >
                {/* Recipe Image */}
                <div className="relative h-48 bg-slate-700/50">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-white text-sm">
                      <Clock className="w-3 h-3" />
                      {formatTime(recipe.prepTime + recipe.cookTime)}
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-white text-sm">
                      <Users className="w-3 h-3" />
                      {recipe.servings}
                    </div>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-orange-400 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-700/60 text-slate-300 text-xs rounded-lg"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                    {recipe.tags.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/60 text-slate-300 text-xs rounded-lg">
                        +{recipe.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Rating and Sustainability */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-slate-200 text-sm font-medium">{recipe.rating}</span>
                      <span className="text-slate-500 text-sm">({recipe.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Leaf className={`w-4 h-4 ${getSustainabilityColor(recipe.sustainability.wasteReduction)}`} />
                      <span className="text-slate-300 text-sm capitalize">
                        {recipe.sustainability.wasteReduction} waste
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/80 transition-all cursor-pointer group"
              >
                <div className="flex gap-6">
                  {/* Recipe Image */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Recipe Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                        {recipe.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </div>
                    </div>
                    
                    <p className="text-slate-400 mb-4">
                      {recipe.description}
                    </p>

                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{formatTime(recipe.prepTime + recipe.cookTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{recipe.rating} ({recipe.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className={`w-4 h-4 ${getSustainabilityColor(recipe.sustainability.wasteReduction)}`} />
                        <span className="text-slate-300 text-sm capitalize">
                          {recipe.sustainability.wasteReduction} waste reduction
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700/60 text-slate-300 text-xs rounded-lg"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No recipes found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {selectedRecipe.difficulty}
                </div>
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  {selectedRecipe.rating} ({selectedRecipe.reviews})
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Recipe Title and Info */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-200 mb-2">{selectedRecipe.title}</h2>
                <p className="text-slate-400 mb-4">{selectedRecipe.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5 text-orange-400" />
                    <span className="text-slate-300">Prep: {selectedRecipe.prepTime}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-slate-300">Cook: {selectedRecipe.cookTime}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    <span className="text-slate-300">{selectedRecipe.servings} servings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className={`w-5 h-5 ${getSustainabilityColor(selectedRecipe.sustainability.wasteReduction)}`} />
                    <span className="text-slate-300 capitalize">
                      {selectedRecipe.sustainability.wasteReduction} waste reduction
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-700/60 text-slate-300 text-sm rounded-lg"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                    Ingredients
                  </h3>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                        <span className="text-slate-200 font-medium">{ingredient.amount} {ingredient.unit}</span>
                        <span className="text-slate-300">{ingredient.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-orange-400" />
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-slate-700/30 rounded-lg">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {instruction.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-200 mb-1">{instruction.title}</h4>
                          <p className="text-slate-300 text-sm mb-2">{instruction.description}</p>
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <Clock className="w-3 h-3" />
                            {instruction.time}m
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nutrition and Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Nutrition */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-4">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{selectedRecipe.nutrition.calories}</div>
                      <div className="text-slate-400 text-sm">Calories</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{selectedRecipe.nutrition.protein}g</div>
                      <div className="text-slate-400 text-sm">Protein</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{selectedRecipe.nutrition.carbs}g</div>
                      <div className="text-slate-400 text-sm">Carbs</div>
                    </div>
                    <div className="bg-slate-700/30 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">{selectedRecipe.nutrition.fat}g</div>
                      <div className="text-slate-400 text-sm">Fat</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-4">Chef's Notes</h3>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedRecipe.notes}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                      <Heart className="w-4 h-4" />
                      Save Recipe
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add to Meal Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;