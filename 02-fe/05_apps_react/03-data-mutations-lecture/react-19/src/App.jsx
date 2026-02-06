import { BrowserRouter, Routes, Route } from 'react-router';
import { Home, MyPond, DuckPage } from './pages';
import { MainLayout } from './layouts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path='mypond' element={<MyPond />} />
          <Route path='ducks/:duckId' element={<DuckPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
