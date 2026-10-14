import React from 'react'

export default function CoverSculpture() {
  return <div className="cover-sculpture" aria-hidden="true">
    <svg viewBox="0 0 800 800" fill="none">
      <defs>
        <radialGradient id="cover-pearl" cx=".32" cy=".25" r=".8"><stop stopColor="#ffffff" stopOpacity=".8" /><stop offset=".48" stopColor="#dde4d4" stopOpacity=".25" /><stop offset="1" stopColor="#91afa7" stopOpacity=".32" /></radialGradient>
      </defs>
      <g className="sculpture-shell"><path d="M398 125C572 79 689 194 668 374C650 529 532 671 344 654C188 640 95 517 131 359C162 224 252 164 398 125Z" fill="url(#cover-pearl)" /></g>
    </svg>
    <span className="sculpture-coordinate">RESEARCH · STRATEGY · EXPERIENCE</span>
  </div>
}
