import fs from "node:fs";
import path from "node:path";
import { categoryIdFromSheetName, CATEGORIES } from "@/lib/categories";
import { getDb } from "@/lib/db";

type SeedRace = {
  name: string;
  weekday: string;
  date: string;
  startTime?: string | null;
  meldeSchluss?: string | null;
  cancelled: boolean;
  riders: string[];
};

type SeasonSeed = Record<string, SeedRace[]>;

const SEED_PATH = path.join(process.cwd(), "data", "seed", "season.json");

export function ensureSeeded(): void {
  const db = getDb();
  const existing = db.prepare("SELECT COUNT(*) AS count FROM races").get() as {
    count: number;
  };
  if (existing.count > 0) {
    return;
  }

  if (!fs.existsSync(SEED_PATH)) {
    throw new Error(`Missing season seed at ${SEED_PATH}`);
  }

  const season = JSON.parse(fs.readFileSync(SEED_PATH, "utf8")) as SeasonSeed;

  const insertCategory = db.prepare(
    `INSERT OR IGNORE INTO categories (id, name, sort_order) VALUES (@id, @name, @sortOrder)`,
  );
  const insertRace = db.prepare(
    `INSERT INTO races (category_id, name, weekday, race_date, meldeschluss, cancelled, sort_order)
     VALUES (@categoryId, @name, @weekday, @raceDate, @meldeschluss, @cancelled, @sortOrder)`,
  );
  const insertRider = db.prepare(
    `INSERT INTO start_list_entries (race_id, rider_name, sort_order)
     VALUES (@raceId, @riderName, @sortOrder)`,
  );

  const seedAll = db.transaction(() => {
    for (const category of CATEGORIES) {
      insertCategory.run({
        id: category.id,
        name: category.name,
        sortOrder: category.sortOrder,
      });
    }

    for (const [sheetName, races] of Object.entries(season)) {
      const categoryId = categoryIdFromSheetName(sheetName);
      if (!categoryId) {
        continue;
      }

      races.forEach((race, raceIndex) => {
        const result = insertRace.run({
          categoryId,
          name: race.name,
          weekday: race.weekday,
          raceDate: race.date,
          meldeschluss: race.meldeSchluss ?? null,
          cancelled: race.cancelled ? 1 : 0,
          sortOrder: raceIndex,
        });

        const raceId = Number(result.lastInsertRowid);
        race.riders.forEach((riderName, riderIndex) => {
          insertRider.run({
            raceId,
            riderName,
            sortOrder: riderIndex,
          });
        });
      });
    }
  });

  seedAll();
}
