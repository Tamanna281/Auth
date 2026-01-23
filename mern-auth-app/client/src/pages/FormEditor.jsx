import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/formEdit.css";

const FormEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/forms/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setForm(res.data);
      } catch (err) {
        setError("Failed to load form");
      }
    };

    fetchForm();
  }, [id]);

  const handleFieldChange = (fieldId, key, value) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, [key]: value } : f
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/forms/${id}`,
        {
          name: form.name,
          fields: form.fields,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Form updated successfully");
      navigate("/");
    } catch (err) {
      alert("Failed to save form");
    }
  };

  if (error) {
    return <div className="form-fill-state error">{error}</div>;
  }

  if (!form) {
    return <div className="form-fill-state">Loading...</div>;
  }

  return (
    <div className="edit-form-page">
      <div className="edit-form-card">
        <h2 className="edit-form-title">Edit Form</h2>
        <p className="edit-form-subtitle">
          Update form structure and field settings
        </p>

        {/* Form name */}
        <div className="edit-field">
          <label>Form Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* Fields */}
        {form.fields.map((field) => (
          <div key={field.id} className="edit-field">
            <label>
              {field.type.toUpperCase()} Field
            </label>

            <input
              value={field.label}
              onChange={(e) =>
                handleFieldChange(field.id, "label", e.target.value)
              }
            />

            <div className="edit-required">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  handleFieldChange(
                    field.id,
                    "required",
                    e.target.checked
                  )
                }
              />{" "}
              Required
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="form-actions">
          <button
            className="btn secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            className="btn primary"
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormEditor;
