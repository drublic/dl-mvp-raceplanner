import Link from "next/link";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { listRacesByCategory } from "@/lib/races";

export function CalendarView({
  activeCategory,
}: {
  activeCategory: CategoryId;
}) {
  const races = listRacesByCategory(activeCategory);

  return (
    <section className="calendar-page" data-testid="calendar-page">
      <h1>Kalender</h1>
      <p className="calendar-page__intro">
        Saisonrennen nach Kategorie — Meldeschluss ist die Meldefrist.
      </p>

      <nav className="category-tabs" aria-label="Kategorien">
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <Link
              key={category.id}
              href={`/calendar/${category.id}`}
              className={isActive ? "category-tabs__link is-active" : "category-tabs__link"}
              aria-current={isActive ? "page" : undefined}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>

      <ul className="race-list" data-testid={`race-list-${activeCategory}`}>
        {races.map((race) => (
          <li
            key={race.id}
            className={race.cancelled ? "race-list__item is-cancelled" : "race-list__item"}
            data-cancelled={race.cancelled ? "true" : undefined}
          >
            <Link href={`/calendar/${activeCategory}/${race.id}`} className="race-list__link">
              <span className="race-list__name">{displayRaceName(race.name, race.cancelled)}</span>
              <span className="race-list__meta">
                {race.weekday}, {race.raceDate}
                {race.meldeschluss ? ` · Meldeschluss ${race.meldeschluss}` : ""}
                {` · ${race.participantCount} Teilnehmer:innen`}
              </span>
              {race.cancelled ? (
                <span className="race-list__badge" data-testid="cancelled-badge">
                  Abgesagt
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function displayRaceName(name: string, cancelled: boolean): string {
  if (!cancelled) {
    return name;
  }
  return name.replace(/\s*[—–-]\s*cancelled\s*$/i, "").trim();
}
