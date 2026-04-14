import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { fetchProviders, updateMyProviderProfile } from "../../services/providerService.js";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["Morning (8-12)", "Afternoon (12-17)", "Evening (17-21)"];

const AvailabilityPage = () => {
  const { user, showToast } = useApp();
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const providers = await fetchProviders({ includeAll: "true" });
        const myProfile = providers.find((p) => String(p.user?._id || p.user) === String(user._id));
        if (myProfile?.availability) {
          const map = {};
          myProfile.availability.forEach((a) => {
            map[`${a.day}-${a.slot}`] = true;
          });
          setAvailability(map);
        }
      } catch (e) {
        showToast("error", "Failed to load availability");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "provider") load();
    else setLoading(false);
  }, [user, showToast]);

  const toggleSlot = (day, slot) => {
    const key = `${day}-${slot}`;
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const slots = [];
    days.forEach((day) => {
      timeSlots.forEach((slot) => {
        if (availability[`${day}-${slot}`]) {
          slots.push({ day, slot });
        }
      });
    });
    try {
      setSaving(true);
      await updateMyProviderProfile({ availability: slots });
      showToast("success", "Availability saved");
    } catch (e) {
      showToast("error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Provider access only</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Availability</h1>
        <p>Set the days and time slots when you can take bookings.</p>
      </div>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : (
        <div className="card">
          <div className="grid-7">
            {days.map((day) => (
              <div key={day} className="text-center">
                <div className="font-semibold mb-2">{day.slice(0, 3)}</div>
                {timeSlots.map((slot) => {
                  const key = `${day}-${slot}`;
                  const isActive = availability[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`btn btn-sm mb-1 w-full ${isActive ? "btn-primary" : "btn-outline"}`}
                      onClick={() => toggleSlot(day, slot)}
                    >
                      {slot.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Availability"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;

