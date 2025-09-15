"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" }); // hapus cookie di server
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Perpustakaan</h2>
        <ul>
          <li className="mb-3 hover:text-blue-300">
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <Link href="/dashboard/books">Data Buku</Link>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <Link href="/dashboard/members">Data Anggota</Link>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <Link href="/dashboard/loans">Peminjaman</Link>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <Link href="/dashboard/returns">Pengembalian</Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 w-full p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Selamat Datang!</h1>
        <p className="text-lg">Ini adalah dashboard perpustakaan kamu.</p>
      </main>
    </div>
  );
}
