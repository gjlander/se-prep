import NoContextGranChild from './NoContextGranChild';
const NoContextChild = ({ user }) => {
  return (
    <div className='child'>
      <code>Prop Drilling Child</code>
      <NoContextGranChild user={user} />
    </div>
  );
};
export default NoContextChild;
