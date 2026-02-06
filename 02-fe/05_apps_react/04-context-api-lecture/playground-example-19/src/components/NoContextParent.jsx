import NoContextChild from './NoContextChild';
const NoContextParent = ({ user }) => {
  return (
    <div className='parent'>
      <code>Prop Drilling Parent</code>
      <NoContextChild user={user} />
    </div>
  );
};

export default NoContextParent;
