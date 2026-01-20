import { useEffect, useState } from "react";
import axios from "axios";

const FormViewer = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/forms/${formId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setForm(res.data);
    };

    fetchForm();
  }, [formId]);

  const handleChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h2>{form.name}</h2>

      {form.fields.map(field => (
        <div key={field.id}>
          <label>{field.label}</label>

          <input
            type={field.type}
            required={field.required}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        </div>
      ))}

      <button onClick={() => console.log(values)}>
        Submit
      </button>
    </div>
  );
};

export default FormViewer;
