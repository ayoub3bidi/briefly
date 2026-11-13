export type CustomRole = { id: string; name: string; note: string }
export type RoleAnswer = { selected: string[]; custom: CustomRole[] }

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function readRoleAnswer(value: unknown): RoleAnswer {
  if (Array.isArray(value)) {
    return {
      selected: [],
      custom: value.flatMap((entry, index) => {
        if (!entry || typeof entry !== 'object') return []
        const role = entry as { id?: unknown; name?: unknown; note?: unknown }
        if (typeof role.name !== 'string' || !role.name.trim()) return []
        return [
          {
            id: typeof role.id === 'string' ? role.id : `legacy-${index}`,
            name: role.name,
            note: typeof role.note === 'string' ? role.note : '',
          },
        ]
      }),
    }
  }

  if (!value || typeof value !== 'object') return { selected: [], custom: [] }
  const answer = value as { selected?: unknown; custom?: unknown }
  return {
    selected: Array.isArray(answer.selected)
      ? answer.selected.filter((id): id is string => typeof id === 'string')
      : [],
    custom: Array.isArray(answer.custom)
      ? answer.custom.flatMap((entry, index) => {
          if (!entry || typeof entry !== 'object') return []
          const role = entry as { id?: unknown; name?: unknown; note?: unknown }
          return [
            {
              id: typeof role.id === 'string' ? role.id : `custom-${index}`,
              name: typeof role.name === 'string' ? role.name : '',
              note: typeof role.note === 'string' ? role.note : '',
            },
          ]
        })
      : [],
  }
}

export function createCustomRole(): CustomRole {
  return { id: newId(), name: '', note: '' }
}

export function roleAnswerLines(
  value: unknown,
  options: Array<{ id: string; label: Record<string, string> }>,
  language: string,
) {
  const answer = readRoleAnswer(value)
  return [
    ...answer.selected.map(
      (id) => options.find((option) => option.id === id)?.label[language] ?? id,
    ),
    ...answer.custom
      .filter((role) => role.name.trim() || role.note.trim())
      .map((role) => [role.name, role.note].filter(Boolean).join(' — ')),
  ]
}
