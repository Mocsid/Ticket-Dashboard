import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, push, update, remove, set } from "firebase/database";
import { Trash2 } from "lucide-react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import TicketCard from "./components/TicketCard";

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

  // We only separate "done" from everything else
  // The 5 statuses all remain in "open" group unless status is "done".

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    // Load tickets
    onValue(ref(db, "tickets"), (snap) => {
      setTickets(snap.val() || {});
    });

    // Load categories
    onValue(ref(db, "categories"), (snap) => {
      const cats = snap.val() || {};
      const keys = Object.keys(cats);
      setCategories(keys);
      if (!newTicket.category && keys.length > 0) {
        setNewTicket((prev) => ({ ...prev, category: keys[0] }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const newRef = push(ref(db, "tickets"));
    await set(newRef, {
      ...newTicket,
      status: "New",   // default status
      createdAt: Date.now(),
      position: 0,
    });
    setNewTicket({ title: "", category: categories[0] || "", link: "", description: "" });
    setShowTicketForm(false);
    flashMessage("Ticket created successfully!");
  };

  // The user might still check/uncheck to "done" outside of the 5 statuses (optional).
  // If you no longer want a "done" checkbox, remove or adjust.
  const handleToggle = (id, currentStatus) => {
    // "done" is separate from the 5 statuses
    const newStatus = currentStatus === "done" ? "New" : "done";
    update(ref(db, `tickets/${id}`), { status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      remove(ref(db, `tickets/${id}`));
    }
  };

  const handleDescriptionChange = (id, value) => {
    update(ref(db, `tickets/${id}`), { description: value });
  };

  // Non-done tickets = "open group"
  const openTickets = Object.entries(tickets)
    .filter(([, t]) => t.status !== "done");

  // done tickets
  const doneTickets = Object.entries(tickets)
    .filter(([, t]) => t.status === "done");

  /**
   * handleDragEnd (like a local reorder in the same category).
   * If you want cross-category drag, you'd add logic for that.
   */
  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTicket = tickets[activeId];
    const overTicket = tickets[overId];
    if (!activeTicket || !overTicket) return;

    if (activeTicket.category !== overTicket.category) return;

    // gather that category's non-done tickets
    const cat = activeTicket.category;
    const catGroup = Object.entries(tickets)
      .filter(([, t]) => t.status !== "done" && t.category === cat)
      .sort((a, b) => (a[1].position ?? 0) - (b[1].position ?? 0));

    const oldIndex = catGroup.findIndex(([id]) => id === activeId);
    const newIndex = catGroup.findIndex(([id]) => id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    // local reorder
    const newGroup = [...catGroup];
    const [moved] = newGroup.splice(oldIndex, 1);
    newGroup.splice(newIndex, 0, moved);

    // local state update
    const newTickets = { ...tickets };
    newGroup.forEach(([id], i) => {
      newTickets[id] = { ...newTickets[id], position: i };
    });
    setTickets(newTickets);

    // push to Firebase
    for (let i = 0; i < newGroup.length; i++) {
      const [id] = newGroup[i];
      await update(ref(db, `tickets/${id}`), { position: i });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-blue-800">
          🎟️ Ticket Dashboard
        </h1>

        {message && (
          <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-semibold shadow">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            onClick={() => setShowTicketForm(!showTicketForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {showTicketForm ? "Hide Ticket Form" : "➕ Add Ticket"}
          </button>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
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
            />

            {/* If you want to set the status at creation, do it here.
                For now, we default to 'New' automatically. */}
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

        {/* Drag+Drop for non-done tickets */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {categories.map((cat) => {
            // gather non-done tickets in this category
            const group = Object.entries(tickets)
              .filter(([, t]) => t.status !== "done" && t.category === cat)
              .sort((a, b) => (a[1].position ?? 0) - (b[1].position ?? 0));

            if (group.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-1">
                  📂 {cat}
                </h3>
                <SortableContext items={group.map(([id]) => id)} strategy={rectSortingStrategy}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {group.map(([id, ticket]) => (
                      <TicketCard
                        key={id}
                        id={id}
                        ticket={ticket}
                        onToggle={() => handleToggle(id, ticket.status)}
                        onDelete={() => handleDelete(id)}
                        onDescChange={(val) => handleDescriptionChange(id, val)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </DndContext>

        {/* Done tickets */}
        {doneTickets.length > 0 && (
          <div className="pt-10 space-y-4">
            <h2 className="text-xl font-bold text-green-700 border-b border-green-200 pb-1">
              ✅ Done Tickets
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {doneTickets.map(([id, ticket]) => (
                <div
                  key={id}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm flex justify-between items-start"
                >
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggle(id, ticket.status)}
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
                        <div className="text-sm text-gray-400 mt-1">
                          {ticket.description}
                        </div>
                      )}
                    </div>
                  </label>
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
