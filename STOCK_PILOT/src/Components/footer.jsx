export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark text-light py-3 mt-4">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <span>© {year} StockFlow</span>
        <span className="small">Version 1.0 | All rights reserved</span>
      </div>
    </footer>
  );
}
