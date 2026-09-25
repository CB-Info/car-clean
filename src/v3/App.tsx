import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'
import { initSmoothScroll, scrollToId } from './lib/smooth-scroll'
import type { FormulaId } from './data/content'
import { Navbar } from './components/sections/Navbar'
import { Hero } from './components/sections/Hero'
import { BenefitsMarquee } from './components/sections/BenefitsMarquee'
import { BeforeAfter } from './components/sections/BeforeAfter'
import { Formulas } from './components/sections/Formulas'
import { Simulator } from './components/sections/Simulator'
import { Process } from './components/sections/Process'
import { Commitments } from './components/sections/Commitments'
import { Faq } from './components/sections/Faq'
import { FinalCta } from './components/sections/FinalCta'
import { FloatingCall } from './components/sections/FloatingCall'

// Les fonctionnalités de Motion sont chargées à part pour alléger le bundle initial.
const loadFeatures = () => import('./lib/motion-features').then((r) => r.default)

export default function App() {
  const [formula, setFormula] = useState<FormulaId>('gold')
  const [petHair, setPetHair] = useState(false)
  const [km, setKm] = useState(8)

  useEffect(() => {
    return initSmoothScroll()
  }, [])

  const choose = (id: FormulaId) => {
    setFormula(id)
    scrollToId('simulateur')
  }

  return (
    <LazyMotion features={loadFeatures} strict>
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        <BenefitsMarquee />
        <BeforeAfter />
        <Formulas onChoose={choose} />
        <Simulator formula={formula} setFormula={setFormula} petHair={petHair} setPetHair={setPetHair} km={km} setKm={setKm} />
        <Process />
        <Commitments />
        <Faq />
        <FinalCta />
      </main>
      <FloatingCall />
    </MotionConfig>
    </LazyMotion>
  )
}
