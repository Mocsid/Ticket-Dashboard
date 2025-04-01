import React from "react";

export default function CategoryForm({
  newCategory,
  setNewCategory,
  handleAddCategory,
}) {
  return (
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
  );
}
