import { describe, it, expect, vi } from 'vitest'
import { cn, copyToClipboard } from '../../../lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500') // tailwind merge
  })
})

describe('copyToClipboard', () => {
  it('should call navigator.clipboard.writeText', () => {
    const mockWriteText = vi.fn()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true
    })

    copyToClipboard('test text')
    expect(mockWriteText).toHaveBeenCalledWith('test text')
  })
})