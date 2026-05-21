import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';
import MainPage from './pages/MainPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SplashPage from './pages/SplashPage.jsx';
import GrowthPage from './pages/GrowthPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/growth" element={<GrowthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
