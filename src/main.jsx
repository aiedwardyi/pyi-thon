import ReactDOM from 'react-dom/client'
import { StrictMode, createElement } from 'react'
import PyithonApp from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  createElement(StrictMode, null, createElement(PyithonApp)),
)
