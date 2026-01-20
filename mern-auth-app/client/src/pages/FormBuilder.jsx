import { useEffect, useState } from "react";
import { saveForm, getForms, updateForm, deleteForm } from "../services/formApi";
import Sidebar from "../components/Sidebar";

import {
  DndContext,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";

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
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "8px",
    background: "#111",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", color: "#aaa" }}>
        ⠿ Drag
      </div>

      <div><strong>Type:</strong> {field.type}</div>

      <input
        type="text"
        value={field.label}
        onChange={(e) =>
          setFields(prev =>
            prev.map(f =>
              f.id === field.id ? { ...f, label: e.target.value } : f
            )
          )
        }
        style={{ width: "100%", marginTop: "5px" }}
      />

      <label>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) =>
            setFields(prev =>
              prev.map(f =>
                f.id === field.id
                  ? { ...f, required: e.target.checked }
                  : f
              )
            )
          }
        />{" "}
        Required
      </label>

      <button
        onClick={() =>
          setFields(prev => prev.filter(f => f.id !== field.id))
        }
        style={{ background: "red", color: "white", marginTop: "5px" }}
      >
        Delete
      </button>
    </div>
  );
};

/* ---------- Canvas ---------- */
const Canvas = ({ fields, setFields }) => {
  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: "400px",
        border: "2px dashed #555",
        padding: "15px",
      }}
    >
      <h3>Form Fields</h3>

      <SortableContext
        items={fields.map(f => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {fields.map(field => (
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
    if (!formName || fields.length === 0) {
      alert("Form name and at least one field are required");
      return;
    }

    if (editingFormId) {
      await updateForm(editingFormId, { name: formName, fields });
      alert("Form updated successfully");
    } else {
      await saveForm({ name: formName, fields });
      alert("Form created successfully");
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
  const confirm = window.confirm("Are you sure you want to delete this form?");
  if (!confirm) return;

  await deleteForm(id);

  setSavedForms((prev) => prev.filter((f) => f._id !== id));

  // if deleting currently edited form
  if (id === editingFormId) {
    setFormName("");
    setFields([]);
    setEditingFormId(null);
  }

  fetchForms();
};


  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        if (over.id === "canvas" && active.id.startsWith("template-")) {
          const type = active.id.replace("template-", "");
          setFields(prev => [
            ...prev,
            { id: Date.now().toString(), type, label: `${type} field`, required: false }
          ]);
          return;
        }

        if (active.id !== over.id) {
          setFields(prev => {
            const oldIndex = prev.findIndex(f => f.id === active.id);
            const newIndex = prev.findIndex(f => f.id === over.id);
            const copy = [...prev];
            const [moved] = copy.splice(oldIndex, 1);
            copy.splice(newIndex, 0, moved);
            return copy;
          });
        }
      }}
    >
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <button onClick={resetBuilder}>+ Create </button>

          <input
            placeholder="Form Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
          />

          <Canvas fields={fields} setFields={setFields} />

          <button onClick={handleSave}>
            {editingFormId ? "Update Form" : "Save Form"}
          </button>
        </div>

        <div style={{ width: "300px", padding: "15px" }}>
          <h3>Saved Forms</h3>
          {savedForms.map(form => (
            <div
            key={form._id}
            style={{
              border: form._id === editingFormId ? "2px solid green" : "1px solid #555",
              padding: "10px",
              marginBottom: "10px",
            }}
            >
            <div
              onClick={() => loadForm(form)}
              style={{ cursor: "pointer" }}
            >
              <strong>{form.name}</strong>
              <div>{form.fields.length} fields</div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(form._id);
              }}
              style={{
                marginTop: "5px",
                background: "red",
                color: "white",
                width: "100%",
              }}
            >
              Delete
            </button>
          </div>

          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default FormBuilder;
