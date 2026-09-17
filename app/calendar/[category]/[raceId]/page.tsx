import { notFound } from "next/navigation";
import { StartListPanel } from "@/components/StartListPanel";
import { isCategoryId } from "@/lib/categories";
import { getRace } from "@/lib/races";

export default async function RaceDetailPage({
  params,
}: {
  params: Promise<{ category: string; raceId: string }>;
}) {
  const { category, raceId: raceIdParam } = await params;
  if (!isCategoryId(category)) {
    notFound();
  }

  const raceId = Number(raceIdParam);
  if (!Number.isFinite(raceId)) {
    notFound();
  }

  const race = getRace(category, raceId);
  if (!race) {
    notFound();
  }

  return <StartListPanel race={race} />;
}
