// Server Node.js sederhana (tanpa dependency) untuk jalanin lokal: npm start
// Di Vercel, folder "public" otomatis di-serve sebagai static site (server.js tidak dipakai),
// jadi di sana selalu MODE DEPLOY (kunci tanggal aktif).
const http = require("http");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const TANYA_DETIK = 5;

let MODE_TES = false;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// Alamat IP lokal (untuk dibuka dari perangkat lain di WiFi yang sama).
// Di sebagian Android/Termux os.networkInterfaces() bisa error, jadi dibungkus try/catch.
function alamatJaringan() {
  try {
    return Object.values(os.networkInterfaces())
      .flat()
      .filter((i) => i && i.family === "IPv4" && !i.internal)
      .map((i) => i.address);
  } catch (e) {
    return [];
  }
}

// Tanya "Mode tes? (y/n)". y = tes (kunci tanggal mati), n / tidak dijawab 5 detik = deploy.
function tanyaMode() {
  return new Promise((resolve) => {
    const env = (process.env.TEST_MODE || "").trim().toLowerCase();
    if (env === "y") return resolve(true);
    if (env === "n") return resolve(false);
    if (!process.stdin.isTTY) return resolve(false); // tidak interaktif -> deploy

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    let selesai = false;
    const akhiri = (nilai) => {
      if (selesai) return;
      selesai = true;
      clearTimeout(timer);
      rl.close();
      resolve(nilai);
    };
    const timer = setTimeout(() => {
      console.log("\n(tidak ada jawaban) -> MODE DEPLOY");
      akhiri(false);
    }, TANYA_DETIK * 1000);
    rl.question(`Mode tes? (y/n) [${TANYA_DETIK} detik, default n = deploy]: `, (a) =>
      akhiri(a.trim().toLowerCase() === "y")
    );
  });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // Flag mode dikirim ke browser lewat file ini (di Vercel dipakai public/mode.js yang isinya false)
  if (urlPath === "/mode.js") {
    res.writeHead(200, {
      "Content-Type": MIME[".js"],
      "Cache-Control": "no-store",
    });
    return res.end(`window.TEST_MODE = ${MODE_TES};`);
  }

  const filePath = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 - Halaman tidak ditemukan");
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const range = req.headers.range;

    // Range request: dibutuhkan browser untuk audio (play, loop, seek)
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] !== "" ? parseInt(m[1], 10) : 0;
      let end = m && m[2] !== "" ? parseInt(m[2], 10) : st.size - 1;
      if (m && m[1] === "" && m[2] !== "") {
        start = Math.max(0, st.size - parseInt(m[2], 10));
        end = st.size - 1;
      }
      if (start > end || start >= st.size) {
        res.writeHead(416, { "Content-Range": `bytes */${st.size}` });
        return res.end();
      }
      end = Math.min(end, st.size - 1);
      res.writeHead(206, {
        "Content-Type": type,
        "Content-Range": `bytes ${start}-${end}/${st.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
      });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": st.size,
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

tanyaMode().then((tes) => {
  MODE_TES = tes;
  server.listen(PORT, () => {
    console.log(
      MODE_TES
        ? "MODE TES: kunci tanggal MATI (halaman bisa dibuka kapan saja)"
        : "MODE DEPLOY: kunci tanggal AKTIF (baru terbuka 29 Okt 2026)"
    );
    console.log(`Server jalan di http://localhost:${PORT}`);
    for (const ip of alamatJaringan()) {
      console.log(`Dari laptop / HP lain (satu WiFi): http://${ip}:${PORT}`);
    }
  });
});
