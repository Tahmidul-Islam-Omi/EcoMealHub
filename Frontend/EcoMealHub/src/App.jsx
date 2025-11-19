import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/" element={<ResourcesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

