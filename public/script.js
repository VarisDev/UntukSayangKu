// ====== PENGATURAN ======
// Isi kalau mau tombol "Mau 🥰" di popup akhir membuka chat ke kamu.
// Contoh WhatsApp : "https://wa.me/628xxxxxxxxxx?text=Halo%20Andrax"
// Contoh Telegram : "https://t.me/usernamekamu"
const CONTACT_LINK = "https://wa.me/6285708810570?text=Haloo%20Sayangg";

const TYPING_SPEED = 38;        // ms per karakter
const NEXT_DELAY = 5000;        // tombol next muncul 5 detik setelah teks selesai

// Slide ucapan ({nama} dan {umur} diganti otomatis)
const SLIDES = [
  {
    screen: "screen3",
    button: "next3",
    text:
      "Haloo sayangkuu, selamat ulang tahun yaaa sayangg, eh iya, btw kamu sekarang umur 17 yaaa, hehehe, makin tua dong ? 🥰, hehehe maaaf yaaa sayaanggg, cuma bercanda kokk. Serius 😭✌🏻✌🏻...Aku malah suka kok sama cewek yang lebih tua daripada aku, entah kenapa kek lebih nyaman aja sama yang lebih tua, mungkin bisa ngertiin sifat ku yang aneh ini sih kayaknya wkwkwk..",
  },
  {
    screen: "screen4",
    button: "next4",
    text:
      "Aku cuma mau bilang, terimakasih telah hadir di hidup ku ya sayang, terimakasih kamu telah menemani hari hari ku yang nggak jelas ini di kehidupan orang normal yang lain, hehehehe, aku cuma mau bilang, aku sangattt sekali beruntung punya pacar seperti kamu, apalagi kamu baikk sekali sama aku, perhatian, enggak jahat lagi, tapii.. maaf yaaa, kalau Ade bikin salah sama kakak, wkwkkwk, oh iya kaakk, aku juga doain kamu panjang umur, sehat selalu, menjadi anak baik bagi orang tua, anak bermanfaat bagi orang lain juga, dan menjadi wanita yang sangat baik serta Soleha, dan menjadi ibu yang baik bagi anak anak kamu nanti, aamiin 🥰.. oh iya kak, saya juga mau minta maaf belum bisa ngasih yang terbaik untuk kak {nama},... Belum bisa ngasih effort seperti cowo² lain ke pacar nya, maaf banget ya kak kalau aku ada banyak salah, banyak kurang nya,.. tapi aku harap.. aku bisa terus bersama kamuuu sampai kita nikah nantii.. itu aja sih kak pesan dari sayaa, maaf kalau ada salah kata yaaa, 🥰🥰, heheh, sekali lagi happy birthday 🎈 🎂  ya kakkk... have good day 🥰✌🏻— andrax",
  },
];

// ====== Helper ======
const $ = (id) => document.getElementById(id);

const URUTAN = ["screen1", "screen2", "screen3", "screen4"];
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  const idx = URUTAN.indexOf(id);
  document.querySelectorAll("#dots i").forEach((d, n) => d.classList.toggle("on", n === idx));
}

// ====== Hitung umur ======
function hitungUmur(tglLahir) {
  const lahir = new Date(tglLahir + "T00:00:00");
  const now = new Date();
  let umur = now.getFullYear() - lahir.getFullYear();
  const belumUlangTahun =
    now.getMonth() < lahir.getMonth() ||
    (now.getMonth() === lahir.getMonth() && now.getDate() < lahir.getDate());
  if (belumUlangTahun) umur--;
  return umur;
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
  for (let i = 0; i < 9; i++) {
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

// ====== Alur ======
$("next1").addEventListener("click", () => {
  mulaiMusik();
  showScreen("screen2");
});

$("next2").addEventListener("click", () => {
  const nama = $("nama").value.trim();
  const tgl = $("tgl").value;

  $("nama").classList.toggle("error", !nama);
  $("tgl").classList.toggle("error", !tgl);

  if (!nama || !tgl) {
    showAlert("Harus di isi dulu yaaa sayang kuuu 🥰, hehehe");
    return;
  }

  if (new Date(tgl + "T00:00:00") > new Date()) {
    showAlert("Tanggal lahirnya kok dari masa depan sih sayang 🥺, coba cek lagi yaaa");
    $("tgl").classList.add("error");
    return;
  }

  dataUser.umur = hitungUmur(tgl);
  dataUser.nama = nama;
  tampilkanSlide(0);
});

["nama", "tgl"].forEach((id) =>
  $(id).addEventListener("input", () => $(id).classList.remove("error"))
);

// ====== Slide ucapan + efek mengetik ======
const dataUser = { nama: "", umur: "" };
let stopKetik = null;

function tampilkanSlide(n) {
  if (stopKetik) stopKetik();
  const slide = SLIDES[n];
  const root = $(slide.screen);
  const typed = root.querySelector(".typed");
  const letter = root.querySelector(".letter");
  const cursor = root.querySelector(".cursor");
  const hint = root.querySelector(".tap-hint");
  const btn = $(slide.button);

  const teks = slide.text.replace("{umur}", dataUser.umur).replace("{nama}", dataUser.nama);
  const chars = Array.from(teks); // Array.from supaya emoji tidak terpotong

  typed.textContent = "";
  cursor.classList.remove("done");
  btn.className = "btn btn-hidden btn-next";
  hint.classList.remove("show");
  showScreen(slide.screen);

  let i = 0;
  let timer = null;
  let nextTimer = null;
  let selesai = false;

  function munculkanTombol(delay) {
    nextTimer = setTimeout(() => {
      btn.className = "btn btn-show btn-next";
    }, delay);
  }

  function selesaiKetik(delayTombol) {
    if (selesai) return;
    selesai = true;
    clearTimeout(timer);
    cursor.classList.add("done");
    hint.classList.remove("show");
    munculkanTombol(delayTombol);
  }

  function ketik() {
    if (i < chars.length) {
      typed.textContent += chars[i];
      i++;
      letter.scrollTop = letter.scrollHeight;
      let delay = TYPING_SPEED;
      const c = chars[i - 1];
      if (c === "," || c === ".") delay += 140;
      if (c === "?") delay += 200;
      timer = setTimeout(ketik, delay);
    } else {
      selesaiKetik(NEXT_DELAY);
    }
  }

  // Tap teks = langsung tampil semua (tombol muncul 1 detik kemudian)
  letter.onclick = () => {
    if (selesai) return;
    typed.textContent = teks;
    letter.scrollTop = letter.scrollHeight;
    selesaiKetik(1000);
  };

  stopKetik = () => {
    clearTimeout(timer);
    clearTimeout(nextTimer);
    selesai = true;
  };

  timer = setTimeout(() => {
    hint.classList.add("show");
    ketik();
  }, 600);
}

$("next3").addEventListener("click", () => tampilkanSlide(1));

// ====== Popup akhir ======
$("next4").addEventListener("click", () => {
  $("finalBox").classList.add("show");
});
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
  if (window.TEST_MODE === true) {
    $("testBadge").textContent = "MODE TES • hbd.mp3 tidak ketemu (public/src/hbd.mp3)";
  }
});

// Pause saat tab disembunyikan / HP dikunci, lanjut saat balik
document.addEventListener("visibilitychange", () => {
  if (document.hidden) bgm.pause();
  else if (musikOn) bgm.play().catch(() => {});
});

// ====== Kunci tanggal ======
// Halaman baru terbuka 29 Okt 2026 00:00 WIB. MODE TES (window.TEST_MODE dari mode.js) melewati kunci.
const BUKA_PADA = new Date("2026-10-29T00:00:00+07:00").getTime();
const MODE_TES = window.TEST_MODE === true;
const terkunci = () => !MODE_TES && Date.now() < BUKA_PADA;

if (MODE_TES) $("testBadge").hidden = false;

if (terkunci()) {
  $("dots").hidden = true;
  tombolMusik.hidden = true;
  showScreen("screenLock");
  // kalau halaman dibiarkan terbuka sampai tengah malam, otomatis terbuka
  const cek = setInterval(() => {
    if (!terkunci()) {
      clearInterval(cek);
      $("dots").hidden = false;
      tombolMusik.hidden = false;
      showScreen("screen1");
    }
  }, 1000);
} else {
  showScreen("screen1");
}
