"use client";

export default function VibeCoderPixel() {
  const P = 8; // pixel size

  return (
    <div className="relative select-none" aria-hidden="true">
      <div className="absolute inset-0 blur-[100px] opacity-40 bg-gradient-to-br from-accent via-cyan-500/70 to-purple-600/50 rounded-full scale-95" />
      <div className="absolute inset-[15%] blur-[60px] opacity-25 bg-accent rounded-full" />

      <svg
        viewBox="0 0 320 380"
        className="relative w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
      >
        <defs>
          <filter id="g1">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g2">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="g3">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="scan" patternUnits="userSpaceOnUse" width="320" height="4">
            <rect width="320" height="2" fill="transparent" />
            <rect y="2" width="320" height="2" fill="rgba(0,0,0,0.06)" />
          </pattern>
          <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16213e" />
            <stop offset="100%" stopColor="#0a0a1a" />
          </linearGradient>
          <radialGradient id="deskGlow" cx="50%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#1db954" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* ===== DESK SURFACE ===== */}
        <rect x="16" y="300" width="288" height={P*2} rx="2" fill="url(#deskGrad)" stroke="#0f3460" strokeWidth="0.8" />
        <rect x="16" y="300" width="288" height={P*2} rx="2" fill="url(#deskGlow)" />

        {/* ===== MONITOR ===== */}
        <g>
          <rect x="32" y="228" width="88" height="64" rx="3" fill="#06060f" stroke="#00d4ff" strokeWidth="1.2" filter="url(#g2)" />
          <rect x="36" y="232" width="80" height="56" fill="#0b0e17" />
          {/* Code lines */}
          {[
            { y: 238, w: 36, c: "#1db954", d: "2s" },
            { y: 244, w: 52, c: "#00d4ff", d: "2.4s" },
            { y: 250, w: 24, c: "#c084fc", d: "1.8s" },
            { y: 256, w: 60, c: "#1db954", d: "3s" },
            { y: 262, w: 44, c: "#00d4ff", d: "2.2s" },
            { y: 268, w: 56, c: "#c084fc", d: "2.6s" },
            { y: 274, w: 32, c: "#1db954", d: "1.6s" },
            { y: 280, w: 48, c: "#00d4ff", d: "2.8s" },
          ].map((l, i) => (
            <rect key={i} x="40" y={l.y} width={l.w} height="3" rx="1" fill={l.c} opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.3;0.7" dur={l.d} repeatCount="indefinite" />
            </rect>
          ))}
          {/* Monitor stand */}
          <rect x="68" y="292" width="16" height={P} fill="#16213e" />
          <rect x="60" y="298" width="32" height="3" rx="1" fill="#16213e" />
        </g>

        {/* ===== MOUSE ===== */}
        <g>
          <rect x="228" y="288" width="22" height="14" rx="7" fill="#12121f" stroke="#c084fc" strokeWidth="0.8" filter="url(#g3)" />
          <rect x="237" y="288" width="4" height="5" rx="2" fill="#c084fc" opacity="0.5" />
          <circle cx="239" cy="295" r="1.5" fill="#c084fc" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ===== BODY (hoodie) ===== */}
        <g>
          {/* Shoulders */}
          <rect x="108" y="200" width="104" height="100" rx="6" fill="#0e0e0e" />
          {/* Torso core */}
          <rect x="116" y="208" width="88" height="88" rx="4" fill="#111113" />
          {/* Hoodie seam */}
          <line x1="160" y1="205" x2="160" y2="296" stroke="#1a1a1c" strokeWidth="1.5" />
          {/* Hoodie collar V */}
          <path d="M140 200 L160 218 L180 200" fill="none" stroke="#1a1a1c" strokeWidth="1.5" />
          {/* Subtle hoodie texture lines */}
          <line x1="130" y1="240" x2="130" y2="290" stroke="#151517" strokeWidth="0.5" />
          <line x1="190" y1="240" x2="190" y2="290" stroke="#151517" strokeWidth="0.5" />
        </g>

        {/* ===== LEFT ARM (resting on desk) ===== */}
        <g>
          <rect x="88" y="236" width="24" height="56" rx="4" fill="#0e0e0e" />
          <rect x="72" y="282" width="40" height="16" rx="4" fill="#0e0e0e" />
          {/* Hand */}
          <rect x="68" y="284" width="18" height="14" rx="3" fill="#c4956a" />
          <rect x="64" y="286" width="6" height="10" rx="2" fill="#c4956a" />
        </g>

        {/* ===== RIGHT ARM (reaching to mouse) ===== */}
        <g>
          <rect x="208" y="236" width="24" height="44" rx="4" fill="#0e0e0e" />
          <rect x="212" y="272" width="32" height="16" rx="4" fill="#0e0e0e" />
          {/* Hand on mouse */}
          <rect x="224" y="278" width="26" height="14" rx="4" fill="#c4956a" />
          <rect x="228" y="276" width="7" height="8" rx="2" fill="#c4956a" />
          <rect x="237" y="278" width="7" height="6" rx="2" fill="#c4956a" />
        </g>

        {/* ===== HEAD ===== */}
        <rect x="136" y="124" width="48" height="56" rx="6" fill="#c4956a" />
        <rect x="140" y="128" width="40" height="8" rx="3" fill="#d4a574" opacity="0.3" />

        {/* ===== BEARD ===== */}
        <g>
          <rect x="130" y="164" width="60" height="16" rx="4" fill="#c0c0c0" />
          <rect x="134" y="180" width="52" height="14" rx="3" fill="#b0b0b0" />
          <rect x="138" y="194" width="44" height="12" rx="3" fill="#a0a0a0" />
          <rect x="142" y="206" width="36" height="10" rx="3" fill="#909090" />
          <rect x="146" y="216" width="28" height="8" rx="3" fill="#808080" />
          <rect x="150" y="224" width="20" height="6" rx="3" fill="#707070" />
          {/* Side strands */}
          <rect x="124" y="166" width="10" height="22" rx="3" fill="#b8b8b8" />
          <rect x="186" y="166" width="10" height="22" rx="3" fill="#b8b8b8" />
        </g>

        {/* ===== HAIR ===== */}
        <g>
          <rect x="128" y="118" width="64" height="20" rx="5" fill="#a8a8a8" />
          <rect x="122" y="130" width="16" height="52" rx="4" fill="#989898" />
          <rect x="182" y="130" width="16" height="52" rx="4" fill="#989898" />
          <rect x="118" y="172" width="12" height="32" rx="3" fill="#888888" />
          <rect x="190" y="172" width="12" height="32" rx="3" fill="#888888" />
        </g>

        {/* ===== CLOSED EYES ===== */}
        <line x1="143" y1="148" x2="155" y2="148" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="165" y1="148" x2="177" y2="148" stroke="#3a2a1a" strokeWidth="2.5" strokeLinecap="round" />
        {/* Peaceful eyebrow hint */}
        <line x1="144" y1="143" x2="154" y2="142" stroke="#b08050" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <line x1="166" y1="142" x2="176" y2="143" stroke="#b08050" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

        {/* ===== NOSE ===== */}
        <rect x="157" y="152" width="6" height="8" rx="2" fill="#b8845e" />

        {/* ===== HEADPHONES ===== */}
        <g>
          {/* Band */}
          <path d="M124 138 Q160 96 196 138" fill="none" stroke="#222" strokeWidth="7" strokeLinecap="round" />
          <path d="M124 138 Q160 100 196 138" fill="none" stroke="#333" strokeWidth="3.5" strokeLinecap="round" />
          {/* Neon accent strip on band */}
          <path d="M140 114 Q160 104 180 114" fill="none" stroke="#1db954" strokeWidth="1" opacity="0.5" filter="url(#g1)" />

          {/* Left cup */}
          <rect x="108" y="128" width="22" height="30" rx="7" fill="#1a1a1a" stroke="#1db954" strokeWidth="1.5" filter="url(#g1)" />
          <rect x="112" y="134" width="14" height="18" rx="5" fill="#0d0d0d" />
          <circle cx="119" cy="143" r="5" fill="none" stroke="#1db954" strokeWidth="0.8" opacity="0.5" />
          <circle cx="119" cy="143" r="2.5" fill="none" stroke="#1db954" strokeWidth="0.5" opacity="0.3" />
          <circle cx="119" cy="143" r="1" fill="#1db954" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Right cup */}
          <rect x="190" y="128" width="22" height="30" rx="7" fill="#1a1a1a" stroke="#1db954" strokeWidth="1.5" filter="url(#g1)" />
          <rect x="194" y="134" width="14" height="18" rx="5" fill="#0d0d0d" />
          <circle cx="201" cy="143" r="5" fill="none" stroke="#1db954" strokeWidth="0.8" opacity="0.5" />
          <circle cx="201" cy="143" r="2.5" fill="none" stroke="#1db954" strokeWidth="0.5" opacity="0.3" />
          <circle cx="201" cy="143" r="1" fill="#1db954" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Cable */}
          <path d="M119 158 Q119 190 140 202" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        </g>

        {/* ===== SOUND WAVE BARS (left) ===== */}
        <g opacity="0.6" filter="url(#g1)">
          {[
            { x: 100, h: 10, d: "0.7s" },
            { x: 95, h: 7, d: "0.5s" },
            { x: 90, h: 14, d: "0.9s" },
            { x: 85, h: 5, d: "0.6s" },
          ].map((b, i) => (
            <rect key={i} x={b.x} y={143 - b.h / 2} width="3" height={b.h} rx="1" fill="#1db954">
              <animate attributeName="height" values={`${b.h};${b.h + 8};${b.h}`} dur={b.d} repeatCount="indefinite" />
              <animate attributeName="y" values={`${143 - b.h / 2};${143 - (b.h + 8) / 2};${143 - b.h / 2}`} dur={b.d} repeatCount="indefinite" />
            </rect>
          ))}
        </g>

        {/* ===== SOUND WAVE BARS (right) ===== */}
        <g opacity="0.6" filter="url(#g1)">
          {[
            { x: 217, h: 10, d: "0.8s" },
            { x: 222, h: 7, d: "0.6s" },
            { x: 227, h: 14, d: "1s" },
            { x: 232, h: 5, d: "0.7s" },
          ].map((b, i) => (
            <rect key={i} x={b.x} y={143 - b.h / 2} width="3" height={b.h} rx="1" fill="#1db954">
              <animate attributeName="height" values={`${b.h};${b.h + 8};${b.h}`} dur={b.d} repeatCount="indefinite" />
              <animate attributeName="y" values={`${143 - (b.h) / 2};${143 - (b.h + 8) / 2};${143 - b.h / 2}`} dur={b.d} repeatCount="indefinite" />
            </rect>
          ))}
        </g>

        {/* ===== FLOATING MUSIC NOTES ===== */}
        <g filter="url(#g1)">
          <text x="96" y="108" fontSize="18" fill="#1db954" fontFamily="serif" opacity="0.7">
            &#9835;
            <animateTransform attributeName="transform" type="translate" values="0,0;-4,-14;0,0" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3.2s" repeatCount="indefinite" />
          </text>
        </g>
        <g filter="url(#g2)">
          <text x="216" y="98" fontSize="15" fill="#00d4ff" fontFamily="serif" opacity="0.6">
            &#9834;
            <animateTransform attributeName="transform" type="translate" values="0,0;5,-16;0,0" dur="3.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.15;0.6" dur="3.8s" repeatCount="indefinite" />
          </text>
        </g>
        <g filter="url(#g3)">
          <text x="78" y="82" fontSize="13" fill="#c084fc" fontFamily="serif" opacity="0.5">
            &#9835;
            <animateTransform attributeName="transform" type="translate" values="0,0;-6,-10;0,0" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur="4.2s" repeatCount="indefinite" />
          </text>
        </g>
        <g filter="url(#g1)">
          <text x="232" y="118" fontSize="11" fill="#1db954" fontFamily="serif" opacity="0.4">
            &#9833;
            <animateTransform attributeName="transform" type="translate" values="0,0;3,-8;0,0" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.6s" repeatCount="indefinite" />
          </text>
        </g>

        {/* ===== FLOATING CODE PARTICLES ===== */}
        <text x="44" y="196" fontSize="9" fill="#1db954" fontFamily="monospace" opacity="0.35">
          {"{ }"}
          <animateTransform attributeName="transform" type="translate" values="0,0;-3,-20;0,0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0.08;0.35" dur="5s" repeatCount="indefinite" />
        </text>
        <text x="264" y="176" fontSize="8" fill="#00d4ff" fontFamily="monospace" opacity="0.3">
          {"</>"}
          <animateTransform attributeName="transform" type="translate" values="0,0;4,-18;0,0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.06;0.3" dur="4.5s" repeatCount="indefinite" />
        </text>
        <text x="60" y="148" fontSize="8" fill="#c084fc" fontFamily="monospace" opacity="0.25">
          {"=>"}
          <animateTransform attributeName="transform" type="translate" values="0,0;-4,-14;0,0" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3.8s" repeatCount="indefinite" />
        </text>
        <text x="256" y="224" fontSize="7" fill="#1db954" fontFamily="monospace" opacity="0.25">
          {"0x"}
          <animateTransform attributeName="transform" type="translate" values="0,0;3,-12;0,0" dur="6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0.04;0.25" dur="6s" repeatCount="indefinite" />
        </text>
        <text x="270" y="260" fontSize="7" fill="#c084fc" fontFamily="monospace" opacity="0.2">
          {"fn()"}
          <animateTransform attributeName="transform" type="translate" values="0,0;2,-10;0,0" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.04;0.2" dur="5.5s" repeatCount="indefinite" />
        </text>

        {/* ===== COFFEE MUG on desk ===== */}
        <g>
          <rect x="268" y="290" width="14" height="12" rx="2" fill="#1a1a2e" stroke="#ff6b35" strokeWidth="0.6" />
          <path d="M282 294 Q288 296 282 300" fill="none" stroke="#1a1a2e" strokeWidth="1.2" />
          {/* Steam */}
          <path d="M272 286 Q274 280 272 274" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M276 288 Q278 282 276 276" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.1">
            <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.5s" repeatCount="indefinite" />
          </path>
        </g>

        {/* ===== AMBIENT GLOW UNDER FIGURE ===== */}
        <ellipse cx="160" cy="316" rx="120" ry="12" fill="#1db954" opacity="0.12">
          <animate attributeName="opacity" values="0.12;0.2;0.12" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="160" cy="316" rx="60" ry="6" fill="#00d4ff" opacity="0.06">
          <animate attributeName="opacity" values="0.06;0.1;0.06" dur="2.5s" repeatCount="indefinite" />
        </ellipse>

        {/* Scanline overlay */}
        <rect x="0" y="0" width="320" height="380" fill="url(#scan)" opacity="0.25" />
      </svg>
    </div>
  );
}
