import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/formSubmissions.css";

const FormSubmissions = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const formRes = await axios.get(
          `http://localhost:5000/api/forms/${formId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const submissionsRes = await axios.get(
          `http://localhost:5000/api/forms/${formId}/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm(formRes.data);
        setSubmissions(submissionsRes.data);
      } catch {
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  if (loading)
    return <div className="submissions-state">Loading submissions…</div>;

  if (error)
    return (
      <div className="submissions-state error">
        {error}
      </div>
    );

  if (!form) return null;

  return (
    <div className="submissions-wrapper">
      <div className="submissions-header">
        <div>
          <h2>{form.name}</h2>
          <p>All submitted responses</p>
        </div>

        <button className="btn secondary" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="submissions-empty">
          <h3>No submissions yet</h3>
          <p>Responses will appear here once submitted.</p>
        </div>
      ) : (
        <div className="submissions-table-wrapper">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>User</th>
                {form.fields.map((f) => (
                  <th key={f.id}>{f.label}</th>
                ))}
                <th>Edited</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub._id}
                  className="clickable-row"
                  onClick={() => setSelected(sub)}
                >
                  <td className="user-cell">
                    {sub.submittedBy?.name || "Unknown"}
                  </td>

                  {form.fields.map((f) => (
                    <td key={f.id}>
                      {sub.values?.[f.id] || "—"}
                    </td>
                  ))}

                  <td>{sub.isEdited ? "Yes" : "No"}</td>

                  <td>
                    <button
                      className="btn small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/forms/${formId}/edit`);
                      }}
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

      {/* PREVIEW PANEL */}
      {selected && (
        <div className="preview-overlay" onClick={() => setSelected(null)}>
          <div
            className="preview-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="preview-header">
              <h3>Submission Preview</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <p className="preview-user">
              {selected.submittedBy?.name || "Unknown user"}
            </p>

            <div className="preview-fields">
              {form.fields.map((field) => (
                <div key={field.id} className="preview-field">
                  <span>{field.label}</span>
                  <p>{selected.values?.[field.id] || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;
