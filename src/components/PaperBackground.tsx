import type { CSSProperties } from 'react'

// The loop of the logo's pen stroke, shared with the header mark so both stay in sync.
export const PEN_STROKE =
  'M22 128 C 30 40, 118 14, 112 92 C 108 150, 36 176, 62 128 C 84 88, 150 44, 160 98 C 168 142, 118 160, 140 126 C 156 100, 186 120, 206 122'

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const dotsMask = 'radial-gradient(ellipse at 50% 45%, transparent 30%, #000 75%)'

const scribbles = [
  { className: '-left-10 top-[12%] w-[30rem] -rotate-6', delay: 0.3, float: 18 },
  // Mirrored so the recognizable loop sits on the outer edge, not behind the card.
  { className: '-right-10 top-[46%] w-[30rem] -scale-x-100 rotate-3', delay: 0.9, float: 24 },
  { className: '-bottom-8 left-[6%] w-[26rem] rotate-2', delay: 1.5, float: 21 },
]

function Scribble({ className, delay, float }: (typeof scribbles)[number]) {
  // The float runs on a div: Chrome keeps translate animations on an <svg> root off the compositor.
  return (
    <div
      className={`absolute hidden animate-float text-ink motion-reduce:animate-none sm:block ${className}`}
      style={{ animationDuration: `${float}s` }}
    >
      <svg viewBox="0 0 420 200" className="block w-full">
        <rect
          x="214"
          y="92"
          width="190"
          height="60"
          rx="10"
          className="animate-swipe motion-reduce:animate-none"
          style={
            {
              fill: 'var(--color-highlighter)',
              fillOpacity: 'var(--texture-highlight)',
              transformBox: 'fill-box',
              transformOrigin: 'left center',
              animationDelay: `${delay + 1.8}s`,
            } as CSSProperties
          }
        />
        <path
          d={`${PEN_STROKE} L 392 120`}
          pathLength={1}
          strokeDasharray="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw motion-reduce:animate-none"
          style={{ strokeOpacity: 'var(--texture-ink)', animationDelay: `${delay}s` }}
        />
      </svg>
    </div>
  )
}

export function PaperBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden"
    >
      <div className="absolute inset-0" style={{ maskImage: dotsMask, WebkitMaskImage: dotsMask }}>
        <div
          className="absolute -inset-6 animate-drift motion-reduce:animate-none"
          style={{
            backgroundImage:
              'radial-gradient(color-mix(in srgb, var(--color-ink) 22%, transparent) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>
      <div
        className="absolute inset-0 bg-ink"
        style={{
          opacity: 'var(--texture-grain)',
          maskImage: grain,
          WebkitMaskImage: grain,
          maskSize: '160px',
          WebkitMaskSize: '160px',
        }}
      />
      {scribbles.map((scribble) => (
        <Scribble key={scribble.className} {...scribble} />
      ))}
    </div>
  )
}
