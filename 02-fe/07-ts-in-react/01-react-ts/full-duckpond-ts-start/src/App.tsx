import { BrowserRouter, Routes, Route } from 'react-router';
import { Home, MyPond, DuckPage, SignIn, NotFound } from './pages';
import { MainLayout, AuthLayout } from './layouts';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path='ducks/:duckId' element={<DuckPage />} />
					<Route path='signin' element={<SignIn />} />
					<Route path='mypond' element={<AuthLayout />}>
						<Route index element={<MyPond />} />
					</Route>
				</Route>
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
