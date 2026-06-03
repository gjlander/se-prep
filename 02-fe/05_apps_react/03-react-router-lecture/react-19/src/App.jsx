import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import AddToPond from './pages/AddToPond';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='add-to-pond' element={<AddToPond />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
