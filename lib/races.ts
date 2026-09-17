import { ensureSeeded } from "@/lib/seed";
import { getDb } from "@/lib/db";
import type { CategoryId } from "@/lib/categories";

export type RaceSummary = {
  id: number;
  categoryId: CategoryId;
  name: string;
  weekday: string;
  raceDate: string;
  meldeschluss: string | null;
  cancelled: boolean;
  participantCount: number;
};

export type RaceDetail = RaceSummary & {
  riders: string[];
};

type RaceRow = {
  id: number;
  category_id: string;
  name: string;
  weekday: string;
  race_date: string;
  meldeschluss: string | null;
  cancelled: number;
  participant_count: number;
};

function mapRace(row: RaceRow): RaceSummary {
  return {
    id: row.id,
    categoryId: row.category_id as CategoryId,
    name: row.name,
    weekday: row.weekday,
    raceDate: row.race_date,
    meldeschluss: row.meldeschluss,
    cancelled: row.cancelled === 1,
    participantCount: row.participant_count,
  };
}

export function listRacesByCategory(categoryId: CategoryId): RaceSummary[] {
  ensureSeeded();
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT r.id, r.category_id, r.name, r.weekday, r.race_date, r.meldeschluss, r.cancelled,
              (SELECT COUNT(*) FROM start_list_entries e WHERE e.race_id = r.id) AS participant_count
       FROM races r
       WHERE r.category_id = ?
       ORDER BY r.sort_order ASC, r.id ASC`,
    )
    .all(categoryId) as RaceRow[];

  return rows.map(mapRace);
}

export function getRace(categoryId: CategoryId, raceId: number): RaceDetail | null {
  ensureSeeded();
  const db = getDb();
  const row = db
    .prepare(
      `SELECT r.id, r.category_id, r.name, r.weekday, r.race_date, r.meldeschluss, r.cancelled,
              (SELECT COUNT(*) FROM start_list_entries e WHERE e.race_id = r.id) AS participant_count
       FROM races r
       WHERE r.id = ? AND r.category_id = ?`,
    )
    .get(raceId, categoryId) as RaceRow | undefined;

  if (!row) {
    return null;
  }

  const riders = db
    .prepare(
      `SELECT rider_name FROM start_list_entries WHERE race_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(raceId) as Array<{ rider_name: string }>;

  return {
    ...mapRace(row),
    riders: riders.map((entry) => entry.rider_name),
  };
}

export type MutationResult =
  | { ok: true; race: RaceDetail }
  | { ok: false; error: "not_found" | "cancelled" | "duplicate" | "empty" | "missing" };

export function addRider(
  categoryId: CategoryId,
  raceId: number,
  riderName: string,
): MutationResult {
  ensureSeeded();
  const trimmed = riderName.trim();
  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  const race = getRace(categoryId, raceId);
  if (!race) {
    return { ok: false, error: "not_found" };
  }
  if (race.cancelled) {
    return { ok: false, error: "cancelled" };
  }

  const db = getDb();
  const insertRider = db.transaction((currentRaceId: number, currentRiderName: string) => {
    const insertResult = db
      .prepare(
        `INSERT OR IGNORE INTO start_list_entries (race_id, rider_name, sort_order)
         VALUES (?, ?, 0)`,
      )
      .run(currentRaceId, currentRiderName);

    if (insertResult.changes === 0) {
      return false;
    }

    db.prepare(`UPDATE start_list_entries SET sort_order = id WHERE id = ?`).run(
      Number(insertResult.lastInsertRowid),
    );
    return true;
  });

  const inserted = insertRider(raceId, trimmed);
  if (!inserted) {
    return { ok: false, error: "duplicate" };
  }

  const updated = getRace(categoryId, raceId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, race: updated };
}

export function removeRider(
  categoryId: CategoryId,
  raceId: number,
  riderName: string,
): MutationResult {
  ensureSeeded();
  const trimmed = riderName.trim();
  if (!trimmed) {
    return { ok: false, error: "empty" };
  }

  const race = getRace(categoryId, raceId);
  if (!race) {
    return { ok: false, error: "not_found" };
  }
  if (race.cancelled) {
    return { ok: false, error: "cancelled" };
  }
  if (!race.riders.includes(trimmed)) {
    return { ok: false, error: "missing" };
  }

  getDb()
    .prepare(`DELETE FROM start_list_entries WHERE race_id = ? AND rider_name = ?`)
    .run(raceId, trimmed);

  const updated = getRace(categoryId, raceId);
  if (!updated) {
    return { ok: false, error: "not_found" };
  }
  return { ok: true, race: updated };
}
