// mern-auth-app\client\src\components\Sidebar.jsx
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "../styles/sidebar.css";

const FIELD_TEMPLATES = [
  { type: "text", label: "Text Field" },
  { type: "email", label: "Email Field" },
  { type: "textarea", label: "Textarea Field" },
];

const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sidebar-item"
      {...listeners}
      {...attributes}
    >
      {label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* TOP */}
      <div className="sidebar-content">
        <h3 className="sidebar-title">Form Fields</h3>

        {FIELD_TEMPLATES.map((field) => (
          <DraggableItem
            key={field.type}
            id={`template-${field.type}`}
            label={field.label}
          />
        ))}
      </div>

      {/* BOTTOM */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
