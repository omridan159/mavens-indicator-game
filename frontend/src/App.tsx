import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import GamePage from './Pages/GamePage/GamePage';
import StartPage from './Pages/StartPage/StartPage';
import { queryClient } from './utils/query-client';

function App(): JSX.Element {
   return (
      <QueryClientProvider client={queryClient}>
         <Router>
            <Routes>
               <Route path="/" element={<StartPage />} />
               <Route path="/game/:username" element={<GamePage />} />
            </Routes>
         </Router>
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}

export default App;
