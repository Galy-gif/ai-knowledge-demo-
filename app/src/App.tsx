import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PhoneFrame from './components/layout/PhoneFrame'
import MultiSelectActionBar from './components/common/MultiSelectActionBar'

// Global
import SplashScreen from './pages/global/SplashScreen'
import ComingSoon from './pages/global/ComingSoon'

// Knowledge
import K01_KnowledgeHome from './pages/knowledge/K01_KnowledgeHome'
import K05_KnowledgeDetail from './pages/knowledge/K05_KnowledgeDetail'
import K06_UploadSource from './pages/knowledge/K06_UploadSource'
import K07_Uploading from './pages/knowledge/K07_Uploading'
import K08_FileDetail from './pages/knowledge/K08_FileDetail'
import K09_FolderDetail from './pages/knowledge/K09_FolderDetail'
import K11_TeamDetail from './pages/knowledge/K11_TeamDetail'
import K12_CategoryRecommend from './pages/knowledge/K12_CategoryRecommend'
import K13_RecentAll from './pages/knowledge/K13_RecentAll'
import K14_AddFromSource from './pages/knowledge/K14_AddFromSource'
import K15_AddFromUpload from './pages/knowledge/K15_AddFromUpload'
import K16_AddFromThirdParty from './pages/knowledge/K16_AddFromThirdParty'
import K17_AddFromAiChat from './pages/knowledge/K17_AddFromAiChat'
import K18_AddFromScan from './pages/knowledge/K18_AddFromScan'
import W01_WatchManage from './pages/watch/W01_WatchManage'
import W02_TodayItems from './pages/watch/W02_TodayItems'
import W03_WatchTaskDetail from './pages/watch/W03_WatchTaskDetail'

// Ask
import Q01_AskHome from './pages/ask/Q01_AskHome'
import Q03_SelectKnowledge from './pages/ask/Q03_SelectKnowledge'
import Q04_AiAnswer from './pages/ask/Q04_AiAnswer'
import Q05_AiAnswerMulti from './pages/ask/Q05_AiAnswerMulti'
import Q06_WebSearchResults from './pages/ask/Q06_WebSearchResults'
import Q07_WebArticle from './pages/ask/Q07_WebArticle'
import D01_DiscoverHome from './pages/discover/D01_DiscoverHome'

// Task
import T00_AppsHome from './pages/task/T00_AppsHome'
import T01_TaskMode from './pages/task/T01_TaskMode'
import T02_TaskResult from './pages/task/T02_TaskResult'
import T03_GenerateConfirm from './pages/task/T03_GenerateConfirm'
import T04_Generating from './pages/task/T04_Generating'
import T05_DataSourceConfirm from './pages/task/T05_DataSourceConfirm'
import T06_AddedToDesktop from './pages/task/T06_AddedToDesktop'
import T07_AppRuntime from './pages/task/T07_AppRuntime'
import T08_MyApps from './pages/task/T08_MyApps'
import T09_TemplateLibrary from './pages/task/T09_TemplateLibrary'
import T10_TemplatePreview from './pages/task/T10_TemplatePreview'

// Profile
import M01_ProfileHome from './pages/profile/M01_ProfileHome'
import M02_ProfileEdit from './pages/profile/M02_ProfileEdit'

export default function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          {/* Splash */}
          <Route path="/splash" element={<SplashScreen />} />

          {/* Knowledge */}
          <Route path="/knowledge" element={<K01_KnowledgeHome />} />
          <Route path="/knowledge/detail" element={<K05_KnowledgeDetail />} />
          <Route path="/knowledge/upload" element={<K06_UploadSource />} />
          <Route path="/knowledge/uploading" element={<K07_Uploading />} />
          <Route path="/knowledge/file-detail" element={<K08_FileDetail />} />
          <Route path="/knowledge/folder" element={<K09_FolderDetail />} />
          <Route path="/knowledge/square" element={<Navigate to="/knowledge" replace />} />
          <Route path="/knowledge/team/:id" element={<K11_TeamDetail />} />
          <Route path="/knowledge/kb/:id" element={<K11_TeamDetail />} />
          <Route path="/knowledge/recommend/:categoryId" element={<K12_CategoryRecommend />} />
          <Route path="/knowledge/recent" element={<K13_RecentAll />} />
          <Route path="/knowledge/watch" element={<W01_WatchManage />} />
          <Route path="/watch/today" element={<W02_TodayItems />} />
          <Route path="/watch/task/:taskId" element={<W03_WatchTaskDetail />} />
          <Route path="/knowledge/add-from/upload" element={<K15_AddFromUpload />} />
          <Route path="/knowledge/add-from/third-party" element={<K16_AddFromThirdParty />} />
          <Route path="/knowledge/add-from/ai-chat" element={<K17_AddFromAiChat />} />
          <Route path="/knowledge/add-from/scan" element={<K18_AddFromScan />} />
          <Route path="/knowledge/add-from/:source" element={<K14_AddFromSource />} />

          {/* Ask / Q */}
          <Route path="/ask" element={<Q01_AskHome />} />
          <Route path="/ask/select-kb" element={<Q03_SelectKnowledge />} />
          <Route path="/ask/answer" element={<Q04_AiAnswer />} />
          <Route path="/ask/answer-multi" element={<Q05_AiAnswerMulti />} />
          <Route path="/ask/web-search" element={<Q06_WebSearchResults />} />
          <Route path="/ask/web-article" element={<Q07_WebArticle />} />

          {/* Discover */}
          <Route path="/discover" element={<D01_DiscoverHome />} />

          {/* Task / PWA */}
          <Route path="/apps" element={<T00_AppsHome />} />
          <Route path="/ask/task-mode" element={<T01_TaskMode />} />
          <Route path="/ask/task-result" element={<T02_TaskResult />} />
          <Route path="/ask/task-generate-confirm" element={<T03_GenerateConfirm />} />
          <Route path="/pwa/confirm" element={<T03_GenerateConfirm />} />
          <Route path="/ask/task-generating" element={<T04_Generating />} />
          <Route path="/ask/task-datasource" element={<T05_DataSourceConfirm />} />
          <Route path="/ask/task-added-desktop" element={<T06_AddedToDesktop />} />
          <Route path="/ask/task-app" element={<Navigate to="/pwa/run/app_words" replace />} />
          <Route path="/pwa/run/:id" element={<T07_AppRuntime />} />
          <Route path="/pwa/templates" element={<T09_TemplateLibrary />} />
          <Route path="/pwa/template/:id" element={<T10_TemplatePreview />} />
          <Route path="/profile/my-apps" element={<T08_MyApps />} />

          {/* Profile */}
          <Route path="/profile" element={<M01_ProfileHome />} />
          <Route path="/profile/edit" element={<M02_ProfileEdit />} />

          {/* Utility */}
          <Route path="/coming-soon" element={<ComingSoon />} />

          {/* Default */}
          <Route path="/" element={<Navigate to="/apps" replace />} />
          <Route path="*" element={<Navigate to="/apps" replace />} />
        </Routes>
        <MultiSelectActionBar />
      </PhoneFrame>
    </BrowserRouter>
  )
}
