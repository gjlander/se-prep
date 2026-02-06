const NoContextGranChild = ({ user }) => {
  return (
    <div className='grandchild'>
      <code>Prop Drilling Grandchild</code>
      <br />
      {user.name}
    </div>
  );
};

export default NoContextGranChild;
