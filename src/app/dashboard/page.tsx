// app/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });

  // cek user login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // kalau belum login, redirect ke /login
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Perpustakaan</h2>
        <ul>
          <li className="mb-3 hover:text-blue-300">
            <a href="/dashboard">Dashboard</a>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <a href="/dashboard/books">Data Buku</a>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <a href="/dashboard/members">Data Anggota</a>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <a href="/dashboard/loans">Peminjaman</a>
          </li>
          <li className="mb-3 hover:text-blue-300">
            <a href="/dashboard/returns">Pengembalian</a>
          </li>
        </ul>
        <form action="/api/logout" method="post">
          <button
            type="submit"
            className="mt-6 bg-red-500 w-full p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Selamat Datang!</h1>
        <p className="text-lg">Ini adalah dashboard perpustakaan kamu.</p>
      </main>
    </div>
  );
}

