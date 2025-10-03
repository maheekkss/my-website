import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username dan password wajib diisi." }, { status: 400 });
    }

    // 🔹 Cari user di DB
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 401 });
    }

    // 🔹 Cek password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    // 🔹 Generate token (sementara manual)
    const token = `${user.id}-${Date.now()}`;

    // 🔹 Buat response
    const res = NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        username: user.username,
      },
    });

    // 🔹 Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false, // <--- penting kalau masih localhost
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
