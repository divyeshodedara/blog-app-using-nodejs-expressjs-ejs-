import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/4">
      <div className="container text-center py-6 text-sm muted">
        &copy; {new Date().getFullYear()} BlogiFy — built by Divyesh Odedara
      </div>
    </footer>
  );
}
