import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

const HIDDEN_CLIP_PATH = 'inset(50% round 12px)'
const VISIBLE_CLIP_PATH = 'inset(0% round 12px)'

/**
 * Reusable "cursor-follow reveal" interaction: a floating panel tracks the
 * pointer (lerp-smoothed) inside a relatively-positioned container, and
 * clip-path reveals/hides itself as the pointer enters/leaves a hoverable
 * item. Extracted from the interactive-list-preview pattern so it can be
 * reused across differently-shaped layouts (list rows, grid cards, ...).
 */
export function useCursorPreview({ lerp = 0.18, duration = 0.45, offset = 20 } = {}) {
  const containerRef = useRef(null)
  const previewRefs = useRef({})
  const activeIdRef = useRef(null)
  const pointerTargetRef = useRef({ x: 0, y: 0 })
  const pointerCurrentRef = useRef({ x: 0, y: 0 })
  const reduceMotionRef = useRef(
    typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false)
  )

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return undefined
    const onChange = (event) => {
      reduceMotionRef.current = event.matches
    }
    reduceMotionRef.current = mq.matches
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    let frameId
    const tick = () => {
      const activeId = activeIdRef.current
      const activeEl = activeId != null ? previewRefs.current[activeId] : null

      if (activeEl && !reduceMotionRef.current) {
        const current = pointerCurrentRef.current
        const target = pointerTargetRef.current
        current.x += (target.x - current.x) * lerp
        current.y += (target.y - current.y) * lerp
        gsap.set(activeEl, { x: current.x, y: current.y })
      }

      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [lerp])

  const setPreviewRef = useCallback(
    (id) => (el) => {
      if (el) previewRefs.current[id] = el
      else delete previewRefs.current[id]
    },
    []
  )

  const onPointerMove = useCallback(
    (event) => {
      const bounds = containerRef.current?.getBoundingClientRect()
      if (!bounds) return
      pointerTargetRef.current = {
        x: event.clientX - bounds.left + offset,
        y: event.clientY - bounds.top + offset,
      }
    },
    [offset]
  )

  const showPreview = useCallback(
    (id) => {
      const el = previewRefs.current[id]
      if (!el) return

      activeIdRef.current = id
      pointerCurrentRef.current = { ...pointerTargetRef.current }

      gsap.killTweensOf(el)
      gsap.set(el, {
        visibility: 'visible',
        x: pointerCurrentRef.current.x,
        y: pointerCurrentRef.current.y,
        clipPath: reduceMotionRef.current ? VISIBLE_CLIP_PATH : HIDDEN_CLIP_PATH,
        opacity: reduceMotionRef.current ? 0 : 1,
      })
      gsap.to(el, {
        clipPath: VISIBLE_CLIP_PATH,
        opacity: 1,
        duration: reduceMotionRef.current ? Math.min(duration, 0.3) : duration,
        ease: 'power2.out',
      })
    },
    [duration]
  )

  const hidePreview = useCallback(
    (id) => {
      const el = previewRefs.current[id]
      if (!el) return

      if (activeIdRef.current === id) activeIdRef.current = null

      gsap.killTweensOf(el)
      gsap.to(el, {
        clipPath: HIDDEN_CLIP_PATH,
        opacity: 0,
        duration: reduceMotionRef.current ? Math.min(duration, 0.3) : duration,
        ease: 'power3.inOut',
        onComplete: () => gsap.set(el, { visibility: 'hidden' }),
      })
    },
    [duration]
  )

  return { containerRef, setPreviewRef, onPointerMove, showPreview, hidePreview }
}
