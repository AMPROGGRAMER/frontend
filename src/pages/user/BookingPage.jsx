import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, Navigation } from "lucide-react";
import { createBooking } from "../../services/bookingService.js";
import { useApp } from "../../context/AppContext.jsx";
import LocationMap from "../../components/LocationMap.jsx";

// This page assumes you navigate here with state from some provider card,
// but it still renders even without it.
const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const provider = location.state?.provider || null;
  const { user, showToast } = useApp();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast?.("error", "Please login to book a service");
      navigate("/login");
      return;
    }
    if (!provider) {
      showToast?.("error", "No provider selected");
      return;
    }

    // Warn if no coordinates
    if (!coordinates.lat || !coordinates.lng) {
      const proceed = window.confirm(
        "No GPS location has been set for this booking. " +
        "The provider will only see the text address without a map.\n\n" +
        "Click 'Cancel' to add a location, or 'OK' to proceed without a map location."
      );
      if (!proceed) return;
    }

    try {
      setLoading(true);
      const payload = {
        providerId: provider._id,
        serviceName: provider.category || "Service",
        date,
        time,
        notes,
        city: provider.city || "",
        amount: provider.price ?? provider.priceFrom ?? 0,
        address,
        coordinates: coordinates.lat && coordinates.lng ? coordinates : undefined
      };
      console.log("Submitting booking with payload:", payload);
      const booking = await createBooking(payload);
      console.log("Created booking response:", booking);
      showToast?.("success", "Booking created successfully");
      navigate("/booking/confirmation", { state: { provider, booking } });
    } catch (err) {
      console.error("Booking creation error:", err);
      showToast?.("error", "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowMapPicker(true);
          showToast?.("success", "Location captured successfully");
        },
        (error) => {
          showToast?.("error", "Failed to get location. Please enter manually.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      showToast?.("error", "Geolocation is not supported by this browser");
    }
  };

  const handleSetManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setCoordinates({ lat, lng });
      setShowMapPicker(true);
      showToast?.('success', 'Coordinates set manually');
    } else {
      showToast?.('error', 'Please enter valid latitude and longitude');
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Booking details</h1>
        <p>Confirm your service requirements and book the provider.</p>
      </div>

      <div className="card">
        {provider && (
          <div className="mb-4">
            <div className="text-xl font-bold">{provider.name}</div>
            <div className="text-muted mt-1">
              {provider.category} • {provider.city}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                className="form-input"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                placeholder="Flat / Street / Area / City"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
          </div>

          {/* Location Picker */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Service Location
              <span style={{ color: 'var(--accent-primary)', fontSize: '12px', marginLeft: '8px' }}>
                (Required for map view)
              </span>
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleGetCurrentLocation}
              >
                <Navigation size={14} style={{ marginRight: '4px' }} />
                Use My Location
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowMapPicker(!showMapPicker)}
              >
                <MapPin size={14} style={{ marginRight: '4px' }} />
                {showMapPicker ? 'Hide Map' : 'Show Map'}
              </button>
            </div>

            {/* Manual coordinate input */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              alignItems: 'flex-end',
              marginBottom: '10px',
              padding: '12px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '8px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g., 28.6139"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g., 77.2090"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSetManualCoordinates}
              >
                Set
              </button>
            </div>

            {coordinates.lat && coordinates.lng && (
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{ color: 'var(--accent-primary)' }}>Location Set:</strong><br />
                Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
              </div>
            )}

            {showMapPicker && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginTop: '10px', border: '1px solid var(--border-primary)' }}>
                <LocationMap
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  address={address}
                  height="250px"
                  zoom={coordinates.lat ? 15 : 5}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Describe your issue"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading ? "Booking..." : "Confirm booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;

