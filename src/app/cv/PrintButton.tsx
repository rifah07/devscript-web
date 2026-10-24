'use client';

export function PrintButton() {
  return (
    <button type="button" className="btn quiet small no-print" onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}
