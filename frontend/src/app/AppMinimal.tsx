import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Hello World - App is working!</div>} />
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  )
}

export default App