import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://yqosdlshvmxuvzhtldiu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5PYYGfbxvEx14N2lE5KStw_bc65PMc0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const modeLoginBtn = document.getElementById("mode-login");
const modeRegisterBtn = document.getElementById("mode-register");

let mode = "login";

function updateModeUI() {
  const isLogin = mode === "login";
  formTitle.textContent = isLogin ? "Login Akun" : "Daftar Akun";
  submitBtn.textContent = isLogin ? "Login" : "Register";

  modeLoginBtn.className = isLogin
    ? "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition"
    : "rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800";

  modeRegisterBtn.className = !isLogin
    ? "rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition"
    : "rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800";
}

modeLoginBtn.addEventListener("click", () => {
  mode = "login";
  updateModeUI();
});

modeRegisterBtn.addEventListener("click", () => {
  mode = "register";
  updateModeUI();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email dan password tidak boleh kosong.");
    return;
  }

  try {
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(`Register gagal: ${error.message}`);
        return;
      }

      alert("Register berhasil! Silakan cek email untuk verifikasi jika diminta.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Login gagal: ${error.message}`);
      return;
    }

    alert("Login berhasil!");
  } catch (err) {
    alert(`Terjadi kesalahan: ${err.message}`);
  }
});

updateModeUI();
