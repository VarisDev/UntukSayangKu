// ====== PENGATURAN ======
// Isi kalau mau tombol "Mau 🥰" di popup akhir membuka chat ke kamu.
// Contoh WhatsApp : "https://wa.me/628xxxxxxxxxx?text=Halo%20Andrax"
// Contoh Telegram : "https://t.me/usernamekamu"
const CONTACT_LINK = "https://wa.me/6285708810570?text=Haloo%20Sayangg";

// Waktu kejutan terbuka (WIB, UTC+7). Format: YYYY-MM-DDTHH:mm:ss+07:00
// Buat ngetes tanpa nunggu: buka situs dengan ?preview=1 (lewati timer)
// atau ?detik=10 (timer 10 detik dari sekarang).
const TARGET_ISO = "2026-10-29T00:00:00+07:00";
const TARGET_MS = new Date(TARGET_ISO).getTime();

// Foto pacar (landscape) di slide "Selamat ulang tahun", tersusun miring bertingkat ke bawah.
// Isi dengan link gambar atau nama file di folder "public". Boleh 1-5 foto, contoh:
//   const PHOTOS = ["foto1.jpg", "foto2.jpg", "https://i.imgur.com/xxxx.jpg"];
// Kosongkan ([]) kalau belum ada, slide tetap jalan tanpa foto.
const PHOTOS = ["https://files.catbox.moe/trzgqh.jpg", "https://files.catbox.moe/vdiot1.jpg", "https://files.catbox.moe/61xz0x.jpg", "https://files.catbox.moe/l2rkmc.jpg"];

const TYPING_SPEED = 38;        // ms per karakter
const NEXT_DELAY = 2500;        // tombol next muncul sekian ms setelah teks selesai

// ({nama} dan {umur} diganti otomatis)
const MSG_UCAPAN =
  "Haloo sayangkuu {nama}, selamat ulang tahun yaaa sayangg, eh iya, btw kamu sekarang umur {umur} yaaa, hehehe, makin tua dong ? 🥰, hehehe maaaf yaaa sayaanggg, cuma bercanda kokk. Serius 😭✌🏻✌🏻...Aku malah suka kok sama cewek yang lebih tua daripada aku, entah kenapa kek lebih nyaman aja sama yang lebih tua, mungkin bisa ngertiin sifat ku yang aneh ini sih kayaknya wkwkwk..";

const MSG_TERIMAKASIH =
  "Aku cuma mau bilang, terimakasih telah hadir di hidup ku ya sayang, terimakasih kamu telah menemani hari hari ku yang nggak jelas ini di kehidupan orang normal yang lain, hehehehe, aku cuma mau bilang, aku sangattt sekali beruntung punya pacar seperti kamu, apalagi kamu baikk sekali sama aku, perhatian, enggak jahat lagi, tapii.. maaf yaaa, kalau Ade bikin salah sama kakak, wkwkkwk, oh iya kak, saya juga mau minta maaf belum bisa ngasih yang terbaik untuk kak {nama},... Belum bisa ngasih effort seperti cowo² lain ke pacar nya, maaf banget ya kak kalau aku ada banyak salah, banyak kurang nya,..";

const MSG_DOA =
  "Oh iya kaakk, aku juga doain kamu panjang umur, sehat selalu, menjadi anak baik bagi orang tua, anak bermanfaat bagi orang lain juga, dan menjadi wanita yang sangat baik serta Soleha, dan menjadi ibu yang baik bagi anak anak kamu nanti, aamiin 🥰.. tapi aku harap.. aku bisa terus bersama kamuuu sampai kita nikah nantii.. itu aja sih kak pesan dari sayaa, maaf kalau ada salah kata yaaa, 🥰🥰, heheh, sekali lagi happy birthday 🎈 🎂 ya kakkk... have good day 🥰✌🏻— andrax";

// ====== Helper ======
const $ = (id) => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ====== Hitung umur ======
// Dihitung per tanggal kejutan terbuka (WIB), jadi saat ngetes sebelum hari-H
// umurnya tetap umur yang benar di hari ulang tahun.
function hitungUmur(tglLahir) {
  const [y, m, d] = tglLahir.split("-").map(Number);
  const ref = new Date(Math.max(Date.now(), TARGET_MS) + 7 * 3600 * 1000); // geser ke WIB
  let umur = ref.getUTCFullYear() - y;
  const belum =
    ref.getUTCMonth() + 1 < m || (ref.getUTCMonth() + 1 === m && ref.getUTCDate() < d);
  if (belum) umur--;
  return umur;
}

// "sofani nazila fidris" -> "Sofani Nazila Fidris"
function rapikanNama(n) {
  return n.replace(/\s+/g, " ").toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
}

// ====== Alert pink ======
function showAlert(text) {
  $("alertText").textContent = text;
  const modal = $("alertBox").querySelector(".modal");
  modal.classList.remove("shake");
  void modal.offsetWidth;
  modal.classList.add("shake");
  $("alertBox").classList.add("show");
}
$("alertOk").addEventListener("click", () => $("alertBox").classList.remove("show"));
$("alertBox").addEventListener("click", (e) => {
  if (e.target.id === "alertBox") $("alertBox").classList.remove("show");
});

// ====== Bokeh lembut (dibuat sekali, animasi murni CSS) ======
(function buatBokeh() {
  const wrap = $("bokeh");
  for (let i = 0; i < 6; i++) {
    const el = document.createElement("span");
    const size = 40 + Math.random() * 70;
    el.style.width = el.style.height = size + "px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.animationDuration = 18 + Math.random() * 14 + "s";
    el.style.animationDelay = -Math.random() * 25 + "s";
    el.style.setProperty("--sway", (Math.random() * 60 - 30) + "px");
    wrap.appendChild(el);
  }
})();

// ====== Confetti (canvas ringan) ======
const confetti = (function () {
  const cv = $("confetti");
  const ctx = cv.getContext("2d");
  const COLORS = ["#f4a3c0", "#e0709b", "#ffd6e5", "#ffffff", "#ffc2d6", "#ff8fb3", "#ffe3a8"];
  let parts = [], raf = null, W = 0, H = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    cv.scale = d;
  }
  addEventListener("resize", resize); resize();

  function loop() {
    ctx.clearRect(0, 0, W, H);
    const d = cv.scale || 1;
    parts = parts.filter((p) => p.y < H + 20 && p.life > 0);
    for (const p of parts) {
      p.vy += 0.12 * d; p.vx *= 0.995;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      if (p.heart) { ctx.font = p.s * 2.2 * d + "px serif"; ctx.fillText("💗", 0, 0); }
      else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(loop) : null;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }

  return function burst(count = 130, x = 0.5, y = 0.4) {
    if (reduce) return;
    const d = cv.scale || 1;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = (4 + Math.random() * 9) * d;
      parts.push({
        x: W * x, y: H * y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5 * d,
        s: (6 + Math.random() * 7) * d, rot: Math.random() * 6, vr: (Math.random() - .5) * .35,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        heart: Math.random() < 0.12, life: 160 + Math.random() * 80,
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
})();

// ====== Hati melayang pelan ======
let heartTimer = null;
function mulaiHati() {
  if (heartTimer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const buat = () => {
    if (document.hidden) return;
    const h = document.createElement("span");
    h.className = "heart-float";
    h.textContent = ["💗", "🌸", "💕"][(Math.random() * 3) | 0];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 14 + Math.random() * 16 + "px";
    h.style.animationDuration = 10 + Math.random() * 6 + "s";
    h.style.setProperty("--sway", Math.random() * 80 - 40 + "px");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 17000);
  };
  heartTimer = setInterval(buat, 3200);
}

// ====== Hitung mundur ======
const params = new URLSearchParams(location.search);
let targetMs = new Date(TARGET_ISO).getTime();
if (params.get("detik")) targetMs = Date.now() + Number(params.get("detik")) * 1000;
const MODE_TES = window.TEST_MODE === true;   // dari mode.js (di-set server saat "Mode tes? y")
const skipTimer = params.has("preview") || MODE_TES;
if (MODE_TES) $("testBadge").hidden = false;

(function setupTimer() {
  const pad = (n) => String(n).padStart(2, "0");
  const els = { D: $("tD"), H: $("tH"), M: $("tM"), S: $("tS") };
  const last = {};
  let iv = null;

  function set(k, v) {
    const t = pad(v);
    if (last[k] === t) return;
    last[k] = t;
    els[k].textContent = t;
    els[k].classList.remove("tick");
    void els[k].offsetWidth;
    els[k].classList.add("tick");
  }

  function buka(pakaiConfetti) {
    clearInterval(iv);
    showScreen("screen1");
    $("music").hidden = false;
    mulaiHati();
    if (pakaiConfetti) {
      confetti(120, 0.5, 0.35);
      setTimeout(() => confetti(50, 0.5, 0.45), 600);
    }
  }

  function tick() {
    const sisa = targetMs - Date.now();
    if (sisa <= 0) return buka(true);
    const t = Math.floor(sisa / 1000);
    set("D", Math.floor(t / 86400));
    set("H", Math.floor((t % 86400) / 3600));
    set("M", Math.floor((t % 3600) / 60));
    set("S", t % 60);
  }

  if (skipTimer || targetMs <= Date.now()) return buka(false);
  tick();
  iv = setInterval(tick, 250);
})();

// ====== Alur ======
$("next1").addEventListener("click", () => {
  mulaiMusik();
  showScreen("screen2");
});

$("next2").addEventListener("click", () => {
  const namaRaw = $("nama").value.trim();
  const tgl = $("tgl").value;

  $("nama").classList.toggle("error", !namaRaw);
  $("tgl").classList.toggle("error", !tgl);

  if (!namaRaw || !tgl) {
    showAlert("Harus di isi dulu yaaa sayang kuuu 🥰, hehehe");
    return;
  }

  const umur = hitungUmur(tgl);
  if (isNaN(umur) || umur < 1 || umur > 100) {
    showAlert("Umurnya kok " + (isNaN(umur) ? "aneh" : umur + " tahun") + " sih sayang 🥺, coba cek lagi tanggal lahirnya yaaa");
    $("tgl").classList.add("error");
    return;
  }

  const nama = rapikanNama(namaRaw);
  const isi = (t) => t.split("{umur}").join(umur).split("{nama}").join(nama);
  SLIDES[0].teks = isi(MSG_UCAPAN);
  SLIDES[1].teks = isi(MSG_TERIMAKASIH);
  SLIDES[2].teks = isi(MSG_DOA);

  siapkanFoto();

  bukaSlide(0);
});

["nama", "tgl"].forEach((id) =>
  $(id).addEventListener("input", () => $(id).classList.remove("error"))
);

// ====== Foto miring bertingkat ======
const SUDUT = [-5, 4, -3, 5, -4];   // derajat kemiringan tiap foto, berurutan ke bawah
function siapkanFoto() {
  const wrap = $("photoStack");
  wrap.innerHTML = "";
  wrap.hidden = true;
  PHOTOS.slice(0, 5).forEach((src, i) => {
    const f = document.createElement("figure");
    f.className = "pframe";
    f.hidden = true;
    f.style.setProperty("--rot", SUDUT[i % SUDUT.length] + "deg");
    f.style.setProperty("--dx", (i % 2 ? -1 : 1) * 1.5 + "%");
    f.style.setProperty("--delay", 0.5 + i * 0.7 + "s");
    const img = new Image();
    img.alt = "Foto kita";
    img.onload = () => { f.hidden = false; wrap.hidden = false; };
    img.onerror = () => f.remove();
    img.src = src;
    f.appendChild(img);
    wrap.appendChild(f);
  });
}

// ====== Slide surat: ucapan -> terima kasih -> doa ======
const SLIDES = [
  { n: 3, teks: "" },
  { n: 4, teks: "" },
  { n: 5, teks: "" },
];
let ketikTimer = null, ketikSelesai = null;

function bukaSlide(i) {
  showScreen("screen" + SLIDES[i].n);
  mulaiMengetik(SLIDES[i].n, SLIDES[i].teks);
}

SLIDES.forEach((s, i) => {
  $("next" + s.n).addEventListener("click", () => {
    if (i < SLIDES.length - 1) bukaSlide(i + 1);
    else {
      $("finalBox").classList.add("show");
      confetti(70, 0.5, 0.45);
    }
  });
  // Tap di kotak surat = percepat teks sampai selesai
  $("letter" + s.n).addEventListener("click", () => ketikSelesai && ketikSelesai());
});

// ====== Efek mengetik ======
function mulaiMengetik(n, teks) {
  clearTimeout(ketikTimer);
  const typed = $("typed" + n);
  const letter = $("letter" + n);
  const cursor = $("cursor" + n);
  const next = $("next" + n);
  const hint = $("hint" + n);

  typed.textContent = "";
  hint.classList.remove("show");
  letter.scrollTop = 0;
  cursor.classList.remove("done");
  next.className = "btn btn-hidden";

  // Array.from supaya emoji tidak terpotong
  const chars = Array.from(teks);
  let i = 0;
  let selesai = false;

  function akhiri() {
    if (selesai) return;
    selesai = true;
    clearTimeout(ketikTimer);
    typed.textContent = teks;
    cursor.classList.add("done");
    hint.classList.remove("show");
    letter.scrollTop = letter.scrollHeight;
    ketikSelesai = null;
    setTimeout(() => (next.className = "btn btn-show"), NEXT_DELAY);
  }
  ketikSelesai = akhiri;

  function ketik() {
    if (selesai) return;
    if (i < chars.length) {
      typed.textContent += chars[i];
      i++;
      letter.scrollTop = letter.scrollHeight;
      let delay = TYPING_SPEED;
      const c = chars[i - 1];
      if (c === "," || c === ".") delay += 140;
      if (c === "?") delay += 200;
      ketikTimer = setTimeout(ketik, delay);
    } else akhiri();
  }
  ketikTimer = setTimeout(() => { hint.classList.add("show"); ketik(); }, 700);
}

// ====== Popup akhir ======
$("finalClose").addEventListener("click", () => $("finalBox").classList.remove("show"));
$("finalSend").addEventListener("click", () => {
  if (CONTACT_LINK) {
    window.open(CONTACT_LINK, "_blank");
  } else {
    $("finalBox").classList.remove("show");
  }
});

// ====== Musik pelan ======
// Mulai dari klik Next pertama (browser blok autoplay). Tombol 🎵 selalu ada untuk play / jeda.
const MUSIK_VOLUME = 0.35;
const bgm = $("bgm");
const tombolMusik = $("music");
let musikOn = false;
let fadeTimer = null;

function setTombol(on) {
  musikOn = on;
  tombolMusik.classList.toggle("off", !on);
}

function fadeKe(target, selesai) {
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    const selisih = target - bgm.volume;
    if (Math.abs(selisih) < 0.03) {
      bgm.volume = target;
      clearInterval(fadeTimer);
      if (selesai) selesai();
    } else {
      bgm.volume = Math.max(0, Math.min(1, bgm.volume + Math.sign(selisih) * 0.03));
    }
  }, 80);
}

function putarMusik() {
  bgm.volume = 0;
  const p = bgm.play();
  if (p && p.then) {
    p.then(() => {
      setTombol(true);
      fadeKe(MUSIK_VOLUME);
    }).catch((e) => {
      setTombol(false);
      console.warn("Musik tidak bisa diputar:", e && e.message);
    });
  }
}

function mulaiMusik() {
  if (!musikOn) putarMusik();
}

tombolMusik.addEventListener("click", () => {
  if (musikOn) {
    setTombol(false);
    fadeKe(0, () => bgm.pause());
  } else {
    putarMusik();
  }
});

// File tidak ketemu / format salah: beri tahu (di MODE TES terlihat di badge)
bgm.addEventListener("error", () => {
  console.warn("File musik gagal dimuat. Pastikan ada di public/src/hbd.mp3");
  if (MODE_TES) $("testBadge").textContent = "MODE TES • hbd.mp3 tidak ketemu (public/src/hbd.mp3)";
});

// Pause saat tab disembunyikan / HP dikunci, lanjut saat balik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) bgm.pause();
  else if (musikOn) bgm.play().catch(() => {});
});
