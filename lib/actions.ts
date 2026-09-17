"use server";

import { revalidatePath } from "next/cache";
import { isCategoryId } from "@/lib/categories";
import { addRider, removeRider } from "@/lib/races";

export type ActionState = {
  error?: string;
};

export async function addRiderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const categoryId = String(formData.get("categoryId") ?? "");
  const raceId = Number(formData.get("raceId"));
  const riderName = String(formData.get("riderName") ?? "");

  if (!isCategoryId(categoryId) || !Number.isFinite(raceId)) {
    return { error: "Ungültiges Rennen." };
  }

  const result = addRider(categoryId, raceId, riderName);
  if (!result.ok) {
    if (result.error === "cancelled") {
      return { error: "Dieses Rennen ist abgesagt — Startliste nicht änderbar." };
    }
    if (result.error === "duplicate") {
      return { error: "Fahrer:in ist bereits auf der Startliste." };
    }
    if (result.error === "empty") {
      return { error: "Bitte einen Namen eingeben." };
    }
    return { error: "Fahrer:in konnte nicht hinzugefügt werden." };
  }

  revalidatePath(`/calendar/${categoryId}`);
  revalidatePath(`/calendar/${categoryId}/${raceId}`);
  return {};
}

export async function removeRiderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const categoryId = String(formData.get("categoryId") ?? "");
  const raceId = Number(formData.get("raceId"));
  const riderName = String(formData.get("riderName") ?? "");

  if (!isCategoryId(categoryId) || !Number.isFinite(raceId)) {
    return { error: "Ungültiges Rennen." };
  }

  const result = removeRider(categoryId, raceId, riderName);
  if (!result.ok) {
    if (result.error === "cancelled") {
      return { error: "Dieses Rennen ist abgesagt — Startliste nicht änderbar." };
    }
    return { error: "Fahrer:in konnte nicht entfernt werden." };
  }

  revalidatePath(`/calendar/${categoryId}`);
  revalidatePath(`/calendar/${categoryId}/${raceId}`);
  return {};
}
