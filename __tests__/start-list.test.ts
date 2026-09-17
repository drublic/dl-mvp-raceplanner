import fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb, getDbPath } from "@/lib/db";
import {
  addRider,
  getRace,
  listRacesByCategory,
  removeRider,
} from "@/lib/races";
import { ensureSeeded } from "@/lib/seed";

function resetDb() {
  closeDb();
  const dbPath = getDbPath();
  for (const suffix of ["", "-wal", "-shm"]) {
    const file = `${dbPath}${suffix}`;
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}

describe("start list", () => {
  beforeEach(() => {
    resetDb();
    ensureSeeded();
  });

  afterEach(() => {
    closeDb();
  });

  it("seeds Amateur Rund um Merken with 6 riders and cancelled Rheinbach", () => {
    const races = listRacesByCategory("amateure");
    const merken = races.find((race) => race.name === "Rund um Merken");
    const rheinbach = races.find((race) =>
      race.name.includes("Rund in Rheinbach"),
    );

    expect(merken).toMatchObject({
      raceDate: "29.03.",
      weekday: "Sonntag",
      meldeschluss: "25.03.",
      participantCount: 6,
      cancelled: false,
    });
    expect(rheinbach?.cancelled).toBe(true);
    expect(rheinbach?.participantCount).toBe(0);

    const detail = getRace("amateure", merken!.id);
    expect(detail?.riders).toHaveLength(6);
  });

  it("adds a rider to an existing race", () => {
    const merken = listRacesByCategory("amateure").find(
      (race) => race.name === "Rund um Merken",
    );
    expect(merken?.participantCount).toBe(6);

    const result = addRider("amateure", merken!.id, "Leo K.");
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.race.riders).toContain("Leo K.");
    expect(result.race.participantCount).toBe(7);
  });

  it("rejects adds on a cancelled race", () => {
    const rheinbach = listRacesByCategory("amateure").find((race) =>
      race.name.includes("Rund in Rheinbach"),
    );
    expect(rheinbach?.cancelled).toBe(true);

    const before = getRace("amateure", rheinbach!.id);
    const result = addRider("amateure", rheinbach!.id, "Jonas B.");

    expect(result).toEqual({ ok: false, error: "cancelled" });
    expect(getRace("amateure", rheinbach!.id)?.riders).toEqual(before?.riders);
  });

  it("removes a rider from an open race", () => {
    const merken = listRacesByCategory("amateure").find(
      (race) => race.name === "Rund um Merken",
    );
    const result = removeRider("amateure", merken!.id, "Jonas B.");
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.race.riders).not.toContain("Jonas B.");
    expect(result.race.participantCount).toBe(5);
  });

  it("persists an added rider across db reopen", () => {
    const merken = listRacesByCategory("amateure").find(
      (race) => race.name === "Rund um Merken",
    );
    addRider("amateure", merken!.id, "Leo K.");

    closeDb();
    const afterReload = getRace("amateure", merken!.id);
    expect(afterReload?.riders).toContain("Leo K.");
    expect(afterReload?.participantCount).toBe(7);
  });
});
