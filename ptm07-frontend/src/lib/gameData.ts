import { ModuleType } from './api';

export interface GameOptionItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  isCorrect: boolean;
}

export interface ActivityModule {
  id: ModuleType;
  stepNumber: number;
  title: string;
  sceneName: string;
  introDialog: string;
  correctDialog: string;
  firstErrorDialog: string;
  adaptiveDialog: string;
  fallbackDialog: string;
  options: GameOptionItem[];
}

export const GAME_MODULES: ActivityModule[] = [
  {
    id: 'WAKE_UP',
    stepNumber: 1,
    title: '1. Bangun Tidur',
    sceneName: 'Kamar Tidur',
    introDialog: 'Halo! Aku Tako, pemandu belajarmu. Matahari sudah bersinar di luar jendela! Benda apa yang berbunyi membangunkan kita dari tempat tidur?',
    correctDialog: 'Hebat sekali! Jam beker berdering tepat waktu dan tempat tidur kita rapi!',
    firstErrorDialog: 'Wah, hampir tepat! Yuk kita coba periksa lagi jam yang berdering di samping ranjang!',
    adaptiveDialog: 'Lihat benda yang berkedip terang ini! Sentuh jam beker di samping tempat tidurmu!',
    fallbackDialog: 'Tako ada di sini bersamamu, mari kita pilih jam beker bersama-sama!',
    options: [
      { id: 'ITEM_ALARM_CLOCK', name: 'Jam Beker', icon: '⏰', description: 'Mematikan alarm pagi & bangun tepat waktu', isCorrect: true },
      { id: 'ITEM_PILLOW_SLEEP', name: 'Bantal Tidur', icon: '🛏️', description: 'Menutup muka untuk tidur lagi', isCorrect: false },
      { id: 'ITEM_BLANKET_WRAP', name: 'Selimut Tebal', icon: '🧶', description: 'Menarik selimut lebih rapat', isCorrect: false },
    ],
  },
  {
    id: 'BATHING',
    stepNumber: 2,
    title: '2. Mandi Pagi',
    sceneName: 'Kamar Mandi',
    introDialog: 'Tubuh kita harus segar dan wangi sebelum berangkat sekolah. Perlengkapan apa yang kita gunakan untuk membersihkan tubuh saat mandi?',
    correctDialog: 'Pintar! Sabun dan handuk bersih membuat tubuh kita harum dan segar!',
    firstErrorDialog: 'Eits, bukan itu ya. Yuk periksa perlengkapan pembersih tubuh di kamar mandi!',
    adaptiveDialog: 'Perhatikan benda berbusa harum yang bercahaya ini! Sentuh sabun dan handuk ya!',
    fallbackDialog: 'Tenang saja, Tako akan bantu tunjukkan sabun mandi untuk membersihkan badan!',
    options: [
      { id: 'ITEM_SOAP_TOWEL', name: 'Sabun & Handuk', icon: '🧼', description: 'Membersihkan kotoran dan mengeringkan badan', isCorrect: true },
      { id: 'ITEM_TOY_BOAT', name: 'Mainan Bebek Air', icon: '🦆', description: 'Mainan air di bak mandi', isCorrect: false },
      { id: 'ITEM_MUD_BALL', name: 'Bola Pasir', icon: '🟤', description: 'Benda berdebu kotor', isCorrect: false },
    ],
  },
  {
    id: 'BRUSHING_TEETH',
    stepNumber: 3,
    title: '3. Menggosok Gigi',
    sceneName: 'Wastafel Kamar Mandi',
    introDialog: 'Setelah mandi, gigi kita perlu dibersihkan agar bebas dari kuman dan napas tetap segar. Alat apa yang kita gunakan?',
    correctDialog: 'Luar biasa! Gigimu sekarang bersih, putih berkilau dan sehat!',
    firstErrorDialog: 'Belum tepat kawan! Yuk cari alat yang khusus untuk membersihkan gigi!',
    adaptiveDialog: 'Lihat sikat gigi berbulu lembut yang berkedip ini! Ayo sentuh sekarang!',
    fallbackDialog: 'Tako bantu ya! Sentuh sikat gigi dan pasta giginya yuk!',
    options: [
      { id: 'ITEM_TOOTHBRUSH_PASTE', name: 'Sikat & Pasta Gigi', icon: '🪥', description: 'Menyikat gigi sampai bersih bersinar', isCorrect: true },
      { id: 'ITEM_COMB_HAIR', name: 'Sisir Rambut', icon: '🪮', description: 'Merapikan helaian rambut', isCorrect: false },
      { id: 'ITEM_SHAMPOO_BOTTLE', name: 'Botol Sabun Cuci', icon: '🧴', description: 'Cairan pembersih lantai', isCorrect: false },
    ],
  },
  {
    id: 'WEARING_UNIFORM',
    stepNumber: 4,
    title: '4. Memakai Seragam Sekolah',
    sceneName: 'Lemari Pakaian',
    introDialog: 'Hari ini hari sekolah! Pakaian apa yang wajib dan rapi untuk kita kenakan ke sekolah?',
    correctDialog: 'Keren banget! Seragam sekolah terpasang rapi lengkap dengan dasi dan ikat pinggang!',
    firstErrorDialog: 'Bukan pakaian itu ya. Kita mau ke sekolah, yuk pilih seragam belajarmu!',
    adaptiveDialog: 'Lihat pakaian merah putih yang berkedip ini! Yuk sentuh seragam sekolahmu!',
    fallbackDialog: 'Mari kita kenakan seragam sekolah bersama Tako agar siap menuntut ilmu!',
    options: [
      { id: 'ITEM_SCHOOL_UNIFORM', name: 'Seragam Sekolah', icon: '👔', description: 'Pakaian rapi resmi untuk belajar di kelas', isCorrect: true },
      { id: 'ITEM_PAJAMAS', name: 'Baju Tidur / Piyama', icon: '👕', description: 'Baju santai untuk beristirahat malam', isCorrect: false },
      { id: 'ITEM_SWIMSUIT', name: 'Pakaian Renang', icon: '🩳', description: 'Celana renang untuk bermain air', isCorrect: false },
    ],
  },
  {
    id: 'PREPARING_BOOKS',
    stepNumber: 5,
    title: '5. Menyiapkan Buku & Tas',
    sceneName: 'Meja Belajar',
    introDialog: 'Buku pelajaran dan alat tulis harus siap di dalam tas. Benda mana yang perlu kita masukkan ke tas sekolah hari ini?',
    correctDialog: 'Sangat teliti! Buku pelajaran dan kotak pensil sudah masuk ke dalam tas ransel!',
    firstErrorDialog: 'Wah, itu bukan buku belajar. Periksa kembali buku catatan dan buku cetak sekolah!',
    adaptiveDialog: 'Perhatikan buku pelajaran yang menyala terang di atas meja! Sentuh buku itu!',
    fallbackDialog: 'Tako tunjukkan buku pelajarannya, ayo sentuh bukunya ya!',
    options: [
      { id: 'ITEM_TEXTBOOK', name: 'Buku Pelajaran & Pensil', icon: '📚', description: 'Buku mata pelajaran untuk kelas hari ini', isCorrect: true },
      { id: 'ITEM_COMIC_BOOK', name: 'Komik Kartun', icon: '🦸', description: 'Komik bacaan hiburan di waktu luang', isCorrect: false },
      { id: 'ITEM_TOY_ROBOT', name: 'Robot Mainan', icon: '🤖', description: 'Mainan elektronik untuk sore hari', isCorrect: false },
    ],
  },
  {
    id: 'BREAKFAST',
    stepNumber: 6,
    title: '6. Sarapan Sehat',
    sceneName: 'Meja Makan',
    introDialog: 'Sebelum berangkat, perut kita butuh asupan nutrisi sehat agar bertenaga dan konsentrasi belajar. Menu apa yang paling sehat?',
    correctDialog: 'Nyam-nyam lezat dan bergizi! Sekarang tenagamu penuh untuk beraktivitas!',
    firstErrorDialog: 'Makanan itu kurang sehat untuk pagi hari kawan. Pilih makanan yang bergizi ya!',
    adaptiveDialog: 'Lihat roti gandum dan susu hangat yang berkedip ini! Yuk pilih menu sarapan ini!',
    fallbackDialog: 'Tako temani sarapan bergizi, yuk sentuh roti dan susu sehat!',
    options: [
      { id: 'ITEM_BREAD_MILK', name: 'Roti Gandum & Susu', icon: '🥪', description: 'Sarapan bergizi seimbang pembangun energi', isCorrect: true },
      { id: 'ITEM_HOT_CHILI', name: 'Cabai Rawit Pedas', icon: '🌶️', description: 'Bumbu sangat pedas yang membuat sakit perut', isCorrect: false },
      { id: 'ITEM_CANDY_BAR', name: 'Permen Manis', icon: '🍭', description: 'Gula manis berlebih yang tidak mengenyangkan', isCorrect: false },
    ],
  },
  {
    id: 'FAREWELL',
    stepNumber: 7,
    title: '7. Pamitan Berangkat Sekolah',
    sceneName: 'Pintu Depan Rumah',
    introDialog: 'Rangkaian persiapan pagi sudah tuntas! Sebelum melangkah keluar pagar menuju sekolah, tindakan sopan apa yang harus kita lakukan?',
    correctDialog: 'Anak berbakti dan sopan! Ibu tersenyum bangga dan mendoakan harimu di sekolah menyenangkan!',
    firstErrorDialog: 'Jangan langsung pergi begitu saja ya. Ucapkan salam dan pamit terlebih dahulu!',
    adaptiveDialog: 'Lihat gambar tangan santun yang bercahaya ini! Sentuh salam dan pamit ke orang tua!',
    fallbackDialog: 'Ayo bersama Tako, kita salim dan cium tangan ayah ibu sebelum berangkat!',
    options: [
      { id: 'ITEM_KISS_HAND_PARENT', name: 'Salim & Cium Tangan', icon: '🤝', description: 'Berpamitan santun dan memohon doa restu', isCorrect: true },
      { id: 'ITEM_RUN_DIRECTLY', name: 'Langsung Lari Keluar', icon: '🏃', description: 'Berlari tanpa menyapa orang di rumah', isCorrect: false },
      { id: 'ITEM_WATCH_TV', name: 'Menyalakan TV', icon: '📺', description: 'Duduk menonton televisi dan lupa berangkat', isCorrect: false },
    ],
  },
];
