import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../../hooks/useMobile'

describe('useIsMobile', () => {
  let originalInnerWidth: number
  let mockMatchMedia: any

  beforeEach(() => {
    originalInnerWidth = window.innerWidth
    mockMatchMedia = vi.fn()
    window.matchMedia = mockMatchMedia
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    vi.restoreAllMocks()
  })

  it('should return false for desktop width', () => {
    window.innerWidth = 1024
    mockMatchMedia.mockReturnValue({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it('should return true for mobile width', () => {
    window.innerWidth = 500
    mockMatchMedia.mockReturnValue({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it('should update when window resizes', () => {
    window.innerWidth = 1024
    const mockAddEventListener = vi.fn()
    const mockRemoveEventListener = vi.fn()

    mockMatchMedia.mockReturnValue({
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Simulate resize to mobile
    window.innerWidth = 500
    const changeCallback = mockAddEventListener.mock.calls[0][1]
    act(() => {
      changeCallback()
    })

    expect(result.current).toBe(true)
  })
})