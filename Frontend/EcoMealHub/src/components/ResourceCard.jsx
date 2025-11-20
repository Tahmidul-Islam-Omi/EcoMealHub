import { Video, FileText, BookOpen, ExternalLink } from 'lucide-react';
import './ResourceCard.css';

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
    <article className="resource-card">
      {/* Type badge */}
      <div className="card-type-badge">
        {getTypeIcon(resource.type)}
        <span style={{ textTransform: 'capitalize' }}>{resource.type}</span>
      </div>

      {/* Title */}
      <h3 className="card-title">
        {resource.title}
      </h3>

      {/* Description */}
      <p className="card-description">
        {resource.description}
      </p>

      {/* Footer */}
      <div className="card-footer">
        <span className="category-badge">{resource.category}</span>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
        >
          View
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
};

export default ResourceCard;
