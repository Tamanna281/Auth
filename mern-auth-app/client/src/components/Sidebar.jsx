import { useDraggable } from "@dnd-kit/core";

const FIELD_TEMPLATES = [
  { type: "text", label: "Text Field" },
  { type: "email", label: "Email Field" },
  { type: "textarea", label: "Textarea Field" },
];

const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #888",
    background: isDragging ? "#333" : "#1e1e1e",
    cursor: "grab",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div
      style={{
        width: "250px",
        padding: "15px",
        borderRight: "2px solid #444",
      }}
    >
      <h3>Form Fields</h3>

      {FIELD_TEMPLATES.map((field) => (
        <DraggableItem
          key={field.type}
          id={`template-${field.type}`}
          label={field.label}
        />
      ))}
    </div>
  );
};

export default Sidebar;
