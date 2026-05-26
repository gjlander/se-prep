import GrandChildComponent from './GrandChildComponent';
const ChildComponent = () => {
  return (
    <div className='child'>
      <code>ChildComponent</code>
      <GrandChildComponent />
    </div>
  );
};

export default ChildComponent;
