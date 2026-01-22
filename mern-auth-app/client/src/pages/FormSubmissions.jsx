import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const FormSubmissions = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ Fetch form schema
        const formRes = await axios.get(
          `http://localhost:5000/api/forms/${formId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2️⃣ Fetch submissions
        const submissionsRes = await axios.get(
          `http://localhost:5000/api/forms/${formId}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm(formRes.data);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  if (!form) return null;

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{form.name} — Submissions</h2>

        <button onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>User</th>

                {form.fields.map((field) => (
                  <th key={field.id} style={thStyle}>
                    {field.label}
                  </th>
                ))}

                <th style={thStyle}>Edited</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td style={tdStyle}>
                    {sub.submittedBy?.name || "Unknown"}
                  </td>

                  {form.fields.map((field) => (
                    <td key={field.id} style={tdStyle}>
                      {sub.values?.[field.id] ?? "-"}
                    </td>
                  ))}

                  <td style={tdStyle}>
                    {sub.isEdited ? "Yes" : "No"}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        navigate(`/submissions/${sub._id}/edit`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  border: "1px solid #555",
  padding: "8px",
  background: "#222",
};

const tdStyle = {
  border: "1px solid #555",
  padding: "8px",
};

export default FormSubmissions;
