import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  PlusCircle, 
  Leaf, 
  Recycle, 
  Heart, 
  Users,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const {t, i18n} = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: 'Sustainability Resources',
      description: 'Access a curated collection of guides, tips, and strategies for reducing food waste and eating sustainably.',
      link: '/resources'
    },
    {
      icon: PlusCircle,
      title: 'Share Knowledge',
      description: 'Contribute your own tips and resources to help build a community of sustainable eating advocates.',
      link: '/add-resource'
    },
    {
      icon: Recycle,
      title: 'Reduce Waste',
      description: 'Learn practical techniques to minimize food waste in your daily life and make a positive environmental impact.',
      link: '/resources?category=waste+reduction'
    },
    {
      icon: Heart,
      title: 'Healthy Living',
      description: 'Discover how sustainable eating practices can improve both your health and the planet\'s wellbeing.',
      link: '/resources?category=nutrition'
    }
  ];

  const stats = [
    { number: '1.3B', label: 'Tons of food wasted globally each year' },
    { number: '30%', label: 'Of food produced never reaches a human stomach' },
    { number: '10%', label: 'Of greenhouse gases come from food waste' },
    { number: '25%', label: 'Of freshwater is used to grow wasted food' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-indigo-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Leaf className="w-12 h-12 text-green-400" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                EcoMealHub
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed">
              {t('motto1')}
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
              {t('motto2')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5" />
                {t('exploreResources')}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/add-resource"
                className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-600 text-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-700 transition-all hover:border-slate-500"
              >
                <PlusCircle className="w-5 h-5" />
                {t('shareKnowledge')}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-200 mb-12">
            {t('The Global Food Waste Crisis')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">{stat.number}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-200 mb-4">
              {t('How EcoMealHub Helps')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('Our platform provides tools and resources to help you make sustainable choices and reduce food waste in your daily life.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group bg-slate-800/60 border border-slate-700 rounded-xl p-8 hover:bg-slate-800/80 transition-all duration-200 hover:shadow-xl hover:border-slate-600 hover:transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-indigo-500/20 p-3 rounded-lg">
                      <Icon className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-200 mb-3 group-hover:text-green-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-green-400 font-medium group-hover:text-green-300 transition-colors">
                        {t('Learn more')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500/10 to-indigo-500/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Users className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-200 mb-4">
            {t('Join Our Community')}
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            {t('Be part of a growing movement towards sustainable eating and reduced food waste.')} 
            {t('Together, we can make a difference for our planet.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg"
            >
              {t('getStarted')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-slate-200 px-8 py-4 rounded-xl font-semibold hover:text-green-400 transition-colors"
            >
              {t('browseResources')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
