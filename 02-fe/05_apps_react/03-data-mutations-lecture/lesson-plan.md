# Data Mutations and Forms

## Topics to cover

- Loading state and fetching with `onSubmit`
  - `sleep` utility function
- Using form actions
- `useFormStatus` for pending state
- `ErrorBoundary` with fallback
  - essentially becomes the `catch` block
- `useActionsState` with controlled form
- `use` to handle promises

# Topic Intro

When working with forms, thus far we've been using an `onSubmit` handler, and controlled inputs. We added an `errors` state to handle errors, and to track loading, we'd need an additional `loading` state. This is a lot of overhead just to submit a form. React 19, which just had it's stable release at the beginning of the year, introduced some new APIs for working with forms. These are mostly intended to work with the new React Server Components, but we can still make use of them in our SPAs.
But before we look at the new ways of handling forms, let's flesh out our current form with an actual POST request, and a loading state

## Making a POST request `onSubmit`

- Let's first make a `createDuck` function
  - This will look exactly like the one from our original Fetch API lecture

```js
const createDuck = async newDuck => {
  const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks/', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(newDuck)
  });
  if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
  const data = await res.json();
  return data;
};
```

- Import it into `DuckForm.jsx` and add it to `handleSubmit`

```js
const handleSubmit = async e => {
  e.preventDefault();
  try {
    const validationErrors = validateDuckForm(form);
    console.log(validationErrors);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');

    const newDuck = await createDuck(form);
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

## Add a loading state

- To prevent the user from trying to resubmit the form while it's still loading, we can add a loading state, and set our button to be `disabled` while loading is true

```js
const [loading, setLoading] = useState(false);

<button type='submit' disabled={loading} className='bg-green-600 p-2 rounded-lg font-bold'>
  Add duck
</button>;
```

- We should update loading to `true` only after our validation checks pass, but for demo purposes today, we'll start with it earlier
  - we also need to add a `finally` block, where we set loading back to false, in case an error occurs

```js
const handleSubmit = async e => {
  e.preventDefault();
  try {
    const validationErrors = validateDuckForm(form);
    console.log(validationErrors);
    setErrors(validationErrors);
    setLoading(true);
    if (Object.keys(validationErrors).length !== 0) throw new Error('Missing required fields');

    const newDuck = await createDuck(form);
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
  } finally {
    setLoading(false);
  }
};
```

- To simulate a slow connection, we can also make a `sleep` utility function

```js
const sleep = ms => new Promise(res => setTimeout(res, ms));
```

- The button at this point is disabled, but we need to update our UI to reflect that. Luckily, DaisyUI can handle that for us if we just add their `btn` class

```js
<button type='submit' disabled={loading} className='btn btn-success'>
  {loading ? (
    <>
      Adding duck... <span className='loading loading-spinner'></span>
    </>
  ) : (
    'Add duck'
  )}
</button>
```

### To recap we now have a form

- That uses controlled inputs (so we have state for the form)
- We have an `errors` state to display errors on each input
- We have a loading state to disable our button that we must manually update
- We have a `handleSubmit` function that we pass to `onSubmit`

## Refactoring with Form Actions

- Let's refactor using `actions` and start bringing back some of those features
- copy/paste to new `Actions.jsx` file, import/export from `index.js`, import into `MyPond.jsx`

### Using uncontrolled components

- Let's clear all our our states out, comment out our submit handler

```js
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createDuck } from '../../data';
import { validateDuckForm, sleep } from '../../utils';
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
  return (
    <section className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'>
      <h2 className='text-4xl'>With Form Actions</h2>
      <h2 className='text-4xl'>Add a new duck to my pond!</h2>
      <form id='add-form' className='flex flex-col gap-6 w-3/4'>
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
        <button type='submit' /*disabled={loading}*/ className='btn btn-success'>
          Add duck
        </button>
      </form>
    </section>
  );
};

export default DuckForm;
```

- Let's make a new `submitAction`, this will accept a formData object, and we can call `get()` to access the properties based on their `name` attribute
- We can make a new object with those values, and for now just log them
- We add it as the `action` for our form

```js
const submitAction = formData => {
  const name = formData.get('name');
  const imgUrl = formData.get('imgUrl');
  const quote = formData.get('quote');

  console.log({ name, imgUrl, quote });
};

<form action={submitAction} id='add-form' className='flex flex-col gap-6 w-3/4'>
```

- We can pass this new object to our `validateDuckForm` function to still get validation

```js
const submitAction = formData => {
  const name = formData.get('name');
  const imgUrl = formData.get('imgUrl');
  const quote = formData.get('quote');

  console.log({ name, imgUrl, quote });

  const validationErrors = validateDuckForm({ name, imgUrl, quote });
  console.log(validationErrors);
};
```

### useFormStatus for pending state

- instead of `useState`, with actions we can use the `useFormStatus` hook
- Our submit action needs to be async
- Our submit button needs to be moved to it's own component
- `src/myPond/SubmitBtn.jsx`
  - we have to import from `react-dom` for this one
  - instead of `loading`, they call it `pending`

```js
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
```

- We then import the button and use it

```js
import SubmitBtn from './SubmitBtn';
<SubmitBtn />;
```

- From here, we can add our new duck logic, and throw an error if validation doesn't pass

```js
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
```

- But now, if we throw an error, our app crashes. Instead of a try/catch block, let's use an `ErrorBoundary` to display a fallback

### Error handling with an ErrorBoundary

- The React Docs recommend using the very lightweight library `react-error-boundary`. We can use this to display a fallback ui in case an error occurs
- First we install it `npm i react-error-boundary`
- This `ErrorBoundary` component now essentially acts as the `catch` block, and will display our fallback UI in case of error
- We wrap our form in the `ErrorBoundary`

```js
<ErrorBoundary fallback={<p className='bg-error'>Something went wrong!</p>}></ErrorBoundary>
```

- As shown in the (playground)[https://playground.wbscod.in/react/data-mutations-and-forms/4], instead of a `fallback`, we can pass a `FallbackComponent`, which can give use access to the `error` and `resetErrorBoundary` as props
- `src/components/myPond/ErrorFallback.jsx`

```js
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className='p-4 bg-red-100 text-red-700 border border-red-300 rounded'>
    <p className='font-semibold'>There was an error while submitting the form:</p>
    <pre className='mt-2 text-sm'>{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className='mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700'
    >
      Retry
    </button>
  </div>
);

export default ErrorFallback;
```

- Import, and pass to `ErrorBoundary` as `FallbackComponent`
- You can customize this fallback as needed for better UX

### Comparing to our state version

If we compare our `submitAction` to our `submitHandler`, we can see we've streamlined quite a few things

- We no longer need to manually `preventDefault`
- With the use of `ErrorBoundary` component, we don't need a `try/catch` block
- We don't need to manually update a loading/pending state
- We get our form data directly from the `FormData` object, so no need to state
- We don't need to manually reset the form

It also won't be super clear in our examples, but `actions` also use a React feature called `transitions` under the hood, which keeps the DOM responsive, and doesn't lock our UI while the form is submitting

## Forms with useActionState

- To give us the granular control we had before, with input specific errors, we'll need to use another new hook React 19 offers us, `useActionState`
- Let's take a look at [the docs](https://react.dev/reference/react/useActionState)

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

- Breaking down the anatomy, in our return we get back three items in our array
  - `state` - this is whatever we return from the Action. This can be an error message, meta data about the request, the newly created resource, or whatever we decide we want back
  - `formAction` - this is the action that will be passed to the form
  - `isPending` - this replaces our separate isPending state, and is managed by `useActionState`, so we no longer need to manually update it
- `useActionState` requires 2 arguments and has an optional third

  - `fn` - this is the function that we will use for our action
  - `initialState` - just like `useState` you pass an initial state
  - `permaLink` - an optional parameter to contain the unique URL that this form modifies. We won't be using it today

- We can import `useActionState` from `react` and declare it, we need to pass our `submitAction` to it

```js
const [state, formAction, isPending] = useActionState(submitAction, {error: null, success: false});

 <form action={formAction} id='add-form' className='flex flex-col gap-6 w-3/4'>
```

- Now that our `action` is being passed to `useActionState`, the first argument is the previous sate (just like with `useState`)

```js
const submitAction = async (prevState, formData) => {};
```

- We also need our `action` to return something now. This could be lots of things, but let's return an object that has 2 properties:
  - `error`: either `null` or our `validationErrors` object
  - `success`: a boolean do indicate if the submission was successful or not

```js
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
  await sleep(2000);
  const newDuck = await createDuck({ name, imgUrl, quote });
  toast.success("There's a new duck in your pond!");
  setDucks(prev => [...prev, newDuck]);
  return { error: null, success: true };
};
```

- Since we have an `isPending` state from `useActionState`, we can bring back our button, and still have our conditional rendering

```js
<button type='submit' disabled={isPending} className='btn btn-success'>
  {isPending ? (
    <>
      Adding duck... <span className='loading loading-spinner'></span>
    </>
  ) : (
    'Add duck'
  )}
</button>
```

- We can also bring back our error messages (and add the `?` in case the property isn't there)

```js
<form action={formAction} id='add-form' className='flex flex-col gap-6 w-3/4'>
          <label className='w-full flex gap-2 items-baseline'>
            <span className='text-xl'>Name:</span>
            <div className='w-full'>
              <input
                name='name'
                type='text'
                placeholder="What is your duck's name?"
                className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
              />
              {state.error?.name && <p className='text-red-500 text-sm'>{state.error.name}</p>}
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
              {state.error?.imgUrl && <p className='text-red-500 text-sm'>{state.error.imgUrl}</p>}
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
              {state.error?.quote && <p className='text-red-500 text-sm'>{state.error.quote}</p>}
            </div>
          </label>
```

- This means we can now remove our `ErrorBoundary`

### Handling server errors with a try/catch block

- Our validation errors are being handled now, but what if there's an actual error on the server side?
- Let's simulate one by adding a typo to the URL
- Our app crashes again, so our options are
  - bring back the `ErrorBoundary`
  - use a `try/catch` block
- If we want to use a fallback UI, `ErrorBoundary` would make sense, but we just want a toast message, so let's use a `try/catch` block
  - we need to make sure we still return the basic structure of our state

```js
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
```

### Controlling our inputs to prevent form reset

- The form will reset now, even when we have an error, which isn't great UX. There are several ways we could try and solve this, but the simplest would be to just control the inputs again

```js
 const [form, setForm] = useState({
    name: '',
    imgUrl: '',
    quote: ''
  });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
            {state.error?.name && <p className='text-red-500 text-sm'>{state.error.name}</p>}
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
            {state.error?.imgUrl && <p className='text-red-500 text-sm'>{state.error.imgUrl}</p>}
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
            {state.error?.quote && <p className='text-red-500 text-sm'>{state.error.quote}</p>}
          </div>
        </label>
```

- Is this simpler than the original? That's debatable, but by using actions - and by extension `useActionState` - you allow React to take advantage of modern features for a better UX. And even though these are meant to fit into the React as a fullstack framework paradigm, they're still relevant for us working with SPAs
