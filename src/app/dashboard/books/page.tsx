"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// 1. Mengubah 'heading' menjadi 'judul_buku' di interface
interface Book {
  id: number;
  judul_buku: string;
  penulis: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🔹 Ambil data dari Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      // Perhatikan: select() akan mengambil semua kolom termasuk 'judul_buku'
      const { data, error } = await supabase.from("books").select("*");
      if (error) {
        console.error("Error fetching books:", error);
      } else {
        setBooks(data || []);
      }
    };

    fetchBooks();
  }, []);

  // 🔹 Tambah atau Update Buku
  const handleAddBook = async () => {
    if (!title || !author) return alert("Isi semua data buku!");

    if (editingId) {
      // UPDATE buku
      // 2. Mengubah 'heading' menjadi 'judul_buku' saat update
      const { error } = await supabase
        .from("books")
        .update({ judul_buku: title, penulis: author })
        .eq("id", editingId);

      if (error) {
        console.error("Error updating book:", error.message);
      } else {
        // Perbarui state lokal
        setBooks(
          books.map((b) =>
            b.id === editingId ? { ...b, judul_buku: title, penulis: author } : b
          )
        );
        setEditingId(null);
      }
    } else {
      // INSERT buku baru
      // 3. Mengubah 'heading' menjadi 'judul_buku' saat insert
      const { data, error } = await supabase
        .from("books")
        .insert([{ judul_buku: title, penulis: author }])
        .select();

      if (error) {
        console.error("Error adding book:", error.message);
      } else if (data) {
        setBooks([...books, ...data]);
      }
    }

    setTitle("");
    setAuthor("");
  };

  // 🔹 Ambil data buku yang mau diedit
  const handleEdit = (id: number) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    // 4. Mengubah 'book.heading' menjadi 'book.judul_buku'
    setTitle(book.judul_buku);
    setAuthor(book.penulis);
    setEditingId(book.id);
  };

  // 🔹 Hapus buku
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      console.error("Error deleting book:", error.message);
    } else {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📚 Data Buku</h1>

      {/* Form Tambah/Edit Buku */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Judul Buku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Penulis"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleAddBook}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {editingId ? "Update Buku" : "Tambah Buku"}
        </button>
      </div>

      {/* Tabel Buku */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No</th>
            <th className="border p-2">Judul</th>
            <th className="border p-2">Penulis</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={book.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                {/* 5. Mengubah 'book.heading' menjadi 'book.judul_buku' untuk ditampilkan */}
                <td className="border p-2">{book.judul_buku}</td>
                <td className="border p-2">{book.penulis}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(book.id)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="border p-2 text-center text-gray-500"
              >
                Belum ada buku.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}