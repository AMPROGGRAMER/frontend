import React, { useEffect, useState } from "react";
import ProviderCard from "../../components/cards/ProviderCard.jsx";
import SearchBar from "../../components/SearchBar.jsx";
import { searchProvidersApi } from "../../services/searchService.js";

// Lists providers and lets users filter by category.
const ServicesPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const data = await searchProvidersApi({});
        setProviders(data);
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);   // ✅ FIXED HERE

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Service Providers</h1>
        <p>Browse local professionals by category and compare their experience and prices.</p>
      </div>

      <SearchBar
        onSearch={async (filters) => {
          setLoading(true);
          try {
            const data = await searchProvidersApi(filters);
            setProviders(data);
          } finally {
            setLoading(false);
          }
        }}
      />

      {loading ? (
        <div className="text-muted">Loading providers...</div>
      ) : providers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No providers found</h3>
          <p>Try changing your search filters.</p>
        </div>
      ) : (
        <div className="grid-auto">
          {providers.map((p) => (
            <ProviderCard key={p._id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;