import { notFound } from "next/navigation";
import { CalendarView } from "@/components/CalendarView";
import { isCategoryId } from "@/lib/categories";

export default async function CategoryCalendarPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategoryId(category)) {
    notFound();
  }

  return <CalendarView activeCategory={category} />;
}
