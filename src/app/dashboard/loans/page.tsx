"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Loan = {
  id: number;
  nama_anggota: string;
  judul_buku: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [namaAnggota, setNamaAnggota] = useState("");
  const [judulBuku, setJudulBuku] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");

  // Ambil data dari Supabase saat load
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const { data, error } = await supabase.from("loans").select("*");
    if (error) {
      console.error("Gagal ambil data:", error.message);
    } else {
      setLoans(data || []);
    }
  };

  const addLoan = async () => {
    if (!namaAnggota || !judulBuku || !tanggalPinjam || !tanggalKembali) return;

    const { data, error } = await supabase.from("loans").insert([
      {
        nama_anggota: namaAnggota,
        judul_buku: judulBuku,
        tanggal_pinjam: tanggalPinjam,
        tanggal_kembali: tanggalKembali,
      },
    ]);

    if (error) {
      console.error("Gagal tambah:", error.message, error.details);
    } else {
      setNamaAnggota("");
      setJudulBuku("");
      setTanggalPinjam("");
      setTanggalKembali("");
      fetchLoans(); // refresh data setelah tambah
    }
  };

  const deleteLoan = async (id: number) => {
    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) {
      console.error("Gagal hapus:", error.message);
    } else {
      fetchLoans();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Peminjaman Buku</h1>
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Tambah Peminjaman</h2>
        <input
          type="text"
          placeholder="Nama Anggota"
          value={namaAnggota}
          onChange={(e) => setNamaAnggota(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Judul Buku"
          value={judulBuku}
          onChange={(e) => setJudulBuku(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="date"
          value={tanggalPinjam}
          onChange={(e) => setTanggalPinjam(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="date"
          value={tanggalKembali}
          onChange={(e) => setTanggalKembali(e.target.value)}
          className="border p-2 mr-2 mb-2"
        />
        <button
          onClick={addLoan}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tambah
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-2">Daftar Peminjaman</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nama Anggota</th>
              <th className="border p-2">Judul Buku</th>
              <th className="border p-2">Tgl Pinjam</th>
              <th className="border p-2">Tgl Kembali</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td className="border p-2">{loan.nama_anggota}</td>
                <td className="border p-2">{loan.judul_buku}</td>
                <td className="border p-2">{loan.tanggal_pinjam}</td>
                <td className="border p-2">{loan.tanggal_kembali}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteLoan(loan.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-2">
                  Belum ada peminjaman
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
