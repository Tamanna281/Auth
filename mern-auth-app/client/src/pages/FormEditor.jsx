// client/src/pages/FormEditor.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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

  if (error) return <p>{error}</p>;
  if (!form) return <p>Loading...</p>;

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>Edit Form</h2>

      <input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        style={{ width: "100%", marginBottom: "20px" }}
      />

      {form.fields.map((field) => (
        <div
          key={field.id}
          style={{ border: "1px solid #555", padding: "10px", marginBottom: "10px" }}
        >
          <div>Type: {field.type}</div>

          <input
            value={field.label}
            onChange={(e) =>
              handleFieldChange(field.id, "label", e.target.value)
            }
            style={{ width: "100%" }}
          />

          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                handleFieldChange(field.id, "required", e.target.checked)
              }
            />
            Required
          </label>
        </div>
      ))}

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default FormEditor;
