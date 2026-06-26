import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AppShell from './components/layout/AppShell'
import TabBar from './components/layout/TabBar'
import Toaster from './components/ui/Toaster'
import { useStore } from './store/useStore'
import { useAuth } from './lib/auth'
import { isSupabaseConfigured } from './lib/supabase'

import Welcome from './screens/Welcome'
// code-split: three.js only loads when the immersive intro is opened
const WelcomeImmersive = lazy(() => import('./screens/WelcomeImmersive'))
import Code from './screens/Code'
import Onboarding from './screens/Onboarding'
import Join from './screens/Join'
import Home from './screens/Home'
import Circle from './screens/Circle'
import MemberDetail from './screens/MemberDetail'
import Events from './screens/Events'
import EventDetail from './screens/EventDetail'
import Grow from './screens/Grow'
import Profile from './screens/Profile'
import Assessment from './screens/Assessment'
import AssessmentResult from './screens/AssessmentResult'
import FounderDashboard from './screens/FounderDashboard'
import Marketplace from './screens/Marketplace'
import Goals from './screens/Goals'
import Mentorship from './screens/Mentorship'
import Recognition from './screens/Recognition'
import Groups from './screens/Groups'
import GroupDetail from './screens/GroupDetail'
import Spaces from './screens/Spaces'
import SpaceDetail from './screens/SpaceDetail'

const TAB_ROUTES = ['/home', '/circle', '/events', '/grow', '/profile']

export default function App() {
  const location = useLocation()
  const storeSignedIn = useStore((s) => s.signedIn)
  const authReady = useAuth((s) => s.ready)
  const session = useAuth((s) => s.session)

  // start the auth listener once
  useEffect(() => useAuth.getState().init(), [])

  // when a real session appears, load that member's data
  useEffect(() => {
    if (isSupabaseConfigured && session) useStore.getState().hydrate(session.user)
  }, [session])

  const signedIn = isSupabaseConfigured ? !!session : storeSignedIn
  const showTabBar = TAB_ROUTES.includes(location.pathname)
  const gate = (el) => (signedIn ? el : <Navigate to="/welcome" replace />)

  // avoid a redirect flash before the session is known (live mode only)
  if (isSupabaseConfigured && !authReady) {
    return (
      <AppShell>
        <div className="screen flex items-center justify-center">
          <span className="text-sm text-ink-400">Loading…</span>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to={signedIn ? '/home' : '/welcome'} replace />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route
              path="/welcome/immersive"
              element={
                <Suspense fallback={<div className="screen flex items-center justify-center bg-navy text-gold-300">Loading…</div>}>
                  <WelcomeImmersive />
                </Suspense>
              }
            />
            <Route path="/code" element={<Code />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/join" element={<Join />} />

            <Route path="/home" element={gate(<Home />)} />
            <Route path="/circle" element={gate(<Circle />)} />
            <Route path="/member/:id" element={gate(<MemberDetail />)} />
            <Route path="/events" element={gate(<Events />)} />
            <Route path="/event/:id" element={gate(<EventDetail />)} />
            <Route path="/grow" element={gate(<Grow />)} />
            <Route path="/profile" element={gate(<Profile />)} />
            <Route path="/assessment" element={gate(<Assessment />)} />
            <Route path="/assessment/result" element={gate(<AssessmentResult />)} />
            <Route path="/founder" element={gate(<FounderDashboard />)} />
            <Route path="/marketplace" element={gate(<Marketplace />)} />
            <Route path="/goals" element={gate(<Goals />)} />
            <Route path="/mentorship" element={gate(<Mentorship />)} />
            <Route path="/recognition" element={gate(<Recognition />)} />
            <Route path="/groups" element={gate(<Groups />)} />
            <Route path="/group/:id" element={gate(<GroupDetail />)} />
            <Route path="/spaces" element={gate(<Spaces />)} />
            <Route path="/space/:id" element={gate(<SpaceDetail />)} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      {showTabBar && <TabBar />}
      <Toaster />
    </AppShell>
  )
}
