import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FormFill = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/forms/${formId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm(res.data);

        // Initialize empty values
        const initialValues = {};
        res.data.fields.forEach((field) => {
          initialValues[field.id] = "";
        });

        setValues(initialValues);
      } catch (err) {
        console.error(err);
        setError("Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  const handleChange = (fieldId, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/forms/${formId}/submissions`,
        { values },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Form submitted successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to submit form");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  if (!form) return null;

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>{form.name}</h2>

      {form.fields.map((field) => (
        <div key={field.id} style={{ marginBottom: "15px" }}>
          <label>
            {field.label}
            {field.required && " *"}
          </label>

          <input
            type="text"
            value={values[field.id]}
            onChange={(e) =>
              handleChange(field.id, e.target.value)
            }
            required={field.required}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FormFill;
