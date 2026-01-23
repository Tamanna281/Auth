// mern-auth-app\client\src\pages\FormBuilder.jsx
import { useEffect, useState } from "react";
import { saveForm, getForms, updateForm, deleteForm } from "../services/formApi";
import Sidebar from "../components/Sidebar";
import "../styles/formBuilder.css";

import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ---------- Sortable Field ---------- */
const SortableField = ({ field, setFields }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  opacity: transform ? 0.85 : 1,
};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="field-card animate-in"
    >
      <div className="field-drag" {...attributes} {...listeners}>
        ⠿
      </div>

      <div className="field-body">
        <span className="field-type">{field.type}</span>

        <input
          value={field.label}
          onChange={(e) =>
            setFields((prev) =>
              prev.map((f) =>
                f.id === field.id ? { ...f, label: e.target.value } : f
              )
            )
          }
        />

        <div className="field-actions">
          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) =>
                setFields((prev) =>
                  prev.map((f) =>
                    f.id === field.id
                      ? { ...f, required: e.target.checked }
                      : f
                  )
                )
              }
            />
            Required
          </label>

          <button
            className="btn danger"
            onClick={() =>
              setFields((prev) => prev.filter((f) => f.id !== field.id))
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Canvas ---------- */
const Canvas = ({ fields, setFields }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      className={`canvas ${isOver ? "canvas-active" : ""}`}
    >
      <h3>Form Fields</h3>

      {fields.length === 0 && (
        <div className="canvas-placeholder">
          Drag fields here
        </div>
      )}

      <SortableContext
        items={fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {fields.map((field) => (
          <SortableField
            key={field.id}
            field={field}
            setFields={setFields}
          />
        ))}
      </SortableContext>
    </div>
  );
};

/* ---------- Main Builder ---------- */
const FormBuilder = () => {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const [savedForms, setSavedForms] = useState([]);
  const [editingFormId, setEditingFormId] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const res = await getForms();
    setSavedForms(
      res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  };

  const handleSave = async () => {
    if (!formName || fields.length === 0) return;

    if (editingFormId) {
      await updateForm(editingFormId, { name: formName, fields });
    } else {
      await saveForm({ name: formName, fields });
    }

    fetchForms();
  };

  const loadForm = (form) => {
    setFormName(form.name);
    setFields(form.fields);
    setEditingFormId(form._id);
  };

  const resetBuilder = () => {
    setFormName("");
    setFields([]);
    setEditingFormId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this form?")) return;
    await deleteForm(id);
    fetchForms();
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        /* CREATE from sidebar */
        if (
          active.id.startsWith("template-") &&
          over.id === "canvas"
        ) {
          const type = active.id.replace("template-", "");

          setFields((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              type,
              label: `${type} field`,
              required: false,
            },
          ]);

          return;
        }

        /* REORDER */
        if (active.id !== over.id) {
          setFields((prev) => {
            const oldIndex = prev.findIndex((f) => f.id === active.id);
            const newIndex = prev.findIndex((f) => f.id === over.id);

            if (oldIndex === -1 || newIndex === -1) return prev;

            const updated = [...prev];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);
            return updated;
          });
        }
      }}
    >
      <div className="builder-layout">
        <Sidebar />

        <div className="builder-main">
          <div className="builder-panel">
            <input
              className="form-name-input"
              placeholder="Form name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            <Canvas fields={fields} setFields={setFields} />

            <div className="builder-actions">
              <button className="btn primary" onClick={handleSave}>
                {editingFormId ? "Update" : "Save"}
              </button>
              <button className="btn secondary" onClick={resetBuilder}>
                New
              </button>
            </div>
          </div>

          <div className="forms-panel">
            <h3>Saved Forms</h3>

            {savedForms.map((form) => (
              <div
                key={form._id}
                className={`form-card ${
                  form._id === editingFormId ? "active" : ""
                }`}
              >
                <div className="form-info" onClick={() => loadForm(form)}>
                  <h4>{form.name}</h4>
                  <span>{form.fields.length} fields</span>
                </div>

                <div className="form-actions">
                  <button
                    className="btn secondary"
                    onClick={() =>
                      (window.location.href = `/forms/${form._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() =>
                      (window.location.href = `/forms/${form._id}/fill`)
                    }
                  >
                    Fill
                  </button>
                  <button
                    className="btn primary"
                    onClick={() =>
                      (window.location.href = `/forms/${form._id}/submissions`)
                    }
                  >
                    Submissions
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(form._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default FormBuilder;
