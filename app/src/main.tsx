import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { KnowledgeProvider } from './context/KnowledgeContext.tsx'
import { NotesProvider } from './context/NotesContext.tsx'
import { AppsProvider } from './context/AppsContext.tsx'
import { AnnotationsProvider } from './context/AnnotationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AnnotationsProvider>
        <KnowledgeProvider>
          <NotesProvider>
            <AppsProvider>
              <App />
            </AppsProvider>
          </NotesProvider>
        </KnowledgeProvider>
      </AnnotationsProvider>
    </UserProvider>
  </StrictMode>,
)
