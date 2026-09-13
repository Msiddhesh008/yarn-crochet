import { useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react'
import gsap from 'gsap'

export function useGsapContext(
  scope: RefObject<HTMLElement | null>,
  animation: (ctx: gsap.Context) => void,
  deps: DependencyList = [],
) {
  const callbackRef = useRef(animation)
  callbackRef.current = animation

  useLayoutEffect(() => {
    if (!scope.current) return
    const ctx = gsap.context(() => {
      callbackRef.current(ctx)
    }, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
