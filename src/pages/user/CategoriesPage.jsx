import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../services/categoryService.js";
import CategoryCard from "../../components/CategoryCard.jsx";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Categories</h1>
        <p>Browse all service categories available on ServeLocal.</p>
      </div>
      {loading ? (
        <div className="text-muted">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No categories yet</h3>
          <p>Add documents to the `categories` collection in MongoDB.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

