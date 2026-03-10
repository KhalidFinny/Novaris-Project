import React from "react";
import type { KPIStripData } from "../../types/decisionCenter";
import { useLocale } from "../../hooks/useLocale";
import { Clock, TrendingUp, Flame, CheckCircle2, Info } from "lucide-react";

interface KPIStripProps {
  data: KPIStripData;
}

function InfoChip({ label, help }: { label: string; help: string }) {
  return (
    <span className="group relative inline-flex items-center gap-1.5">
      <span>{label}</span>
      <Info size={12} className="text-ink/28 dark:text-frost/28" />
      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-72 rounded-xl border border-ink/[0.06] bg-bone px-3 py-2 font-sans text-[12px] leading-relaxed text-ink/70 opacity-0 transition-opacity group-hover:opacity-100 dark:border-frost/[0.08] dark:bg-charcoal dark:text-frost/72">
        {help}
      </span>
    </span>
  );
}

function Card({
  title,
  help,
  icon,
  children,
  detail,
}: {
  title: string;
  help: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-ink/[0.04] p-5 transition-all duration-300 hover:border-ink/[0.12] dark:border-frost/[0.04] dark:hover:border-frost/[0.12]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-ink/50 dark:text-frost/50">
          {icon}
          <div className="font-sans text-[13px] tracking-wide">
            <InfoChip label={title} help={help} />
          </div>
        </div>
      </div>
      <div className="mt-4">{children}</div>
      <div className="mt-4 border-t border-ink/[0.04] pt-3 dark:border-frost/[0.04]">
        {detail}
      </div>
    </div>
  );
}

export function KPIStrip({ data }: KPIStripProps) {
  const { language, formatCurrency } = useLocale();
  const isId = language === "id";

  const revenueTone = data.monthlyRevenue
    ? data.monthlyRevenue.variancePercent >= 0
      ? "text-emerald-600 dark:text-emerald-400"
      : data.monthlyRevenue.variancePercent > -15
        ? "text-amber-600 dark:text-amber-400"
        : "text-scarlet dark:text-scarlet-bright"
    : "text-ink dark:text-frost";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <Card
        title={isId ? "Runway kas" : "Cash runway"}
        help={isId ? "Berapa lama uang di bank bisa menutup tagihan bulanan pada kecepatan sekarang." : "How long the money in the bank can cover monthly bills at the current pace."}
        icon={<Clock size={16} />}
        detail={data.cashRunway ? (
          <p className="font-sans text-[12px] leading-relaxed text-ink/52 dark:text-frost/52">
            {formatCurrency(data.cashRunway.cashInBank)} / ({formatCurrency(data.cashRunway.monthlyBills)} / 30) = {data.cashRunway.baseRunway} {isId ? "hari" : "days"}
          </p>
        ) : <p className="font-sans text-[12px] text-ink/38 dark:text-frost/38">{isId ? "Butuh kas dan tagihan bulanan." : "Needs cash and monthly bills."}</p>}
      >
        {data.cashRunway ? (
          <>
            <div className="font-fraunces text-3xl font-light text-ink dark:text-frost">{data.cashRunway.baseRunway} {isId ? "hari" : "days"}</div>
            <p className="mt-1 font-sans text-[12px] text-ink/50 dark:text-frost/50">{isId ? "Burn harian" : "Daily burn"}: {formatCurrency(data.cashRunway.dailyBurnRate)}</p>
          </>
        ) : <div className="font-sans text-[14px] text-ink/40 dark:text-frost/40 italic">{isId ? "Masukkan data kas" : "Enter cash data"}</div>}
      </Card>

      <Card
        title={isId ? "Pendapatan vs target" : "Revenue vs target"}
        help={isId ? "Membandingkan pendapatan bulanan aktual dengan target yang Anda isi, atau dengan titik impas jika target kosong." : "Compares actual monthly revenue with your revenue target, or with break-even if target is empty."}
        icon={<TrendingUp size={16} />}
        detail={data.monthlyRevenue ? (
          <p className="font-sans text-[12px] leading-relaxed text-ink/52 dark:text-frost/52">
            {formatCurrency(data.monthlyRevenue.actualRevenue)} - {formatCurrency(data.monthlyRevenue.targetRevenue ?? data.monthlyRevenue.breakEvenRevenue)} = {formatCurrency(data.monthlyRevenue.variance)}
          </p>
        ) : <p className="font-sans text-[12px] text-ink/38 dark:text-frost/38">{isId ? "Butuh pendapatan dan tagihan." : "Needs revenue and bills."}</p>}
      >
        {data.monthlyRevenue ? (
          <>
            <div className={`font-fraunces text-3xl font-light ${revenueTone}`}>{data.monthlyRevenue.variancePercent >= 0 ? "+" : ""}{data.monthlyRevenue.variancePercent.toFixed(1)}%</div>
            <p className="mt-1 font-sans text-[12px] text-ink/50 dark:text-frost/50">
              {data.monthlyRevenue.targetRevenue
                ? `${isId ? "Target" : "Target"}: ${formatCurrency(data.monthlyRevenue.targetRevenue)}`
                : `${isId ? "Titik impas" : "Break-even"}: ${formatCurrency(data.monthlyRevenue.breakEvenRevenue)}`}
            </p>
          </>
        ) : <div className="font-sans text-[14px] text-ink/40 dark:text-frost/40 italic">{isId ? "Masukkan pendapatan" : "Enter revenue"}</div>}
      </Card>

      <Card
        title={isId ? "Burn harian" : "Daily burn"}
        help={isId ? "Tagihan bulanan Anda dibagi 30 untuk membaca seberapa cepat uang habis per hari." : "Your monthly bills divided by 30 to show how fast money leaves each day."}
        icon={<Flame size={16} />}
        detail={data.dailyBurn ? (
          <p className="font-sans text-[12px] leading-relaxed text-ink/52 dark:text-frost/52">
            {data.dailyBurn.currentRate > 0 ? `${formatCurrency(data.dailyBurn.currentRate)} ${isId ? "per hari" : "per day"}` : "-"}
          </p>
        ) : <p className="font-sans text-[12px] text-ink/38 dark:text-frost/38">{isId ? "Butuh tagihan bulanan." : "Needs monthly bills."}</p>}
      >
        {data.dailyBurn ? (
          <>
            <div className="font-fraunces text-3xl font-light text-ink dark:text-frost">{formatCurrency(data.dailyBurn.currentRate)}</div>
            <p className="mt-1 font-sans text-[12px] text-ink/50 dark:text-frost/50">
              {data.dailyBurn.isAccelerating ? (isId ? "Tekanan biaya naik" : "Cost pressure rising") : (isId ? "Stabil untuk saat ini" : "Stable for now")}
            </p>
          </>
        ) : <div className="font-sans text-[14px] text-ink/40 dark:text-frost/40 italic">{isId ? "Masukkan tagihan" : "Enter bills"}</div>}
      </Card>

      <Card
        title={isId ? "Kepatuhan / cadangan" : "Compliance / reserve"}
        help={isId ? "Saat ini kartu ini berfungsi sebagai penanda cadangan struktur. Nantinya bisa menampung compliance atau kesehatan operasional tambahan." : "Right now this acts as a reserve structure marker. Later it can hold compliance or extra operating health signals."}
        icon={<CheckCircle2 size={16} />}
        detail={<p className="font-sans text-[12px] leading-relaxed text-ink/52 dark:text-frost/52">{isId ? "Dipakai sebagai ruang penjelasan tambahan agar setiap angka di atas tidak terasa seperti black box." : "Used as extra explanation space so the numbers above do not feel like a black box."}</p>}
      >
        <div className="font-fraunces text-3xl font-light text-ink dark:text-frost">{data.compliance ? `${data.compliance.finalScore.toFixed(0)}%` : "--"}</div>
        <p className="mt-1 font-sans text-[12px] text-ink/50 dark:text-frost/50">{isId ? "Placeholder transparansi" : "Transparency placeholder"}</p>
      </Card>
    </div>
  );
}
