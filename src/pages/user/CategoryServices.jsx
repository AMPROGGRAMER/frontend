import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicServices } from "../../services/serviceService.js";
import ServiceCard from "../../components/cards/ServiceCard.jsx";

const CategoryServicesPage = () => {
  const { name } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublicServices({ category: name });
        setServices(data || []);
      } catch (e) {
        console.error("Failed to load services:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [name]);

  const title = decodeURIComponent(name || "");

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>{title || "Category"}</h1>
        <p>Browse services available in {title || "this"} category.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧰</div>
          <h3>No services yet</h3>
          <p>No services available in this category yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryServicesPage;

