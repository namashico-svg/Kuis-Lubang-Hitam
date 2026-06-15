export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // 0-indexed
  explanation: string;
  image_prompt?: string;
  visualType: string; // Used to select which custom dynamic SVG/interactive simulation to render
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Apa yang dimaksud dengan lubang hitam?",
    options: [
      "Planet yang sangat gelap",
      "Wilayah ruang angkasa dengan gravitasi sangat kuat",
      "Satelit alami",
      "Asteroid raksasa"
    ],
    answer: 1,
    explanation: "Lubang hitam merupakan wilayah ruang angkasa yang memiliki gravitasi sangat kuat sehingga bahkan cahaya tidak dapat keluar.",
    image_prompt: "Ilustrasi sebuah lubang hitam di tengah galaksi dengan piringan akresi bercahaya, gaya edukasi modern, tanpa teks.",
    visualType: "accretion"
  },
  {
    id: 2,
    question: "Lubang hitam sebagian besar terbentuk dari...",
    options: [
      "Planet yang membeku",
      "Bintang bermassa besar yang runtuh",
      "Tabrakan meteor",
      "Pecahan bulan"
    ],
    answer: 1,
    explanation: "Sebasi besar lubang hitam terbentuk dari keruntuhan gravitasi inti bintang bermassa besar di akhir siklus hidupnya (setelah ledakan supernova).",
    image_prompt: "Ilustrasi bintang bermassa besar yang runtuh menjadi lubang hitam dengan animasi gaya infografis.",
    visualType: "stellar_collapse"
  },
  {
    id: 3,
    question: "Mengapa cahaya tidak dapat keluar dari lubang hitam?",
    options: [
      "Karena suhunya terlalu dingin",
      "Karena tidak ada molekul udara",
      "Karena gravitasinya sangat ekstrim",
      "Karena terhalang oleh debu kosmik"
    ],
    answer: 2,
    explanation: "Gravitasi lubang hitam begitu masif sehingga kecepatan lepasnya (escape velocity) melebihi kecepatan cahaya itu sendiri.",
    image_prompt: "Ilustrasi sinar cahaya yang melengkung dan tersedot menuju pusat lubang hitam akibat gravitasi.",
    visualType: "bending_light"
  },
  {
    id: 4,
    question: "Batas teoretis di sekitar lubang hitam di mana tidak ada materi atau cahaya yang dapat melarikan diri disebut...",
    options: [
      "Korona",
      "Cakrawala Peristiwa",
      "Fotosfer",
      "Piringan Akresi"
    ],
    answer: 1,
    explanation: "Cakrawala peristiwa (event horizon) adalah batas di sekitar lubang hitam di mana gravitasi menjadi sangat kuat hingga tidak ada yang bisa kembali setelah melewatinya.",
    image_prompt: "Ilustrasi close-up batas melingkar gelap di tengah piringan akresi yang menyala terang kemerahan.",
    visualType: "event_horizon"
  },
  {
    id: 5,
    question: "Titik di pusat lubang hitam tempat materi terkompresi hingga mencapai kepadatan yang tak terhingga disebut...",
    options: [
      "Singularitas",
      "Katai Putih",
      "Supernova",
      "Pusar Ruang"
    ],
    answer: 0,
    explanation: "Singularitas adalah titik pusat lubang hitam tempat materi hancur hingga mencapai kepadatan tak terhingga dan volume yang secara teoretis bernilai nol.",
    image_prompt: "Visualisasi abstrak sebuah titik energi tak terhingga di ruang gelap dengan lengkungan distorsi ruang-waktu.",
    visualType: "singularity"
  },
  // Additional 15 high-quality questions for dynamic full spectrum
  {
    id: 6,
    question: "Efek gaya pasang surut ekstrem yang menarik tubuh memanjang seperti mi saat jatuh ke lubang hitam disebut...",
    options: [
      "Spageti-fiksasi (Spaghettification)",
      "Atomisasi Kosmis",
      "Kristalisasi Gravitasi",
      "Kompresi Termal"
    ],
    answer: 0,
    explanation: "Spaghettification (spagetifikas) terjadi karena perbedaan gaya gravitasi yang luar biasa besar antara ujung kaki dan kepala saat mendekati singularitas.",
    image_prompt: "Animasi benda memanjang terurai ditarik secara ekstrem ke lubang hitam.",
    visualType: "spaghettification"
  },
  {
    id: 7,
    question: "Radiasi teoretis yang dipancarkan oleh lubang hitam akibat efek mekanika kuantum di dekat cakrawala peristiwa disebut...",
    options: [
      "Radiasi Gamma Super",
      "Radiasi Hawking",
      "Emisi Schwarzschild",
      "Sinar Kosmis Singular"
    ],
    answer: 1,
    explanation: "Radiasi Hawking dikemukakan oleh Stephen Hawking, membuktikan secara teori bahwa efek kuantum membuat lubang hitam memancarkan energi dan perlahan menguap.",
    image_prompt: "Partikel virtual membelah di dekat event horizon, satu lolos dan satu terhisap.",
    visualType: "hawking_radiation"
  },
  {
    id: 8,
    question: "Siapa ilmuwan teoretis yang pertama kali memecahkan persamaan relativitas umum untuk memprediksi ukuran lubang hitam statis?",
    options: [
      "Albert Einstein",
      "Stephen Hawking",
      "Karl Schwarzschild",
      "Kip Thorne"
    ],
    answer: 2,
    explanation: "Karl Schwarzschild memecahkan persamaan medan Einstein pada tahun 1916 ketika bertugas di Perang Dunia I, menghasilkan radius batas lubang hitam Schwarzschild.",
    image_prompt: "Rumus Schwarzschild dan gambar ilustrasi distorsi dimensi.",
    visualType: "historical_formula"
  },
  {
    id: 9,
    question: "Untuk mata manusia, mengapa kita tidak dapat melihat lubang hitam secara langsung dengan mata telanjang?",
    options: [
      "Karena lubang hitam terus berpindah tempat",
      "Karena lubang hitam melengkungkan ruang kosong",
      "Karena ia tidak memantulkan atau memancarkan cahaya apa pun",
      "Karena letaknya selalu di dalam nebula tebal"
    ],
    answer: 2,
    explanation: "Sifat utama lubang hitam adalah menyerap semua cahaya di sekitarnya dan tidak memancarkan cahaya, sehingga ia tampak hitam sepenuhnya tanpa jejak langsung di mata.",
    image_prompt: "Ilustrasi wilayah lingkaran gelap gulita yang menutupi gugusan bintang di belakangnya.",
    visualType: "invisible"
  },
  {
    id: 10,
    question: "Lubang hitam supermasif yang terletak di pusat galaksi Bima Sakti kita dikenal dengan nama...",
    options: [
      "Andromeda Big-BH",
      "Cygnus X-1",
      "Sagittarius A* (Sgr A*)",
      "M87* Cosmic Core"
    ],
    answer: 2,
    explanation: "Sagittarius A* (disebut Sagittarius A-star) adalah lubang hitam supermasif bermassa sekitar 4 juta kali massa matahari kita di pusat galaksi Bima Sakti.",
    image_prompt: "Visualisasi gas berputar cepat di sekeliling wilayah kosong di tengah galaksi spiral.",
    visualType: "sgr_a"
  },
  {
    id: 11,
    question: "Teleskop jaringan global yang berhasil mengambil citra nyata lubang hitam pertama kali (M87*) pada tahun 2019 bernama...",
    options: [
      "Hubble Space Telescope",
      "James Webb Telescope",
      "Event Horizon Telescope (EHT)",
      "Kepler Observatory"
    ],
    answer: 2,
    explanation: "Event Horizon Telescope (EHT) adalah jaringan teleskop radio global yang bertindak seperti teleskop raksasa seukuran Bumi, menghasilkan gambar piringan oranye menyala di lubang hitam M87*.",
    image_prompt: "Logo teleskop global mengamati galaksi M87.",
    visualType: "eht"
  },
  {
    id: 12,
    question: "Jika matahari kita secara ajaib tiba-tiba runtuh menjadi lubang hitam tanpa kehilangan massanya, apa yang terjadi dengan bumi?",
    options: [
      "Bumi akan langsung tersedot ke dalam lubang hitam tersebut",
      "Bumi akan terlempar keluar dari sistem tata surya",
      "Bumi akan tetap berada pada orbit melingkarnya seperti biasa namun tanpa cahaya matahari",
      "Bumi akan terbakar oleh suhu tinggi"
    ],
    answer: 2,
    explanation: "Karena massanya sama, gaya gravitasi matahari di jarak Bumi tetap tidak berubah. Bumi akan melanjutkan orbitnya dengan aman tetapi akan menjadi sangat dingin karena ketiadaan cahaya matahari.",
    image_prompt: "Orbit melingkar bumi di sekeliling cakram hitam kecil dingin menggantikan matahari.",
    visualType: "earth_orbit"
  },
  {
    id: 13,
    question: "Konsep bahwa lubang hitam menyerap materi lalu perlahan menyusut hingga menghilang sepenuhnya di alam semesta disebut proses...",
    options: [
      "Penguapan Lubang Hitam (Black Hole Evaporation)",
      "Lisis Kosmos",
      "Supernova Sampingan",
      "Efek Rebound Singular"
    ],
    answer: 0,
    explanation: "Karena radiasi Hawking memancarkan massa keluar, lubang hitam kehilangan energi. Tanpa materi baru yang terserap, ia perlahan menyusut dan mengalami penguapan akhir.",
    image_prompt: "Lubang hitam yang memudar dan menyusut menjadi kilatan cahaya terang.",
    visualType: "evaporation"
  },
  {
    id: 14,
    question: "Apa kelas lubang hitam terbesar di alam semesta yang memiliki massa milliaran kali massa matahari?",
    options: [
      "Lubang Hitam Mikro",
      "Lubang Hitam Bermassa Bintang (Stellar)",
      "Lubang Hitam Menengah (Intermediate)",
      "Lubang Hitam Supermasif (Supermassive)"
    ],
    answer: 3,
    explanation: "Lubang hitam supermasif bermassa jutaan hingga miliaran kali matahari kita, mendiami pusat dari hampir semua galaksi besar.",
    image_prompt: "Bandingkan skala ukuran tata surya kita yang kerdil di samping lubang hitam supermasif ton 618.",
    visualType: "supermassive"
  },
  {
    id: 15,
    question: "Gelombang riak dalam struktur ruang-waktu yang dipancarkan saat dua lubang hitam saling mendekat dan bertabrakan disebut...",
    options: [
      "Gelombang Gravitasi (Gravitational Waves)",
      "Gelombang Radiasi Gamma",
      "Emisi Plasma Pulsar",
      "Seismik Galaktik"
    ],
    answer: 0,
    explanation: "Detektor bumi seperti LIGO berhasil mendeteksi gelombang gravitasi dari tabrakan dua lubang hitam, membuktikan prediksi relativitas umum Einstein.",
    image_prompt: "Riak spiral gelombang menyebar dari dua titik gravitasi ganda.",
    visualType: "merger"
  },
  {
    id: 16,
    question: "Piringan gas, debu, dan materi super panas yang berputar kencang di luar batas Cakrawala Peristiwa disebut...",
    options: [
      "Sabuk Kuiper",
      "Piringan Akresi (Accretion Disk)",
      "Piringan Schwarzschild",
      "Awan Oort"
    ],
    answer: 1,
    explanation: "Matri yang ditarik oleh gravitasi lubang hitam tidak langsung jatuh tegak lurus, melainkan berputar membentuk piringan akresi super panas yang memancarkan sinar-X kuat.",
    image_prompt: "Piringan merah oranye menyala mengelilingi bola hitam di pusatnya.",
    visualType: "accretion"
  },
  {
    id: 17,
    question: "Pada tahun 1971, astronom berhasil mengidentifikasi kandidat lubang hitam bermassa bintang pertama di galaksi kita yang diberi nama...",
    options: [
      "Cygnus X-1",
      "Sagittarius A*",
      "Messier 87",
      "Kepler-22b"
    ],
    answer: 0,
    explanation: "Cygnus X-1 adalah sumber sinar-X biner di rasi bintang Cygnus yang diidentifikasi oleh para ilmuwan sebagai bukti fisik lubang hitam pertama.",
    image_prompt: "Bintang biru ditarik gasnya ke dalam titik gelap bercahaya.",
    visualType: "cygnus_x1"
  },
  {
    id: 18,
    question: "Apa istilah pelambatan waktu yang dialami oleh objek yang berada sangat dekat dengan gravitasi ekstrem lubang hitam?",
    options: [
      "Efek Doppler",
      "Dilatasi Waktu Gravitasi",
      "Zona Lambat Mekanis",
      "Dilatasi Relativistik Termal"
    ],
    answer: 1,
    explanation: "Semakin kuat medan gravitasi, semakin lambat aliran waktu dibandingkan area bergravitasi rendah. Ini disebut Dilatasi Waktu Gravitasi.",
    image_prompt: "Jam tangan yang kian melambat berdetak tepat di tepi lubang.",
    visualType: "time_dilation"
  },
  {
    id: 19,
    question: "Para ilmuwan mengklasifikasikan lubang hitam berdasarkan sifat rotasinya. Lubang hitam yang berputar aktif dinamakan...",
    options: [
      "Lubang Hitam Schwarzschild",
      "Lubang Hitam Kerr",
      "Lubang Hitam Einstein",
      "Lubang Hitam Reissner-Nordström"
    ],
    answer: 1,
    explanation: "Lubang hitam Kerr adalah solusi matematis Roy Kerr (1963) yang menjelaskan lubang hitam berputar secara dinamis, menciptakan efek ergosfer di mana ruang ikut berputar.",
    image_prompt: "Struktur pusaran ruang melingkar di sekeliling kutub lubang hitam.",
    visualType: "kerr"
  },
  {
    id: 20,
    question: "Siapa fisikawan Amerika yang mempopulerkan frasa istilah \"Lubang Hitam\" (Black Hole) secara reguler dalam pertemuan sains global pada akhir 1960-an?",
    options: [
      "John Archibald Wheeler",
      "Richard Feynman",
      "Robert Oppenheimer",
      "Edwin Hubble"
    ],
    answer: 0,
    explanation: "Walaupun istilah tersebut sudah digunakan sebelumnya, John Archibald Wheeler mempopulerkan istilah 'Lubang Hitam' (Black Hole) secara luas menggantikan frasa 'bintang kolaps'.",
    image_prompt: "Potret bersejarah ilmuwan menggambar di papan tulis astronomi.",
    visualType: "wheeler"
  }
];
