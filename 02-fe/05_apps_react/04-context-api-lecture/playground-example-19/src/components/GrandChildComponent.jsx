import { use } from 'react';
import { UserContext } from '../App';
const GrandChildComponent = () => {
  const user = use(UserContext);
  return (
    <div className='grandchild'>
      <code>GrandChildComponent</code>
      <br />
      {user.name}
    </div>
  );
};

export default GrandChildComponent;
