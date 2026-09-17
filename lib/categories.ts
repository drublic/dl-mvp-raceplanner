export const CATEGORIES = [
  { id: "amateure", name: "Amateure", sortOrder: 1 },
  { id: "elite-amateure", name: "Elite-Amateure", sortOrder: 2 },
  { id: "frauen", name: "Frauen", sortOrder: 3 },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

export function categoryIdFromSheetName(sheetName: string): CategoryId | null {
  const match = CATEGORIES.find((category) => category.name === sheetName);
  return match?.id ?? null;
}
