# Personal Diary Kick-off

## Topics to cover

- Talk about DaisyUI
- Form validation with React-Toastify instead of alerts
- Adding individual input validation UI
- Project requirements

# DaisyUI

- As your applications grow, it can be useful to add a component library of some kind on top of what Tailwind provides. There are many out there, but we recommend [DaisyUI](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/module-project-personal-diary/topic/%f0%9f%93%96-our-basic-setup-daisyui/)
- It adds component class names like 'btn' and more, saving you from having to create your own with `@layer components` rules. It's highly customizable, but works out of the box

# Better Form Validation

- Our form validation has been relatively simple thus far, and relies on `alerts`, which aren't necessarily the best UX

## React Toastify

- A better option would be to have a little popup, known as a toast message.
- We could make these from scratch, but there are several popular libraries out there, such as [react-toastify](https://www.npmjs.com/package/react-toastify) that are widely used, and easy to setup

### Installation and setup

- We first need to install it `npm i react-toastify`
- With routing, we add this to our main layout, but for the project, you can add the `ToastContainer` to `App.jsx`

```js
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { Navbar, Footer } from '../components';

const MainLayout = () => {
  return (
    <div className='bg-slate-600 text-gray-300 flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow flex flex-col justify-between py-4'>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
```

- Then in `DuckForm.jsx` it's as simple as importing `toast` and replacing the `alert` with `toast.error`
- We can also add a success message (though in this case it could be overkill, since we immediately see the new duck)

```js
import { toast } from 'react-toastify';
// rest of DuckForm...
const handleSubmit = e => {
  e.preventDefault();
  try {
    if (!form.name.trim()) {
      throw new Error('Name is required');
    }
    if (!form.imgUrl.trim()) {
      throw new Error('Image URL is required');
    }
    if (!form.quote.trim()) {
      throw new Error('Quote is required');
    }
    const newDuck = { ...form, _id: crypto.randomUUID() };
    console.log(newDuck);

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
```

- There are also several [settings](https://fkhadra.github.io/react-toastify/introduction/) that we can either pass to `ToastContainer` to effect all toast messages, or as a second argument to the `toast` function

## More granular control wih error state

- It's common when you submit a form that fails validation, that the inputs that failed validation highlight as red, and show an error message. We can improve our UX further by incorporating this idea
- First step is to create an `errors` state, and set the initial state to an empty object

```js
const [errors, setErrors] = useState({});
```

- Let's make a `validateDuckForm` utility function we can use to extract some of this logic

```js
const validateDuckForm = ({ name, imgUrl, quote }) => {};
```

- This function will return an object where the keys will represent the input names, and the value will be the error message, se we can take all of our `if` statements over, but instead of throwing an `Error`, we'll add them to the `newErrors` object

```js
const validateDuckForm = ({ name, imgUrl, quote }) => {
  const newErrors = {};
  if (!name.trim()) {
    newErrors.name = 'Name is required';
  }
  if (!imgUrl.trim()) {
    newErrors.imgUrl = 'Image URL is required';
  }
  if (!quote.trim()) {
    newErrors.quote = 'Quote is required';
  }
  return newErrors;
};
```

- We can then call this function in our submit handler, and for new log the results

```js
const handleSubmit = e => {
  e.preventDefault();
  try {
    const validationErrors = validateDuckForm(form);
    console.log(validationErrors);
    return;
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
```

- If we check the console, we can see we get an object that only has properties for the inputs that didn't pass validation
- We set our errors state with these errors
- We can use `Object.keys().length` and throw an error with a more generic message if we have any errors

```js
if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');
```

### Updating our UI based on the errors state

- Now that our errors are in state, we can use that to update our UI and conditionally render an error message

```js
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
```

#### Validating URL

- While we're validating, let's also check if the image is a proper URL with JS, rather than relying on HTML
- There are several options, but we'll use the `URL` constructor, which will throw an error if the argument passed isn't a proper url

```js
const isValidUrl = testUrl => {
  try {
    new URL(testUrl);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};
```

- We can now also check for it

```js
const validateDuckForm = ({ name, imgUrl, quote }) => {
  const newErrors = {};
  if (!name.trim()) {
    newErrors.name = 'Name is required';
  }
  if (!imgUrl.trim()) {
    newErrors.imgUrl = 'Image URL is required';
  } else if (!isValidUrl(imgUrl)) {
    newErrors.imgUrl = 'Image must be a valid URL';
  }
  if (!quote.trim()) {
    newErrors.quote = 'Quote is required';
  }
  return newErrors;
};
```

- To clean up our code, we can move these into a `utils` folder
  - `src/utils/index.js`

```js
const isValidUrl = testUrl => {
  try {
    new URL(testUrl);
    return true;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
};

const validateDuckForm = ({ name, imgUrl, quote }) => {
  const newErrors = {};
  if (!name.trim()) {
    newErrors.name = 'Name is required';
  }
  if (!imgUrl.trim()) {
    newErrors.imgUrl = 'Image URL is required';
  } else if (!isValidUrl(imgUrl)) {
    newErrors.imgUrl = 'Image must be a valid URL';
  }
  if (!quote.trim()) {
    newErrors.quote = 'Quote is required';
  }
  return newErrors;
};

export { isValidUrl, validateDuckForm };
```

- then import what's needed

```js
import { useState } from 'react';
import { toast } from 'react-toastify';
import { validateDuckForm } from '../../utils';
```

#### Your project won't include routing, but all that would change from today is the placement of the `ToastContainer`

### Walk through project requirements, show DaisyUI modal
