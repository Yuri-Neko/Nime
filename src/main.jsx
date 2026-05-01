import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../style.css' 
import { AuthProvider } from './context/AuthContext'
import { BookmarkProvider } from './context/BookmarkContext'
import { WatchHistoryProvider } from './context/WatchHistoryContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BookmarkProvider>
        <WatchHistoryProvider>
          <App />
        </WatchHistoryProvider>
      </BookmarkProvider>
    </AuthProvider>
  </React.StrictMode>
)
