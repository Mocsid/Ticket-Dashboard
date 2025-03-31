import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, push, update, remove, set } from "firebase/database";
import { Trash2 } from "lucide-react";

function App() {
  const [tickets, setTickets] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "",
    link: "",
    description: "",
  });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    onValue(ref(db, "tickets"), (snap) => setTickets(snap.val() || {}));
    onValue(ref(db, "categories"), (snap) => {
      const cats = snap.val() || {};
      const keys = Object.keys(cats);
      setCategories(keys);
      if (!newTicket.category && keys.length > 0) {
        setNewTicket((prev) => ({ ...prev, category: keys[0] }));
      }
    });
  }, []);

  const flashMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    await set(ref(db, `categories/${newCategory.trim()}`), true);
    setNewCategory("");
    setShowCategoryForm(false);
    flashMessage("Category added successfully!");
  };

  const handleAddTicket = async () => {
    if (!newTicket.title.trim()) return;
    await push(ref(db, "tickets"), {
      ...newTicket,
      status: "open",
      createdAt: Date.now(),
    });
    setNewTicket({ title: "", category: categories[0] || "", link: "", description: "" });
    setShowTicketForm(false);
    flashMessage("Ticket created successfully!");
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "done" ? "open" : "done";
    update(ref(db, `tickets/${id}`), { status: newStatus });
  };

  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Are you sure you want to delete this ticket?")) {
      remove(ref(db, `tickets/${id}`));
    }
  };

  const openTickets = Object.entries(tickets).filter(([, t]) => t.status === "open");
  const doneTickets = Object.entries(tickets).filter(([, t]) => t.status === "done");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-800">🎟️ Ticket Dashboard</h1>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-semibold shadow">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={() => setShowTicketForm((s) => !s)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {showTicketForm ? "Hide Ticket Form" : "➕ Add Ticket"}
          </button>
          <button
            onClick={() => setShowCategoryForm((s) => !s)}
            className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition"
          >
            {showCategoryForm ? "Hide Category Form" : "📂 Add Category"}
          </button>
        </div>

        {showTicketForm && (
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
            ></textarea>
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
        )}

        {showCategoryForm && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">📂 Add New Category</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Backend, API"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 border p-3 rounded-xl"
              />
              <button
                onClick={handleAddCategory}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {categories.map((cat) => {
          const group = openTickets.filter(([, t]) => t.category === cat);
          if (group.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-1">📂 {cat}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {group.map(([id, ticket]) => (
                  <div
                    key={id}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <label className="flex gap-3 items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ticket.status === "done"}
                          onChange={() => handleToggle(id, ticket.status)}
                          className="mt-1"
                        />
                        <div>
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
                            onChange={(e) =>
                              update(ref(db, `tickets/${id}`), { description: e.target.value })
                            }
                            placeholder="Add a note..."
                            className="text-sm mt-2 w-full border border-gray-200 rounded-lg px-2 py-1"
                          />
                        </div>
                      </label>
                    </div>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {doneTickets.length > 0 && (
          <div className="pt-10 space-y-4">
            <h2 className="text-xl font-bold text-green-700 border-b border-green-200 pb-1">
              ✅ Completed Tickets
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doneTickets.map(([id, ticket]) => (
                <div
                  key={id}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-start"
                >
                  <div className="flex-1">
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggle(id, ticket.status)}
                      className="mt-1"
                    />
                    <div className="text-gray-500 line-through">{ticket.title}</div>
                  </label>

                    {ticket.link && (
                      <a
                        href={ticket.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 underline"
                      >
                        {ticket.link}
                      </a>
                    )}
                    <div className="text-sm text-gray-400 mt-1">{ticket.description}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
