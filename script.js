import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://yqosdlshvmxuvzhtldiu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5PYYGfbxvEx14N2lE5KStw_bc65PMc0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email dan password tidak boleh kosong.");
    return;
  }

  try {
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
