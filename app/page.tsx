export default function HomePage() {
  return (
    <section className="empty-home" data-testid="empty-home">
      <h1>Startlist</h1>
      <p>Noch keine Rennen — die Saisonliste kommt als Nächstes.</p>
      <a
        className="club-site-button"
        href="https://rtcdsd.de/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Zur Club-Website
      </a>
    </section>
  );
}
