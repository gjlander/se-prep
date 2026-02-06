// import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { createDuck } from '../../data';
import { validateDuckForm, sleep } from '../../utils';
import SubmitBtn from './SubmitBtn';
import ErrorFallback from './ErrorFallback';
const DuckForm = ({ setDucks }) => {
  //   const handleSubmit = async e => {
  //     e.preventDefault();
  //     try {
  //       const validationErrors = validateDuckForm(form);
  //       console.log(validationErrors);
  //       setErrors(validationErrors);
  //       setLoading(true);
  //       await sleep(2000);
  //       if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');

  //       const newDuck = await createDuck(form);
  //       console.log(newDuck);
  //       toast.success("There's a new duck in your pond!");
  //       setDucks(prev => [...prev, newDuck]);
  //       setForm({
  //         name: '',
  //         imgUrl: '',
  //         quote: ''
  //       });
  //     } catch (error) {
  //       toast.error(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const submitAction = async formData => {
    const name = formData.get('name');
    const imgUrl = formData.get('imgUrl');
    const quote = formData.get('quote');

    console.log({ name, imgUrl, quote });

    const validationErrors = validateDuckForm({ name, imgUrl, quote });
    console.log(validationErrors);
    if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');
    await sleep(2000);
    const newDuck = await createDuck({ name, imgUrl, quote });
    toast.success("There's a new duck in your pond!");
    setDucks(prev => [...prev, newDuck]);
  };

  return (
    <section className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'>
      <h2 className='text-4xl'>With Form Actions</h2>
      <h2 className='text-4xl'>Add a new duck to my pond!</h2>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <form action={submitAction} id='add-form' className='flex flex-col gap-6 w-3/4'>
          <label className='w-full flex gap-2 items-baseline'>
            <span className='text-xl'>Name:</span>
            <div className='w-full'>
              <input
                name='name'
                type='text'
                placeholder="What is your duck's name?"
                className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
              />
              {/* {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>} */}
            </div>
          </label>
          <label className='w-full flex gap-2 items-baseline'>
            <span className='text-xl'>Image:</span>
            <div className='w-full'>
              <input
                name='imgUrl'
                // type='url'
                placeholder='What does your duck look like?'
                className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
              />
              {/* {errors.imgUrl && <p className='text-red-500 text-sm'>{errors.imgUrl}</p>} */}
            </div>
          </label>
          <label className='w-full flex gap-2 items-baseline'>
            <span className='text-xl'>Quote:</span>
            <div className='w-full'>
              <input
                name='quote'
                type='text'
                placeholder='What does your duck say?'
                className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
              />
              {/* {errors.quote && <p className='text-red-500 text-sm'>{errors.quote}</p>} */}
            </div>
          </label>
          <SubmitBtn />
        </form>
      </ErrorBoundary>
    </section>
  );
};

export default DuckForm;
