export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      return
    }

    document.documentElement.dataset.motion = 'enhanced'

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-motion-reveal]'),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const element = entry.target as HTMLElement
          element.classList.add('is-motion-visible')
          observer.unobserve(element)
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    elements.forEach((element) => {
      const order = Number(element.dataset.motionOrder ?? 0)
      element.style.setProperty('--motion-delay', `${Math.min(order, 6) * 0.08}s`)
      element.dataset.motionState = 'waiting'
      observer.observe(element)
    })
  })
})
