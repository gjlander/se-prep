import ChildComponent from './ChildComponent';
const ParentComponent = () => {
  return (
    <div className='parent'>
      <code>ParentComponent</code>
      <ChildComponent />
    </div>
  );
};

export default ParentComponent;
