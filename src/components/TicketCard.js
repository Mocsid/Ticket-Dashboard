// TicketCard.js
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

export default function TicketCard({ id, ticket, onToggle, onDelete, onDescChange }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-xl shadow flex flex-col gap-2 border-l-4 border-blue-300"
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
          {ticket.category}
        </span>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
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
