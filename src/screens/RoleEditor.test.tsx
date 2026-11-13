import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { loadFormConfig } from '../data'
import { RoleEditor } from './RoleEditor'

const copy = {
  addCustomRole: 'Add a custom role',
  customRole: 'Custom role',
  itemNote: 'Optional note',
  remove: 'Remove',
}

function Harness({ initialValue = { selected: [], custom: [] } }: { initialValue?: unknown }) {
  const [value, setValue] = useState(initialValue)
  const question = loadFormConfig('?t=generic').questions.find((item) => item.id === 'roles')!
  return (
    <RoleEditor value={value} question={question} language="en" copy={copy} onChange={setValue} />
  )
}

describe('RoleEditor', () => {
  it('supports multiple presets and adding, editing, and removing custom roles', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getByLabelText('Customers'))
    await user.click(screen.getByLabelText('Team or staff'))
    await user.click(screen.getByRole('button', { name: /Add a custom role/ }))
    const customRole = screen.getByRole('textbox', { name: 'Custom role 1' })
    expect(customRole).toHaveFocus()
    await user.type(customRole, 'Courier')
    await user.type(screen.getByRole('textbox', { name: 'Optional note 1' }), 'Deliver orders')
    expect(customRole).toHaveValue('Courier')
    await user.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByRole('textbox', { name: 'Custom role 1' })).not.toBeInTheDocument()
  })

  it('shows existing freeform roles as custom entries', () => {
    render(<Harness initialValue={[{ name: 'Dispatcher', note: 'Assign jobs' }]} />)
    expect(screen.getByRole('textbox', { name: 'Custom role 1' })).toHaveValue('Dispatcher')
    expect(screen.getByRole('textbox', { name: 'Optional note 1' })).toHaveValue('Assign jobs')
  })
})
