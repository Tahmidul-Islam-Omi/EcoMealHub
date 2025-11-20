import { Video, FileText, BookOpen, ExternalLink } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <article className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-lg backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-200 hover:shadow-xl hover:border-slate-600">
      {/* Type badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium mb-4">
        {getTypeIcon(resource.type)}
        <span className="capitalize">{resource.type}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-200 mb-3 leading-tight">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
        {resource.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 bg-slate-700/60 text-slate-300 rounded-full text-xs font-medium capitalize">
          {resource.category}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors group"
        >
          View
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </article>
  );
};

export default ResourceCard;
