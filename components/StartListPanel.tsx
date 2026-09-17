"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  addRiderAction,
  removeRiderAction,
  type ActionState,
} from "@/lib/actions";
import type { RaceDetail } from "@/lib/races";

const initialState: ActionState = {};

export function StartListPanel({ race }: { race: RaceDetail }) {
  const [addState, addAction, addPending] = useActionState(
    addRiderAction,
    initialState,
  );
  const [removeState, removeAction, removePending] = useActionState(
    removeRiderAction,
    initialState,
  );

  const displayName = race.cancelled
    ? race.name.replace(/\s*[—–-]\s*cancelled\s*$/i, "").trim()
    : race.name;

  return (
    <section className="start-list-page" data-testid="start-list-page">
      <p className="start-list-page__back">
        <Link href={`/calendar/${race.categoryId}`}>← Kalender</Link>
      </p>
      <h1>{displayName}</h1>
      <p className="start-list-page__meta">
        {race.weekday}, {race.raceDate}
        {race.meldeschluss ? ` · Meldeschluss ${race.meldeschluss}` : ""}
      </p>

      {race.cancelled ? (
        <p className="cancelled-banner" data-testid="cancelled-banner" role="status">
          Dieses Rennen ist abgesagt. Die Startliste kann nicht geändert werden.
        </p>
      ) : null}

      <p className="start-list-page__count" data-testid="participant-count">
        {race.participantCount} Teilnehmer:innen
      </p>

      <ul className="rider-list" data-testid="rider-list">
        {race.riders.map((rider) => (
          <li key={rider} className="rider-list__item">
            <span>{rider}</span>
            {!race.cancelled ? (
              <form action={removeAction}>
                <input type="hidden" name="categoryId" value={race.categoryId} />
                <input type="hidden" name="raceId" value={race.id} />
                <input type="hidden" name="riderName" value={rider} />
                <button type="submit" disabled={removePending}>
                  Entfernen
                </button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>

      {removeState.error ? (
        <p className="form-error" role="alert">
          {removeState.error}
        </p>
      ) : null}

      {!race.cancelled ? (
        <form className="add-rider-form" action={addAction} data-testid="add-rider-form">
          <label htmlFor="riderName">Fahrer:in hinzufügen</label>
          <div className="add-rider-form__row">
            <input
              id="riderName"
              name="riderName"
              type="text"
              autoComplete="off"
              required
            />
            <input type="hidden" name="categoryId" value={race.categoryId} />
            <input type="hidden" name="raceId" value={race.id} />
            <button type="submit" disabled={addPending}>
              Hinzufügen
            </button>
          </div>
        </form>
      ) : (
        <form
          className="add-rider-form is-disabled"
          action={addAction}
          data-testid="add-rider-form"
        >
          <label htmlFor="riderName">Fahrer:in hinzufügen</label>
          <div className="add-rider-form__row">
            <input
              id="riderName"
              name="riderName"
              type="text"
              disabled
              aria-disabled="true"
            />
            <input type="hidden" name="categoryId" value={race.categoryId} />
            <input type="hidden" name="raceId" value={race.id} />
            <button type="submit" disabled>
              Hinzufügen
            </button>
          </div>
        </form>
      )}

      {addState.error ? (
        <p className="form-error" role="alert" data-testid="add-error">
          {addState.error}
        </p>
      ) : null}
    </section>
  );
}
