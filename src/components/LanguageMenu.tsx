import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Lang } from '../data/types'

type Option = { value: Lang; label: string }

type Props = {
  value: Lang
  options: Option[]
  label: string
  onChange: (value: Lang) => void
}

export function LanguageMenu({ value, options, label, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const current = options[selectedIndex]

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    function closeOnOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutside)
    return () => document.removeEventListener('pointerdown', closeOnOutside)
  }, [open])

  function openMenu(index = selectedIndex) {
    setActive(index)
    setOpen(true)
  }

  function close(returnFocus: boolean) {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  function choose(index: number) {
    onChange(options[index].value)
    close(true)
  }

  function onButtonKeyDown(event: KeyboardEvent) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openMenu()
    }
  }

  function onListKeyDown(event: KeyboardEvent) {
    const last = options.length - 1
    const moves: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    if (event.key in moves) {
      event.preventDefault()
      setActive(moves[event.key])
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(active)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    } else if (event.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="language-listbox"
        aria-label={`${label}: ${current.label}`}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm text-ink transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {current.label}
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-muted transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.2 7.5a.75.75 0 0 1 1.06.04L10 11.6l3.74-4.06a.75.75 0 1 1 1.1 1.02l-4.3 4.66a.75.75 0 0 1-1.1 0l-4.3-4.66a.75.75 0 0 1 .06-1.06Z" />
        </svg>
      </button>
      <ul
        ref={listRef}
        id="language-listbox"
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open ? `language-option-${options[active].value}` : undefined}
        onKeyDown={onListKeyDown}
        className={`absolute end-0 top-full z-20 mt-2 min-w-40 origin-top-right rounded-xl border border-line bg-paper p-1 shadow-lg shadow-ink/10 outline-none duration-200 ease-out motion-reduce:transition-none rtl:origin-top-left ${open ? 'visible scale-100 opacity-100 transition-[opacity,scale,translate]' : 'invisible -translate-y-1 scale-95 opacity-0 transition-[opacity,scale,translate,visibility]'}`}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`language-option-${option.value}`}
            role="option"
            aria-selected={option.value === value}
            lang={option.value}
            onPointerEnter={() => setActive(index)}
            onClick={() => choose(index)}
            className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm text-ink transition-colors ${index === active ? 'bg-ink/5' : ''}`}
          >
            {option.label}
            {option.value === value && (
              <span
                className="h-2 w-2 rounded-full bg-highlighter ring-1 ring-ink/20"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
