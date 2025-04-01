import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { db } from "../firebase";
import { ref, update } from "firebase/database";

// Only color the border
const statusBorder = {
  New: "border-blue-500",
  Progress: "border-yellow-500",
  Resolved: "border-green-500",
  Closed: "border-gray-500",
  Released: "border-purple-500",
  done: "border-gray-300", // optional if 'done' is used
};

const statuses = ["New", "Progress", "Resolved", "Closed", "Released"];

function TicketCard({ id, ticket, onToggle, onDelete, onDescChange }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Only apply the border style
  const colorClass = statusBorder[ticket.status] || "border-gray-300";

  // Real-time update of status field
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    await update(ref(db, `tickets/${id}`), { status: newStatus });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-xl shadow hover:shadow-md transition border-l-4 ${colorClass} flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center">
        {/* Dropdown for these 5 statuses */}
        <select
          value={ticket.status || "New"}
          onChange={handleStatusChange}
          className="text-xs font-semibold px-2 py-1 border-none outline-none bg-transparent"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <label className="flex gap-2 items-start">
        <input
          type="checkbox"
          checked={ticket.status === "done"}
          onChange={onToggle}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="text-gray-800 font-medium">{ticket.title}</div>
          {ticket.link && (
            <a
              href={ticket.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 underline"
            >
              {ticket.link}
            </a>
          )}
          <input
            type="text"
            value={ticket.description || ""}
            onChange={(e) => onDescChange(e.target.value)}
            placeholder="Add a note..."
            className="text-sm mt-2 w-full border border-gray-200 rounded-lg px-2 py-1"
          />
        </div>
      </label>
    </div>
  );
}

export default TicketCard;
