import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { KnowledgeProvider } from './context/KnowledgeContext.tsx'
import { AppsProvider } from './context/AppsContext.tsx'
import { AnnotationsProvider } from './context/AnnotationContext.tsx'
import { MultiSelectProvider } from './context/MultiSelectContext.tsx'
import { WatchProvider } from './context/WatchContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AnnotationsProvider>
        <KnowledgeProvider>
          <MultiSelectProvider>
            <AppsProvider>
              <WatchProvider>
                <App />
              </WatchProvider>
            </AppsProvider>
          </MultiSelectProvider>
        </KnowledgeProvider>
      </AnnotationsProvider>
    </UserProvider>
  </StrictMode>,
)
