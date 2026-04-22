/**
 * Tugas Login FSD — logika autentikasi dengan Supabase Auth
 *
 * Alur singkat (untuk penjelasan ke dosen):
 * 1. createClient() menghubungkan frontend ke project Supabase Anda.
 * 2. Saat form dikirim, kita panggil signInWithPassword({ email, password }).
 * 3. Supabase memvalidasi kredensial; jika benar, session disimpan di browser.
 * 4. getSession() dipakai saat halaman dibuka untuk cek apakah user sudah login.
 */
alert("Halo Rofi, JavaScript sudah aktif!");
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm";

// ─── Konfigurasi: isi dari Dashboard Supabase → Settings → API ─────────────
const SUPABASE_URL = "https://yqosdlshvmxuvzhtldiu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb3NkbHNodm14dXZ6aHRsZGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Njk2MDIsImV4cCI6MjA5MjE0NTYwMn0.T6Hl4jvQ5itG_nUuiqA1lemdJu_6gregBh118VN6Mpg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Referensi elemen DOM ───────────────────────────────────────────────────
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submit-btn");
const btnLabel = document.getElementById("btn-label");
const btnSpinner = document.getElementById("btn-spinner");
const alertBox = document.getElementById("alert");
const loggedInSection = document.getElementById("logged-in");
const userEmailEl = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnSpinner.classList.toggle("hidden", !loading);
  btnLabel.textContent = loading ? "Memproses…" : "Masuk";
}

function showAlert(message, variant) {
  alertBox.textContent = message;
  alertBox.classList.remove("hidden");
  alertBox.className =
    "mb-4 rounded-xl border px-4 py-3 text-sm " +
    (variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-800");
}

function hideAlert() {
  alertBox.classList.add("hidden");
  alertBox.textContent = "";
}

function showLoggedIn(email) {
  form.classList.add("hidden");
  loggedInSection.classList.remove("hidden");
  userEmailEl.textContent = email;
}

function showLoginForm() {
  loggedInSection.classList.add("hidden");
  form.classList.remove("hidden");
  passwordInput.value = "";
}

// Cek session saat pertama kali load (refresh halaman tetap “ingat” login)
async function initSession() {
  hideAlert();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    showAlert(error.message, "error");
    return;
  }
  if (session?.user?.email) {
    showLoggedIn(session.user.email);
  }
}

// Dengarkan perubahan auth (login di tab lain, logout, dll.)
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user?.email) {
    showLoggedIn(session.user.email);
  } else {
    showLoginForm();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const configOk =
    !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
    !SUPABASE_ANON_KEY.startsWith("YOUR_");

  if (!configOk) {
    showAlert(
      "Silakan isi SUPABASE_URL dan SUPABASE_ANON_KEY di script.js terlebih dahulu.",
      "error"
    );
    return;
  }

  setLoading(true);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  setLoading(false);

  if (error) {
    showAlert(error.message || "Login gagal.", "error");
    return;
  }

  if (data.user?.email) {
    showAlert("Login berhasil.", "success");
    showLoggedIn(data.user.email);
  }
});

logoutBtn.addEventListener("click", async () => {
  hideAlert();
  logoutBtn.disabled = true;
  const { error } = await supabase.auth.signOut();
  logoutBtn.disabled = false;
  if (error) {
    showAlert(error.message, "error");
    return;
  }
  showLoginForm();
  showAlert("Anda sudah keluar.", "success");
});

initSession();
