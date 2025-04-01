import React from "react";

export default function TicketForm({
  newTicket,
  setNewTicket,
  categories,
  handleAddTicket,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">📝 Add New Ticket</h2>
      <input
        type="text"
        placeholder="Ticket title"
        value={newTicket.title}
        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
        className="w-full border border-gray-300 p-3 rounded-xl"
      />
      <input
        type="text"
        placeholder="Ticket link (optional)"
        value={newTicket.link}
        onChange={(e) => setNewTicket({ ...newTicket, link: e.target.value })}
        className="w-full border border-gray-300 p-3 rounded-xl"
      />
      <textarea
        placeholder="Short description (optional)"
        value={newTicket.description}
        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
        className="w-full border border-gray-300 p-3 rounded-xl resize-none"
      />
      <select
        className="w-full border border-gray-300 p-3 rounded-xl"
        value={newTicket.category}
        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
      >
        {categories.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>
      <button
        onClick={handleAddTicket}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
      >
        Save Ticket
      </button>
    </div>
  );
}
