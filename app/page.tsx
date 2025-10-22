import BuggyApp from './components/BuggyApp'

export const metadata = {
  title: 'State Sync Bug Challenge | React State Management Test',
  description: 'Test your React and Zustand state management skills by finding and fixing 3 interconnected bugs in view synchronization.',
  keywords: [
    'react state management',
    'zustand bugs',
    'useEffect debugging',
    'state synchronization',
    'react hooks',
    'closure bugs',
    'debounced state',
    'react challenge',
    'frontend debugging',
    'state sync bugs'
  ],
  openGraph: {
    title: 'State Sync Bug Challenge | React State Management Test',
    description: 'Find and fix 3 challenging bugs in React state synchronization. Test your understanding of useEffect, closures, and Zustand.',
    type: 'website',
  }
}

export default function Page() {
  return <BuggyApp />
}
