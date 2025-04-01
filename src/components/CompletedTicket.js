import React from "react";
import { Trash2 } from "lucide-react";

export default function CompletedTicket({ id, ticket, onToggle, onDelete }) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-start">
      <label className="flex gap-3 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={true}
          onChange={() => onToggle(id, ticket.status)}
          className="mt-1"
        />
        <div className="text-gray-500 line-through">
          {ticket.title}
          {ticket.link && (
            <div>
              <a
                href={ticket.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 underline"
              >
                {ticket.link}
              </a>
            </div>
          )}
          {ticket.description && (
            <div className="text-sm text-gray-400 mt-1">{ticket.description}</div>
          )}
        </div>
      </label>
      <button
        onClick={() => onDelete(id)}
        className="text-red-400 hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
