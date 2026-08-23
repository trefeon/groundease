import type { GroundingTechnique, GroundingStep } from '@/types';

// ============================================
// Langkah-langkah Teknik 5-4-3-2-1
// ============================================

export const steps54321: GroundingStep[] = [
  {
    id: 1,
    instruction: 'Sebutkan 5 hal yang bisa kamu LIHAT di sekitarmu',
    duration: 30,
    prompt: 'Apa yang kamu lihat?',
    senseType: '👁️ Lihat',
    phase: 'sensory',
    visualMode: 'sensory',
  },
  {
    id: 2,
    instruction: 'Sebutkan 4 hal yang bisa kamu SENTUH',
    duration: 30,
    prompt: 'Apa yang kamu rasakan saat menyentuhnya?',
    senseType: '✋ Sentuh',
    phase: 'touch',
    visualMode: 'touch',
  },
  {
    id: 3,
    instruction: 'Sebutkan 3 hal yang bisa kamu DENGAR',
    duration: 25,
    prompt: 'Suara apa yang kamu dengar?',
    senseType: '👂 Dengar',
    phase: 'auditory',
    visualMode: 'auditory',
  },
  {
    id: 4,
    instruction: 'Sebutkan 2 hal yang bisa kamu CIUM',
    duration: 20,
    prompt: 'Aroma apa yang kamu rasakan?',
    senseType: '👃 Cium',
    phase: 'sensory',
    visualMode: 'sensory',
  },
  {
    id: 5,
    instruction: 'Sebutkan 1 hal yang bisa kamu RASAKAN di lidah',
    duration: 15,
    prompt: 'Rasa apa yang kamu rasakan?',
    senseType: '👅 Rasa',
    phase: 'sensory',
    visualMode: 'sensory',
  },
];

// ============================================
// Langkah Box Breathing (4-4-4-4)
// ============================================

export const stepsBoxBreathing: GroundingStep[] = [
  {
    id: 1,
    instruction: 'Tarik napas perlahan melalui hidung selama 4 detik.',
    duration: 4,
    prompt: 'Rasakan udara mengisi paru-parumu.',
    senseType: '👁️ Lihat',
    phase: 'inhale',
    visualMode: 'breathing',
  },
  {
    id: 2,
    instruction: 'Tahan napas selama 4 detik.',
    duration: 4,
    prompt: 'Rasakan keheningan di dalam tubuhmu.',
    senseType: '👁️ Lihat',
    phase: 'hold',
    visualMode: 'breathing',
  },
  {
    id: 3,
    instruction: 'Buang napas perlahan melalui mulut selama 4 detik.',
    duration: 4,
    prompt: 'Lepaskan ketegangan bersama hembusan napas.',
    senseType: '👁️ Lihat',
    phase: 'exhale',
    visualMode: 'breathing',
  },
  {
    id: 4,
    instruction: 'Tahan napas kembali selama 4 detik.',
    duration: 4,
    prompt: 'Nikmati momen keheningan ini.',
    senseType: '👁️ Lihat',
    phase: 'hold',
    visualMode: 'breathing',
  },
];

// ============================================
// Langkah Ocean Breath (Ocean 4-7-8)
// ============================================

export const stepsOceanBreath: GroundingStep[] = [
  {
    id: 1,
    instruction: 'Tarik napas dalam-dalam melalui hidung selama 4 detik.',
    duration: 4,
    prompt: 'Isi paru-paru dan rilekskan bahu.',
    senseType: '👁️ Lihat',
    phase: 'inhale',
    visualMode: 'breathing',
  },
  {
    id: 2,
    instruction: 'Tahan napas dengan lembut selama 7 detik.',
    duration: 7,
    prompt: 'Rasakan ketenangan yang mengalir.',
    senseType: '👁️ Lihat',
    phase: 'hold',
    visualMode: 'breathing',
  },
  {
    id: 3,
    instruction: 'Hembuskan perlahan selama 8 detik dengan suara "HAA" seperti ombak.',
    duration: 8,
    prompt: 'Dengarkan suara desir ombak laut yang menenangkan.',
    senseType: '👁️ Lihat',
    phase: 'exhale',
    visualMode: 'breathing',
  },
  {
    id: 4,
    instruction: 'Jeda sejenak selama 2 detik dan nikmati napas tenang.',
    duration: 2,
    prompt: 'Rasakan tubuh kembali seimbang.',
    senseType: '👁️ Lihat',
    phase: 'rest',
    visualMode: 'breathing',
  },
];

// ============================================
// Langkah Mindful Walking
// ============================================

export const stepsMindfulWalking: GroundingStep[] = [
  {
    id: 1,
    instruction: 'Berdiri tegak. Rasakan kedua kakimu menyentuh tanah.',
    duration: 10,
    prompt: 'Sadari berat badanmu yang bertumpu pada kaki.',
    senseType: '✋ Sentuh',
    phase: 'walking',
    visualMode: 'walking',
  },
  {
    id: 2,
    instruction: 'Mulailah berjalan perlahan. Perhatikan setiap langkah.',
    duration: 20,
    prompt: 'Rasakan tumit, telapak, lalu jari kakimu menyentuh tanah.',
    senseType: '✋ Sentuh',
    phase: 'walking',
    visualMode: 'walking',
  },
  {
    id: 3,
    instruction: 'Perhatikan ritme napasmu saat berjalan.',
    duration: 20,
    prompt: 'Coba sinkronkan langkah dengan napas.',
    senseType: '👁️ Lihat',
    phase: 'walking',
    visualMode: 'walking',
  },
  {
    id: 4,
    instruction: 'Amati lingkungan sekitarmu tanpa menghakimi.',
    duration: 20,
    prompt: 'Apa yang kamu lihat, dengar, dan cium?',
    senseType: '👁️ Lihat',
    phase: 'walking',
    visualMode: 'walking',
  },
];

// ============================================
// Katalog Teknik Grounding & Latihan
// ============================================

export const groundingTechniques: GroundingTechnique[] = [
  {
    id: 'teknik-54321',
    name: 'Teknik 5-4-3-2-1',
    category: 'sensorik',
    sensoryType: '5-4-3-2-1',
    description:
      'Teknik grounding sensorik yang menggunakan kelima panca indera untuk mengembalikan fokus ke saat ini. Kamu akan mengidentifikasi hal-hal yang bisa dilihat, disentuh, didengar, dicium, dan dirasakan.',
    scientificBasis:
      'Berdasarkan prinsip mindfulness dan Polyvagal Theory (Porges, 2011). Mengaktifkan panca indera membantu mengalihkan perhatian dari respons fight-or-flight dan mengaktifkan sistem saraf parasimpatik, membawa tubuh kembali ke keadaan tenang.',
    duration: 5,
    difficulty: 'mudah',
    steps: steps54321,
    iconName: 'Hand',
    defaultSound: 'forest',
  },
  {
    id: 'grounding-sentuhan',
    name: 'Grounding Sentuhan',
    category: 'sensorik',
    sensoryType: 'sentuhan',
    description:
      'Teknik yang menggunakan indera peraba untuk kembali ke saat ini. Fokus pada sensasi fisik dari berbagai tekstur dan suhu untuk menenangkan sistem saraf.',
    scientificBasis:
      'Sensasi taktil mengaktifkan serabut saraf sensorik yang mengirim sinyal keamanan ke otak melalui jalur vagal (Porges, 2011). Sentuhan grounding membantu menurunkan kortisol dan meningkatkan perasaan aman.',
    duration: 3,
    difficulty: 'mudah',
    steps: [
      {
        id: 1,
        instruction: 'Pegang sebuah benda di dekatmu. Rasakan teksturnya.',
        duration: 20,
        prompt: 'Apa yang kamu rasakan? Kasar, halus, dingin, hangat?',
        senseType: '✋ Sentuh',
        phase: 'touch',
        visualMode: 'touch',
      },
      {
        id: 2,
        instruction: 'Tekan kedua telapak tanganmu satu sama lain dengan kuat selama 10 detik.',
        duration: 15,
        senseType: '✋ Sentuh',
        phase: 'touch',
        visualMode: 'touch',
      },
      {
        id: 3,
        instruction: 'Rasakan kedua kakimu menyentuh lantai. Tekan perlahan.',
        duration: 15,
        prompt: 'Bagaimana rasanya? Hangat? Dingin? Keras?',
        senseType: '✋ Sentuh',
        phase: 'touch',
        visualMode: 'touch',
      },
      {
        id: 4,
        instruction: 'Usap lenganmu perlahan dari bahu ke pergelangan tangan.',
        duration: 20,
        senseType: '✋ Sentuh',
        phase: 'touch',
        visualMode: 'touch',
      },
    ],
    iconName: 'Fingerprint',
    defaultSound: 'rain',
  },
  {
    id: 'grounding-auditori',
    name: 'Grounding Auditori',
    category: 'sensorik',
    sensoryType: 'auditori',
    description:
      'Teknik yang menggunakan indera pendengaran untuk grounding. Dengarkan suara-suara di sekitarmu atau suara alam yang menenangkan untuk kembali ke saat ini.',
    scientificBasis:
      'Suara alam dan fokus auditif terbukti menurunkan aktivitas amigdala dan meningkatkan relaksasi (Gould van Praag et al., 2017). Mendengarkan dengan sengaja melatih mindfulness dan mengurangi ruminasi.',
    duration: 5,
    difficulty: 'mudah',
    steps: [
      {
        id: 1,
        instruction: 'Tutup matamu. Dengarkan suara yang paling jauh yang bisa kamu dengar.',
        duration: 20,
        prompt: 'Suara apa yang kamu dengar?',
        senseType: '👂 Dengar',
        phase: 'auditory',
        visualMode: 'auditory',
      },
      {
        id: 2,
        instruction: 'Sekarang, fokuskan pendengaranmu pada suara yang paling dekat.',
        duration: 20,
        prompt: 'Suara apa itu?',
        senseType: '👂 Dengar',
        phase: 'auditory',
        visualMode: 'auditory',
      },
      {
        id: 3,
        instruction: 'Dengarkan suara napasmu sendiri. Ikuti ritmenya.',
        duration: 30,
        senseType: '👂 Dengar',
        phase: 'auditory',
        visualMode: 'auditory',
      },
    ],
    iconName: 'Ear',
    defaultSound: 'singing-bowls',
  },
  // --- Pernapasan Techniques ---
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'pernapasan',
    description:
      'Teknik pernapasan sederhana untuk menenangkan sistem saraf dengan menyeimbangkan napas dalam empat bagian yang sama: tarik, tahan, buang, tahan.',
    scientificBasis:
      'Box breathing, juga dikenal sebagai square breathing, digunakan oleh Navy SEAL dan praktisi mindfulness untuk mengatur sistem saraf otonom. Pola 4-4-4-4 mengaktifkan respons relaksasi dan menurunkan denyut jantung (Seaward, 2017).',
    duration: 5,
    difficulty: 'mudah',
    steps: stepsBoxBreathing,
    iconName: 'Wind',
    defaultSound: 'ocean',
  },
  {
    id: 'ocean-breath',
    name: 'Ocean Breath',
    category: 'pernapasan',
    description:
      'Ciptakan suara menenangkan di pangkal tenggorokan saat bernapas dalam untuk menyerupai ombak laut. Juga dikenal sebagai Ujjayi pranayama dalam tradisi yoga.',
    scientificBasis:
      'Ujjayi pranayama terbukti meningkatkan aktivitas parasimpatik dan memperbaiki variabilitas denyut jantung (HRV), indikator utama ketahanan terhadap stres (Telles et al., 2011). Suara samar menciptakan fokus auditori yang menenangkan.',
    duration: 7,
    difficulty: 'sedang',
    steps: stepsOceanBreath,
    iconName: 'Droplets',
    defaultSound: 'ocean',
  },
  // --- Gerakan Techniques ---
  {
    id: 'mindful-walking',
    name: 'Mindful Walking',
    category: 'gerakan',
    description:
      'Hubungkan dirimu dengan bumi dengan memperhatikan sensasi setiap langkah yang kamu ambil. Berjalan dengan kesadaran penuh pada momen saat ini.',
    scientificBasis:
      'Mindful walking menggabungkan manfaat olahraga ringan dengan meditasi berjalan. Studi menunjukkan bahwa mindful walking mengurangi stres dan kecemasan, meningkatkan kualitas tidur, dan memperbaiki suasana hati (Gotink et al., 2015).',
    duration: 10,
    difficulty: 'mudah',
    steps: stepsMindfulWalking,
    iconName: 'Footprints',
    defaultSound: 'river',
  },
  // --- Somatik & Polyvagal Techniques ---
  {
    id: 'somatic-scan',
    name: 'Relaksasi Somatik Vagal',
    category: 'somatik',
    sensoryType: 'somatik',
    description:
      'Teknik pelepasan ketegangan fisik berdasarkan Polyvagal Theory dan DBT TIPP skills (Paired Muscle Relaxation). Fokus pada area otot utama (bahu, rahang, dada, tangan) untuk menurunkan nada simpatis.',
    scientificBasis:
      'Progressive Muscle Relaxation & Vagus Nerve stimulation (Linehan, 2014; Porges, 2011). Mengencangkan dan melepaskan kelompok otot utama secara sengaja merangsang saraf vagus ventral, secara langsung menurunkan respons fight-or-flight.',
    duration: 6,
    difficulty: 'mudah',
    steps: [
      {
        id: 1,
        instruction: 'Tarik bahu ke arah telinga selama 5 detik, lalu lepaskan sepenuhnya saat buang napas.',
        duration: 20,
        prompt: 'Rasakan bahu turun dan menjadi lebih ringan.',
        senseType: '✋ Sentuh',
        phase: 'somatic',
        visualMode: 'touch',
      },
      {
        id: 2,
        instruction: 'Kencangkan kepalan kedua tanganmu selama 5 detik, lalu buka telapak tangan dengan rileks.',
        duration: 20,
        prompt: 'Rasakan hangat dan aliran darah kembali ke jari-jarimu.',
        senseType: '✋ Sentuh',
        phase: 'somatic',
        visualMode: 'touch',
      },
      {
        id: 3,
        instruction: 'Rilekskan rahang dan lidahmu. Biarkan bibir sedikit terbuka tanpa menahan lidah di langit-langit mulut.',
        duration: 25,
        prompt: 'Rahang yang rileks mengirimkan sinyal rasa aman langsung ke amigdala.',
        senseType: '✋ Sentuh',
        phase: 'somatic',
        visualMode: 'touch',
      },
      {
        id: 4,
        instruction: 'Letakkan satu tangan di dada dan satu di perut. Bernapaslah perlahan hingga tangan di perut naik-turun.',
        duration: 35,
        prompt: 'Rasakan kehangatan telapak tanganmu di atas tubuh.',
        senseType: '✋ Sentuh',
        phase: 'somatic',
        visualMode: 'touch',
      },
    ],
    iconName: 'HeartPulse',
    defaultSound: 'singing-bowls',
  },
  // --- Kognitif Defusion Techniques ---
  {
    id: 'cognitive-defusion',
    name: 'Defusi Kognitif (Daun di Sungai)',
    category: 'kognitif',
    sensoryType: 'defusion',
    description:
      'Latihan CBT & ACT (Acceptance and Commitment Therapy) untuk melihat pikiran cemas sebagai objek luar yang lewat, bukan kebenaran mutlak atau ancaman langsung.',
    scientificBasis:
      'Cognitive Defusion (Hayes et al., 2004). Mengurangi keterikatan kognitif (fusion) dengan membayangkan pikiran mengapung seperti daun di atas sungai. Terbukti mengurangi intensitas kecemasan dan ruminasi.',
    duration: 5,
    difficulty: 'sedang',
    steps: [
      {
        id: 1,
        instruction: 'Bayangkan kamu sedang duduk di tepi sungai yang tenang, memperhatikan daun-daun mengapung terbawa arus.',
        duration: 30,
        prompt: 'Visualisasikan sungai dan aliran airnya yang pelan.',
        senseType: '👁️ Lihat',
        phase: 'defusion',
        visualMode: 'sensory',
      },
      {
        id: 2,
        instruction: 'Setiap kali pikiran cemas atau kekhawatiran muncul, letakkan pikiran itu di atas satu daun yang mengapung.',
        duration: 40,
        prompt: 'Pikiran apa yang sedang muncul saat ini?',
        senseType: '👁️ Lihat',
        phase: 'defusion',
        visualMode: 'sensory',
      },
      {
        id: 3,
        instruction: 'Biarkan daun itu hanyut perlahan mengikuti arus sungai. Jangan menahan atau mendorongnya.',
        duration: 45,
        prompt: 'Amati daun itu bergerak makin jauh tanpa kamu perlu mengubahnya.',
        senseType: '👁️ Lihat',
        phase: 'defusion',
        visualMode: 'sensory',
      },
    ],
    iconName: 'Sparkles',
    defaultSound: 'river',
  },
];

/** Get techniques by category */
export function getTechniquesByCategory(category: string): GroundingTechnique[] {
  if (category === 'all') return groundingTechniques;
  return groundingTechniques.filter((t) => t.category === category);
}
