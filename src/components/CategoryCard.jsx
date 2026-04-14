import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ArrowUpRight } from "lucide-react";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${encodeURIComponent(category.name)}`);
  };

  const getCategoryIcon = (name) => {
    const icons = {
      plumber: "🔧",
      electrician: "⚡",
      cleaner: "🧹",
      tutor: "📚",
      painter: "🎨",
      carpenter: "🔨",
      gardener: "🌱",
      mechanic: "🔩",
      driver: "🚗",
      cook: "👨‍🍳",
      default: "🔧"
    };
    return icons[name?.toLowerCase()] || category.icon || icons.default;
  };

  return (
    <button
      type="button"
      className="category-card"
      onClick={handleClick}
    >
      <div className="category-icon">
        <span style={{ fontSize: '32px' }}>
          {getCategoryIcon(category.name)}
        </span>
      </div>
      <div className="category-name">{category.name}</div>
      <div className="category-count">
        <Briefcase size={12} style={{ marginRight: '4px' }} />
        {category.count || 0} providers
        <ArrowUpRight size={12} style={{ marginLeft: '4px', opacity: 0.5 }} />
      </div>
    </button>
  );
};

export default CategoryCard;

