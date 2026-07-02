import { WebGLPreview } from './renderer/WebGLPreview'
import { ControlsPanel } from './ui/ControlsPanel'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="preview">
        <WebGLPreview />
      </div>
      <ControlsPanel />
    </div>
  )
}

export default App
