// client/src/pages/FormFill.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/formFill.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FormFill = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/api/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setForm(res.data);

        const initialValues = {};
        res.data.fields.forEach((f) => {
          initialValues[f.id] = "";
        });
        setValues(initialValues);
      } catch (err) {
        console.error(err);
        setError("Unable to load this form.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (id, value) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Frontend validation
    const missingRequired = form.fields.some(
      (f) => f.required && !values[f.id]?.trim()
    );

    if (missingRequired) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE_URL}/api/forms/${formId}/submissions`,
        { values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- STATES ---------- */

  if (loading) {
    return (
      <div className="form-fill-state">
        Loading form…
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-fill-state error">
        {error}
      </div>
    );
  }

  if (!form) return null;

  /* ---------- UI ---------- */

  return (
    <div className="form-fill-page">
      <div className="form-fill-card">
        <h2 className="form-title">{form.name}</h2>
        <p className="form-subtitle">
          Please fill out the details below
        </p>

        <div className="form-fields">
          {form.fields.map((field) => (
            <div key={field.id} className="form-field">
              <label htmlFor={field.id}>
                {field.label}
                {field.required && (
                  <span className="required"> *</span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={field.id}
                  rows={4}
                  value={values[field.id]}
                  required={field.required}
                  onChange={(e) =>
                    handleChange(field.id, e.target.value)
                  }
                />
              ) : (
                <input
                  id={field.id}
                  type={field.type}
                  value={values[field.id]}
                  required={field.required}
                  onChange={(e) =>
                    handleChange(field.id, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button
            className="btn secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormFill;
