"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type ReturnItem = {
  id: number;
  judul_buku: string;
  nama_anggota: string;
  tanggal_kembali: string;
  kondisi: string;
  catatan?: string;
};

export default function ReturnsPage() {
  const [returnsList, setReturnsList] = useState<ReturnItem[]>([]);
  const [judul_buku, setJudulBuku] = useState("");
  const [nama_anggota, setNamaAnggota] = useState("");
  const [tanggal_kembali, setTanggalKembali] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [kondisi, setKondisi] = useState("Baik");
  const [catatan, setCatatan] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // ambil data dari supabase
  useEffect(() => {
    fetchReturns();
  }, []);

  async function fetchReturns() {
    const { data, error } = await supabase.from("returns").select("*");
    if (error) {
      console.error("Gagal ambil data:", error.message);
    } else {
      setReturnsList(data as ReturnItem[]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!judul_buku.trim() || !nama_anggota.trim()) {
      return alert("Isi judul buku dan nama anggota.");
    }

    if (editingId !== null) {
      // update data
      const { error } = await supabase
        .from("returns")
        .update({ judul_buku, nama_anggota, tanggal_kembali, kondisi, catatan })
        .eq("id", editingId);

      if (error) {
        alert("Gagal update: " + error.message);
      } else {
        alert("Data berhasil diupdate!");
        fetchReturns();
        resetForm();
      }
    } else {
      // insert data baru
      const { error } = await supabase.from("returns").insert([
        { judul_buku, nama_anggota, tanggal_kembali, kondisi, catatan },
      ]);

      if (error) {
        alert("Gagal tambah: " + error.message);
      } else {
        alert("Data berhasil ditambahkan!");
        fetchReturns();
        resetForm();
      }
    }
  }

  const resetForm = () => {
    setJudulBuku("");
    setNamaAnggota("");
    setTanggalKembali(new Date().toISOString().slice(0, 10));
    setKondisi("Baik");
    setCatatan("");
    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    const found = returnsList.find((r) => r.id === id);
    if (!found) return;
    setJudulBuku(found.judul_buku);
    setNamaAnggota(found.nama_anggota);
    setTanggalKembali(found.tanggal_kembali);
    setKondisi(found.kondisi);
    setCatatan(found.catatan ?? "");
    setEditingId(found.id);
  };

  async function handleDelete(id: number) {
    if (!confirm("Hapus data pengembalian ini?")) return;

    const { error } = await supabase.from("returns").delete().eq("id", id);

    if (error) {
      alert("Gagal hapus: " + error.message);
    } else {
      alert("Data berhasil dihapus!");
      fetchReturns();
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🔁 Pengembalian</h1>

      {/* Form tambah / edit */}
      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm">Judul Buku</label>
          <input
            value={judul_buku}
            onChange={(e) => setJudulBuku(e.target.value)}
            className="border p-2 rounded"
            placeholder="Judul buku"
            required
          />
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm">Nama Anggota</label>
          <input
            value={nama_anggota}
            onChange={(e) => setNamaAnggota(e.target.value)}
            className="border p-2 rounded"
            placeholder="Nama anggota"
            required
          />
        </div>

        <div className="flex gap-3 mb-3">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm">Tanggal Pengembalian</label>
            <input
              type="date"
              value={tanggal_kembali}
              onChange={(e) => setTanggalKembali(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div className="w-48 flex flex-col gap-2">
            <label className="text-sm">Kondisi</label>
            <select
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value)}
              className="border p-2 rounded"
            >
              <option>Baik</option>
              <option>Rusak Ringan</option>
              <option>Rusak Berat</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-3">
          <label className="text-sm">Catatan (opsional)</label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="border p-2 rounded"
            rows={3}
            placeholder="Catatan kondisi buku atau lainnya"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Simpan Perubahan" : "Tambah Pengembalian"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Tabel daftar pengembalian */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">No</th>
              <th className="border p-2">Judul</th>
              <th className="border p-2">Anggota</th>
              <th className="border p-2">Tanggal</th>
              <th className="border p-2">Kondisi</th>
              <th className="border p-2">Catatan</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {returnsList.length === 0 ? (
              <tr>
                <td colSpan={7} className="border p-3 text-center text-gray-500">
                  Belum ada data pengembalian.
                </td>
              </tr>
            ) : (
              returnsList.map((r, i) => (
                <tr key={r.id}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{r.judul_buku}</td>
                  <td className="border p-2">{r.nama_anggota}</td>
                  <td className="border p-2">{r.tanggal_kembali}</td>
                  <td className="border p-2">{r.kondisi}</td>
                  <td className="border p-2">{r.catatan ?? "-"}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEdit(r.id)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
