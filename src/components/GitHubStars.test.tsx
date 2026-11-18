import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GitHubStars, REPO_URL } from './GitHubStars'

describe('GitHubStars', () => {
  it('links to the repository in a new tab', () => {
    render(<GitHubStars label="Star on GitHub" lang="en" />)
    const link = screen.getByRole('link', { name: 'Star on GitHub' })
    expect(link).toHaveAttribute('href', REPO_URL)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows the compact star count once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ stargazers_count: 1234 })),
    )
    render(<GitHubStars label="Star on GitHub" lang="en" />)
    expect(await screen.findByText('1.2K')).toBeInTheDocument()
  })

  it('shows only the icon when the request fails', async () => {
    const fetch = vi.fn(async () => new Response(null, { status: 404 }))
    vi.stubGlobal('fetch', fetch)
    render(<GitHubStars label="Star on GitHub" lang="en" />)
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    const link = screen.getByRole('link', { name: 'Star on GitHub' })
    expect(link).toHaveTextContent('')
  })
})
