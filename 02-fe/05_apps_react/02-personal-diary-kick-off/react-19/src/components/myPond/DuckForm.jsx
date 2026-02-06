import { useState } from 'react';
import { toast } from 'react-toastify';
import { validateDuckForm } from '../../utils';
const DuckForm = ({ setDucks }) => {
  const [form, setForm] = useState({
    name: '',
    imgUrl: '',
    quote: ''
  });
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    try {
      const validationErrors = validateDuckForm(form);
      console.log(validationErrors);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');
      const newDuck = { ...form, _id: crypto.randomUUID() };
      console.log(newDuck);
      toast.success("There's a new duck in your pond!");
      setDucks(prev => [...prev, newDuck]);
      setForm({
        name: '',
        imgUrl: '',
        quote: ''
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <section onSubmit={handleSubmit} className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'>
      <h2 className='text-4xl'>Add a new duck to my pond!</h2>
      <form id='add-form' className='flex flex-col gap-6 w-3/4'>
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
            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
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
            {errors.imgUrl && <p className='text-red-500 text-sm'>{errors.imgUrl}</p>}
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
            {errors.quote && <p className='text-red-500 text-sm'>{errors.quote}</p>}
          </div>
        </label>
        <button type='submit' className='bg-green-600 p-2 rounded-lg font-bold'>
          Add duck
        </button>
      </form>
    </section>
  );
};

export default DuckForm;
