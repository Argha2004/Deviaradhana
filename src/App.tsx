import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { AudioEngine } from './components/AudioEngine';
import { HomePage } from './pages/HomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Global audio engine - never unmounts */}
        <AudioEngine />

        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>

        {/* Vercel Web Analytics */}
        <Analytics />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
