import fs from "fs";
const url = process.env.supabase_project_url || process.env.VITE_SUPABASE_URL || "https://wsrcdedaqjnajlvkhyht.supabase.co";
const anon = process.env.supabase_anon_key || process.env.VITE_SUPABASE_ANON_KEY;
console.log("Writing to .env...");
fs.writeFileSync(".env", `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${anon}\n`);
