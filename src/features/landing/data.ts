export interface DayOneFeature {
    label: string;
    included: boolean;
}

export interface Problem {
    tag: string;
    headline: string;
    body: string;
}

export interface Stat {
    stat: string;
    label: string;
    src: string;
}

export interface Feature {
    n: string;
    label: string;
    desc: string;
}

export interface Benefit {
    n: string;
    headline: string;
    body: string;
}

export const DAY_ONE_FEATURES: DayOneFeature[] = [
    { label: 'Presentation-ready PDF report', included: true },
    { label: 'Excel sheet with all calculations', included: true },
    { label: 'Immediate download on checkout', included: true },
    { label: 'Actionable decision narratives', included: true },
    { label: 'One-time $1.50 payment', included: true },
];

export const DAY_ONE_FEATURES_ID: DayOneFeature[] = [
    { label: 'Laporan PDF siap presentasi', included: true },
    { label: 'Sheet Excel dengan semua kalkulasi', included: true },
    { label: 'Unduhan instan setelah pembayaran', included: true },
    { label: 'Narasi keputusan untuk action', included: true },
    { label: 'Satu kali bayar $1.50', included: true },
];

// Stats for the Problem section stat rows
export const STATS: Stat[] = [
    {
        stat: '82%',
        label: 'of businesses fail due to cash flow problems.',
        src: 'U.S. Bank Study via SCORE',
    },
    {
        stat: '62%',
        label: 'of SMBs are currently owed late payments.',
        src: 'Intuit QuickBooks, 2025',
    },
    {
        stat: '90%',
        label: 'of small businesses face a financial or operational challenge each year.',
        src: 'Federal Reserve SBCS, 2024',
    },
    {
        stat: '60%',
        label: 'of SMBs cite cash flow as their biggest challenge.',
        src: 'PYMNTS Intelligence, 2024',
    },
    {
        stat: '32',
        label: 'days is the average payment delay.',
        src: 'Coface UK Payment Survey, 2025',
    },
    {
        stat: '80%',
        label: 'of Cost of Delay is caused by waiting time.',
        src: 'Black Swan Farming / Lean Institute',
    },
];

export const STATS_ID: Stat[] = [
    {
        stat: '82%',
        label: 'bisnis gagal karena masalah arus kas.',
        src: 'Studi Bank AS via SCORE',
    },
    {
        stat: '62%',
        label: 'SMB saat ini memiliki pembayaran terlambat yang belum diterima.',
        src: 'Intuit QuickBooks, 2025',
    },
    {
        stat: '90%',
        label: 'bisnis kecil menghadapi tantangan finansial atau operasional setiap tahun.',
        src: 'Federal Reserve SBCS, 2024',
    },
    {
        stat: '60%',
        label: 'SMB menyebut arus kas sebagai tantangan terbesar.',
        src: 'PYMNTS Intelligence, 2024',
    },
    {
        stat: '32',
        label: 'hari adalah rata-rata keterlambatan pembayaran.',
        src: 'Coface UK Payment Survey, 2025',
    },
    {
        stat: '80%',
        label: 'dari Biaya Keterlambatan disebabkan oleh waktu tunggu.',
        src: 'Black Swan Farming / Lean Institute',
    },
];

export const PROBLEMS: Problem[] = [
    {
        tag: '01 — Reactive',
        headline: 'You find out too late.',
        body: 'By the time most businesses notice a risk, it\'s already a problem. Reactive management is expensive management.',
    },
    {
        tag: '02 — Scattered',
        headline: 'Risk lives in a spreadsheet. If at all.',
        body: 'Across emails, docs, and gut feel — risk is buried, siloed, never in one place. Nobody has the full picture.',
    },
    {
        tag: '03 — Complex',
        headline: 'Tools built for enterprises, not owners.',
        body: 'Most risk platforms are built for 500-person compliance teams — slow, painful, wrong pace for business owners.',
    },
];

export const PROBLEMS_ID: Problem[] = [
    {
        tag: '01 — Reaktif',
        headline: 'Anda sadar saat semuanya sudah terlambat.',
        body: 'Saat kebanyakan bisnis menyadari risiko, masalahnya sudah terjadi. Manajemen reaktif adalah biaya yang mahal.',
    },
    {
        tag: '02 — Terpencar',
        headline: 'Risiko hidup di spreadsheet. Kalau ada.',
        body: 'Di email, dokumen, dan intuisi - risiko tersebar dan tidak pernah terlihat utuh. Tidak ada yang punya gambaran penuh.',
    },
    {
        tag: '03 — Rumit',
        headline: 'Tools dibuat untuk enterprise, bukan owner.',
        body: 'Banyak platform risiko dirancang untuk tim compliance besar - lambat, berat, dan tidak cocok untuk ritme owner bisnis.',
    },
];

export const FEATURES: Feature[] = [
    { n: '01', label: 'Operational Risk Mapping', desc: 'Identify weak points before they become incidents.' },
    { n: '02', label: 'Financial Exposure Tracking', desc: 'Run 500 probable futures. See where certainty ends.' },
    { n: '03', label: 'Compliance Engine', desc: 'Continuous monitoring that flags drift before it compounds.' },
    { n: '04', label: 'Smart Alert Routing', desc: 'Only the signals that need your attention, routed to the right person.' },
    { n: '05', label: 'Scenario Modeling', desc: 'One delay, full financial impact — the Cascade Effect engine.' },
];

export const FEATURES_ID: Feature[] = [
    { n: '01', label: 'Pemetaan Risiko Operasional', desc: 'Kenali titik lemah sebelum jadi insiden.' },
    { n: '02', label: 'Pelacakan Eksposur Finansial', desc: 'Jalankan 500 skenario kemungkinan dan lihat batas kepastian.' },
    { n: '03', label: 'Engine Kepatuhan', desc: 'Monitoring berkelanjutan yang menangkap deviasi sebelum membesar.' },
    { n: '04', label: 'Routing Alert Pintar', desc: 'Hanya sinyal penting, dikirim ke orang yang tepat.' },
    { n: '05', label: 'Pemodelan Skenario', desc: 'Satu delay, dampak finansial penuh - Cascade Effect engine.' },
];

export const BENEFITS: Benefit[] = [
    {
        n: '01',
        headline: 'Decisions land with conviction',
        body: 'With a clear risk picture, second-guessing turns into momentum. Clarity is a competitive advantage — treat it that way.',
    },
    {
        n: '02',
        headline: 'Catch problems before they cost you',
        body: 'IBM found organizations with tested incident response plans saved an average of $2.66M per breach. Early flags mean small fixes instead of recoveries.',
    },
    {
        n: '03',
        headline: 'Risk management stops being a job',
        body: 'Set up once, monitor continuously. Novaris runs in the background so you focus on building — not babysitting spreadsheets.',
    },
];

export const BENEFITS_ID: Benefit[] = [
    {
        n: '01',
        headline: 'Keputusan diambil dengan lebih yakin',
        body: 'Dengan gambaran risiko yang jelas, keraguan berubah jadi momentum. Kejelasan adalah keunggulan kompetitif.',
    },
    {
        n: '02',
        headline: 'Masalah tertangkap sebelum mahal',
        body: 'IBM menemukan organisasi dengan rencana respons insiden yang teruji menghemat rata-rata $2.66M per pelanggaran.',
    },
    {
        n: '03',
        headline: 'Manajemen risiko tidak lagi jadi beban kerja',
        body: 'Setup sekali, monitor terus. Novaris berjalan di latar belakang agar Anda fokus membangun bisnis.',
    },
];
