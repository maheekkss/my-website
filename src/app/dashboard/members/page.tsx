"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


type Member = {
  id: number;
  nama: string;
  alamat: string;
  telepon: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  // ambil data dari supabase
  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*");
    if (error) {
      console.error("Gagal fetch members:", error.message);
    } else {
      setMembers(data as Member[]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // tambah data ke supabase
  const addMember = async () => {
    if (!nama || !alamat || !telepon) return;

    const { error } = await supabase
      .from("members")
      .insert([{ nama, alamat, telepon }]);

    if (error) {
      console.error("Gagal tambah member:", error.message);
    } else {
      setNama("");
      setAlamat("");
      setTelepon("");
      fetchMembers(); // refresh data
    }
  };

  // hapus data dari supabase
  const deleteMember = async (id: number) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      console.error("Gagal hapus member:", error.message);
    } else {
      fetchMembers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Data Anggota</h1>

      {/* Form Tambah Anggota */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Tambah Anggota</h2>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="No. Telepon"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <button
          onClick={addMember}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah
        </button>
      </div>

      {/* Tabel Anggota */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Daftar Anggota</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nama</th>
              <th className="border p-2">Alamat</th>
              <th className="border p-2">Telepon</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="border p-2">{m.nama}</td>
                <td className="border p-2">{m.alamat}</td>
                <td className="border p-2">{m.telepon}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteMember(m.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-2">
                  Belum ada anggota
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
