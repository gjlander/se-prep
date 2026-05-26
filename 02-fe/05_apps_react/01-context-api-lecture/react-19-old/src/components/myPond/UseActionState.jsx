import { useActionState, useState } from 'react';
import { toast } from 'react-toastify';
import { useDucks } from '../../context';
import { createDuck } from '../../data';
import { validateDuckForm, sleep } from '../../utils';

const DuckForm = () => {
  const { setDucks } = useDucks();
  const submitAction = async (prevState, formData) => {
    const name = formData.get('name');
    const imgUrl = formData.get('imgUrl');
    const quote = formData.get('quote');

    console.log({ name, imgUrl, quote });

    const validationErrors = validateDuckForm({ name, imgUrl, quote });
    console.log(validationErrors);
    if (Object.keys(validationErrors).length !== 0) {
      return { error: validationErrors, success: false };
    }
    try {
      await sleep(2000);
      const newDuck = await createDuck({ name, imgUrl, quote });
      toast.success("There's a new duck in your pond!");
      setDucks(prev => [...prev, newDuck]);
      return { error: null, success: true };
    } catch (error) {
      toast.error(error.message || 'Something went wrong!');
      return { error: null, success: false };
    }
  };

  const [state, formAction, isPending] = useActionState(submitAction, { error: null, success: false });
  const [form, setForm] = useState({
    name: '',
    imgUrl: '',
    quote: ''
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <section className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'>
      <h2 className='text-4xl'>With useActionState</h2>
      <h2 className='text-4xl'>Add a new duck to my pond!</h2>

      <form action={formAction} id='add-form' className='flex flex-col gap-6 w-3/4'>
        <label className='w-full flex gap-2 items-baseline'>
          <span className='text-xl'>Name:</span>
          <div className='w-full'>
            <input
              onChange={handleChange}
              value={form.name}
              name='name'
              type='text'
              placeholder="What is your duck's name?"
              className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
            />
            {state.error?.name && <p className='text-red-500 text-sm'>{state.error?.name}</p>}
          </div>
        </label>
        <label className='w-full flex gap-2 items-baseline'>
          <span className='text-xl'>Image:</span>
          <div className='w-full'>
            <input
              onChange={handleChange}
              value={form.imgUrl}
              name='imgUrl'
              // type='url'
              placeholder='What does your duck look like?'
              className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
            />
            {state.error?.imgUrl && <p className='text-red-500 text-sm'>{state.error?.imgUrl}</p>}
          </div>
        </label>
        <label className='w-full flex gap-2 items-baseline'>
          <span className='text-xl'>Quote:</span>
          <div className='w-full'>
            <input
              onChange={handleChange}
              value={form.quote}
              name='quote'
              type='text'
              placeholder='What does your duck say?'
              className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
            />
            {state.error?.quote && <p className='text-red-500 text-sm'>{state.error?.quote}</p>}
          </div>
        </label>
        <button type='submit' disabled={isPending} className='btn btn-success'>
          {isPending ? (
            <>
              Adding duck... <span className='loading loading-spinner'></span>
            </>
          ) : (
            'Add duck'
          )}
        </button>
      </form>
    </section>
  );
};

export default DuckForm;
