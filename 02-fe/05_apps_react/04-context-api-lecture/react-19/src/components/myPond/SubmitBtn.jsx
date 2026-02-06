import { useFormStatus } from 'react-dom';
const SubmitBtn = () => {
  const { pending } = useFormStatus();
  return (
    <button type='submit' disabled={pending} className='btn btn-success'>
      {pending ? (
        <>
          Adding duck... <span className='loading loading-spinner'></span>
        </>
      ) : (
        'Add duck'
      )}
    </button>
  );
};

export default SubmitBtn;
