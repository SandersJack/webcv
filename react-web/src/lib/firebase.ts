import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAiO3eMlDMKlSpad5HjErwPahAhOK9lDl0',
  authDomain: 'webcv-16ca4.firebaseapp.com',
  projectId: 'webcv-16ca4',
  storageBucket: 'webcv-16ca4.firebasestorage.app',
  messagingSenderId: '747084913891',
  appId: '1:747084913891:web:e55dc9f17d7802334b79d6',
  measurementId: 'G-SSTWYPCK0G',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export function trackPageView(pathname: string, title: string) {
  logEvent(analytics, 'page_view', {
    page_path: pathname,
    page_title: title,
  })
}

export { analytics }
