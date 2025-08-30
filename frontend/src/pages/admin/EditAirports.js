import React, { useEffect, useState } from "react";
import { Notyf } from "notyf";

const notyf = new Notyf();

const EditAirports = () => {
  const [airports, setAirports] = useState([]);
  const [editingAirport, setEditingAirport] = useState(null); // airport being edited
  const [formData, setFormData] = useState({ name: "", code: "", location: "" });

  // Fetch all airports
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports`);
        const data = await res.json();

        if (data.success) {
          setAirports(data.data);
        } else {
          notyf.error(data.message || "Failed to fetch airports");
        }
      } catch (err) {
        console.error(err);
        notyf.error("Error fetching airports");
      }
    };

    fetchAirports();
  }, []);

  // Delete airport
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this airport?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        notyf.success("Airport deleted successfully ✈️");
        setAirports((prev) => prev.filter((a) => a._id !== id));
      } else {
        notyf.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Error deleting airport");
    }
  };

  // Start editing
  const handleEdit = (airport) => {
    setEditingAirport(airport._id);
    setFormData({ name: airport.name, code: airport.code, location: airport.location });
  };

  // Save changes
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/flights/airports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        notyf.success("Airport updated successfully");
        setAirports((prev) =>
          prev.map((a) => (a._id === id ? { ...a, ...formData } : a))
        );
        setEditingAirport(null); // close edit mode
      } else {
        notyf.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      notyf.error("Error updating airport");
    }
  };

  return (
  <div className="edit-airport-container">
    <h2 className="edit-airport-title">EDIT/DELETE Aiports</h2>
    <table className="edit-airport-table">
      <thead>
        <tr className="text-center">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Code</th>
          <th className="p-2 border">Location</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {airports.length > 0 ? (
          airports.map((airport) => (
            <tr key={airport._id}>
              {editingAirport === airport._id ? (
                <>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  </td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => handleSave(airport._id)} className="btn-save">
                      Save
                    </button>
                    <button onClick={() => setEditingAirport(null)} className="btn-cancel">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{airport.name}</td>
                  <td className="p-2 border">{airport.code}</td>
                  <td className="p-2 border">{airport.location}</td>
                  <td className="p-2 border space-x-2">
                    <button onClick={() => handleEdit(airport)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(airport._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-2 border text-center" colSpan="4">
              No airports found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
};

export default EditAirports;