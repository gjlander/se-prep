import Greeting from './components/typing-props/Greeting';
import Button from './components/typing-props/Button';
import Status from './components/typing-props/Status';
import Container from './components/typing-props/Container';

import Posts from './components/typing-state/Posts';
import Counter from './components/typing-state/Counter';
import UserInfo from './components/typing-state/UserInfo';
import Profile from './components/typing-state/Profile';

import NameForm from './components/controlled-components/NameForm';
import FruitSelector from './components/controlled-components/FruitSelector';

import ClickLogger from './components/dom-events/ClickLogger';
import InputLogger from './components/dom-events/InputLogger';
import FormHandlerSubmit from './components/dom-events/FormHandlerSubmit';
import FormHandlerAction from './components/dom-events/FormHandlerAction';
import KeyLogger from './components/dom-events/KeyLogger';

const App = () => {
	return (
		<Container style={{ maxWidth: '600px', margin: '0 auto' }}>
			<h1>My React App</h1>
			<h2 className='text-2xl'>Typing Props</h2>
			<div className='border-b-2'></div>
			<Greeting name='Jorge' />
			{/* <Greeting name={42} /> */}
			{/* <Button /> */}
			<Button label='Click Me' colour='green' />
			<Button label='Submit' />
			<Status status='success' />
			<Status status='loading' />
			<Status status='error' />
			{/* <Status status='thinking' /> */}
			<h2 className='text-2xl'>Typing state</h2>
			<div className='border-b-2'></div>
			<Counter />
			<Profile />
			<UserInfo />
			<Posts />
			<h2 className='text-2xl'>Controlled components</h2>
			<div className='border-b-2'></div>
			<NameForm />
			<FruitSelector />
			<h2 className='text-2xl'>DOM Events with types</h2>
			<div className='border-b-2'></div>
			<ClickLogger />
			<InputLogger />
			<FormHandlerSubmit />
			<FormHandlerAction />
			<KeyLogger />
		</Container>
	);
};

export default App;
