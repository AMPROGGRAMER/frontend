import React, { useState } from "react";
import { Search, MapPin, Grid3X3 } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ name, location, category });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          alignItems: 'end'
        }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Service / Provider</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
              <input
                className="form-input"
                placeholder="Search by name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }} />
              <input
                className="form-input"
                placeholder="City or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <div style={{ position: 'relative' }}>
              <Grid3X3 size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                zIndex: 1
              }} />
              <select
                className="form-input form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ paddingLeft: '40px' }}
              >
                <option value="">All categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Electrician">Electrician</option>
                <option value="Moving">Packers & Movers</option>
                <option value="Tutoring">Tutoring</option>
              </select>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ height: '44px' }}>
            <Search size={18} style={{ marginRight: '8px' }} />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
