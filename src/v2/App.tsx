import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { initSmoothScroll, scrollToId } from './lib/smooth-scroll'
import type { FormulaId } from './data/content'
import type { Distance } from './lib/pricing'
import type { QuoteState } from './lib/message'
import { Navbar } from './components/sections/Navbar'
import { Hero } from './components/sections/Hero'
import { BenefitsMarquee } from './components/sections/BenefitsMarquee'
import { Tarif } from './components/sections/Tarif'
import { BeforeAfter } from './components/sections/BeforeAfter'
import { Process } from './components/sections/Process'
import { Faq } from './components/sections/Faq'
import { FinalCta } from './components/sections/FinalCta'
import { MobileDock } from './components/sections/MobileDock'

// Les fonctionnalités de Motion sont chargées à part pour alléger le bundle initial (seul le comparateur s'en sert).
const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

export default function App() {
  const [formula, setFormula] = useState<FormulaId>('gold')
  const [petHair, setPetHair] = useState(false)
  const [distance, setDistance] = useState<Distance>(null)
  // Le visiteur a-t-il configuré quelque chose ? Sinon, les liens envoient le message par défaut.
  const [touched, setTouched] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  const state: QuoteState = { formula, petHair, distance }
  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setTouched(true)
  }
  // Choix depuis le hero : on descend au tarif et le focus va sur la formule choisie (pas sur la section).
  const pick = (id: FormulaId) => {
    setFormula(id)
    setTouched(true)
    scrollToId('tarif', document.getElementById(`formula-${id}`))
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <Navbar state={state} touched={touched} />
        <main className="max-lg:pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
          <Hero onPick={pick} />
          <BenefitsMarquee />
          <Tarif
            formula={formula}
            setFormula={touch(setFormula)}
            petHair={petHair}
            setPetHair={touch(setPetHair)}
            distance={distance}
            setDistance={touch(setDistance)}
          />
          <BeforeAfter />
          <Process />
          <Faq />
          <FinalCta state={state} touched={touched} />
        </main>
        <MobileDock state={state} touched={touched} />
      </MotionConfig>
    </LazyMotion>
  )
}
