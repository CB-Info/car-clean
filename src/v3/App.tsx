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
import { BottomBar } from './components/sections/BottomBar'

// Les fonctionnalités de Motion (utilisées par le seul comparateur avant/après) sont chargées à part.
const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

export default function App() {
  // Gold par défaut, sans badge : l'odomètre affiche un vrai montant dès le premier regard.
  const [formula, setFormula] = useState<FormulaId>('gold')
  const [petHair, setPetHair] = useState(false)
  const [distance, setDistance] = useState<Distance>(null)
  const [touched, setTouched] = useState(false)
  // Seuls les réglages du tarif comptent pour la « mise du contact » : un choix dans le hero ne l'annule pas.
  const [tarifTouched, setTarifTouched] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  const state: QuoteState = { formula, petHair, distance, touched }
  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    set(v)
    setTouched(true)
    setTarifTouched(true)
  }

  // Depuis le rail de prix du hero : présélectionne puis descend au tarif (dans le tarif, choisir ne fait jamais défiler)
  const onPick = (id: FormulaId) => {
    setFormula(id)
    setTouched(true)
    scrollToId('tarif')
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <Navbar state={state} />
        <main>
          <Hero onPick={onPick} />
          <BenefitsMarquee />
          <Tarif state={state} tarifTouched={tarifTouched} setFormula={touch(setFormula)} setPetHair={touch(setPetHair)} setDistance={touch(setDistance)} />
          <BeforeAfter />
          <Process />
          <Faq onCompare={() => scrollToId('tarif')} />
          <FinalCta state={state} />
        </main>
        <BottomBar state={state} />
      </MotionConfig>
    </LazyMotion>
  )
}
