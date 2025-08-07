import React, { useState, useEffect, type FormEvent } from "react";
import {
  getAllMerch,
  addMerch,
  updateMerch,
  deleteMerch,
  uploadMerchImage,
  type MerchItem,
} from "../../firebase/merchService";

const MerchManagement: React.FC = () => {
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [sizes, setSizes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    const items = await getAllMerch();
    setMerch(items);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setSizes("");
    setImageFile(null);
    setIsPublished(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || (!imageFile && !editingId)) {
      alert("Please fill out all required fields.");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadMerchImage(imageFile);
    }

    const merchData: Partial<MerchItem> = {
      name,
      description,
      price,
      sizes: sizes.split(",").map((s) => s.trim()),
      isPublished,
    };

    if (imageUrl) {
        merchData.imageUrl = imageUrl;
    }

    if (editingId) {
      await updateMerch(editingId, merchData);
    } else {
      await addMerch(merchData as MerchItem);
    }

    resetForm();
    fetchMerch();
  };

  // Basic form and list rendering. You can style this to match your admin panel.
  return (
    <div>
      <h2>Merchandise Management</h2>
      <form onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit" : "Add"} Item</h3>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
        <input type="text" placeholder="Sizes (comma-separated)" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        <input type="file" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
        <label>
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
        <button type="submit">{editingId ? "Update" : "Add"} Item</button>
        {editingId && <button onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h3>Current Merchandise</h3>
      <ul>
        {merch.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} - {item.isPublished ? "Published" : "Draft"}
            <button onClick={() => { /* Logic to populate form for editing */ setEditingId(item.id!); setName(item.name); /* etc. */ }}>Edit</button>
            <button onClick={async () => { await deleteMerch(item.id!); fetchMerch(); }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MerchManagement;