import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FeatureEditor } from './FeatureEditor'

const copy = {
  featureTitle: 'Feature name',
  featureDescription: 'Describe it in one line',
  moveUp: 'Move up',
  moveDown: 'Move down',
  remove: 'Remove',
  priority: 'Priority',
  notPrioritized: 'Not prioritized yet',
  mustHave: 'Must-have',
  niceToHave: 'Nice-to-have',
  later: 'Later',
  addItem: 'Add another',
}

describe('FeatureEditor', () => {
  it('adds, edits, prioritizes, reorders, and removes features without defaulting priority', async () => {
    const user = userEvent.setup()
    const initial = [
      { id: 'one', title: 'Login', description: 'Sign in' },
      { id: 'two', title: 'Payments', description: 'Accept cards' },
    ]
    function Harness() {
      const [features, setFeatures] = useState(initial)
      return <FeatureEditor value={features} language="en" copy={copy} onChange={setFeatures} />
    }
    render(<Harness />)

    expect(screen.getByLabelText('Priority 1')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    expect(screen.getAllByLabelText(/Feature name /)).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Move up 2' }))
    expect(screen.getByLabelText('Feature name 1')).toHaveValue('Payments')

    await user.selectOptions(screen.getByLabelText('Priority 1'), 'must-have')
    expect(screen.getByLabelText('Priority 1')).toHaveValue('must-have')

    await user.click(screen.getByRole('button', { name: 'Remove 1' }))
    expect(screen.getAllByLabelText(/Feature name /)).toHaveLength(2)
  })
})
