# From Vanilla to React - AI Chatbot

-   Go over [project requirements](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%a7%a9-chatbot-with-react-and-openai/)
-   Show local demo of potential end result

## Refactoring our SSE app into React

-   This is a big task, so to help get you started, together let's refactor our project from yesterday into React

### Setting up our Vite project with Tailwind and DaisyUI

-   Walk me through, what's the first thing I need to do? Where can I look if I forget the syntax?
-   Create Vite scaffold

```
npm create vite@latest sse-react-refactor -- --template react
```

-   Clear out boilerplate

-   Install Tailwind

```
npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

-   Create config and postcss files

```
npx tailwindcss init -p
```

-   Update config file

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

-   Import CSS @ rules

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

-   Install DaisyUI

```
npm i -D daisyui
```

-   Update tailwind config

```js
/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
};
```

### Copy over the UI

-   Copy/paste the contents of the body into `App.jsx`
-   Change `<body>` to `<div>`, an remove `<script>` tags

```html
<div class="h-screen container mx-auto p-5 flex flex-col justify-between gap-5">
    <div class="h-1/3 w-full p-8 bg-slate-100 rounded-lg shadow-md">
        <form>
            <input id="stream" type="checkbox" />
            <label for="stream">Stream response?</label>
            <textarea
                id="prompt"
                rows="5"
                placeholder="Ask me anything..."
                class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <button
                id="submit"
                type="submit"
                class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit✨
            </button>
        </form>
    </div>
    <div
        id="results"
        class="h-2/3 w-full p-8 bg-slate-100 rounded-lg shadow-md"
    ></div>
</div>
```

-   On save, with automatically update for to htmlFor and class to className
    -   If it didn't I could search and replace
-   Darken up the bg color a bit

### Break it into components

-   One for the Form, one for the Results (I'll call it chat)
-   Make the components copy/paste, do the imports, etc.

### Control our components

-   Without even looking at the fetch stuff, what state do we need to control our form?

-   Need state for checkbox, and one for textarea
    -   Could use a single state, but let's keep things simple
-   Boolean for checkbox, string for prompt

```js
const [isStream, setIsStream] = useState(false);
const [prompt, setPrompt] = useState('');
```

-   Now how do we use these states on our inputs?

#### Checkbox

-   If we check the react dev tools we see it updates properly

```js
const toggleChecked = () => setIsStream((prev) => !isStream);
<input id='stream' type='checkbox' onChange={toggleChecked} value={isStream} />;
```

#### Textarea

```js
const handleChange = (e) => setPrompt(e.target.value);
<textarea
    id='prompt'
    rows='5'
    placeholder='Ask me anything...'
    className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
    value={prompt}
    onChange={handleChange}
></textarea>;
```

### Add our submit handler

-   Start with a placeholder to verify it's working

```js
const handleSubmit = (e) => {
    e.preventDefault();
    console.log('isStream, prompt: ', isStream, prompt);
};
<form onSubmit={handleSubmit}>
```

-   Now that we know our handler is working ok, let's copy that massive beast of a function in as our handler
-   It's gonna be mad at first, but that's ok

#### Update variable names

-   We've renamed some variable, so we can search and replace to update them (make sure to match whole word and casing)
    -   promptValue -> prompt
    -   streamValue -> isStream

#### Comment out errors and DOM manipulation

-   Now anything left that's still causing an error let's comment out.
-   Let's comment rather than delete, to remind us what needs to happen at each stage

#### Bring back logs to verify we're back to basics with functionality

-   and get rid of linting errors

```js
const handleSubmit = async (e) => {
    try {
        // Prevent the form from submitting
        e.preventDefault();
        // const {
        //     prompt: { value: prompt },
        //     stream: { checked: isStream },
        //     submit,
        // } = form.elements;
        // If the prompt value is empty, alert the user
        if (!prompt) return alert('Please enter a prompt');
        // Clear the results container
        // resultsContainer.innerHTML = '';
        // Disable the submit button
        // submit.disabled = true;
        // submit.classList.add(
        //     'bg-gray-500',
        //     'hover:bg-gray-500',
        //     'cursor-not-allowed'
        // );
        // stream.disabled = true;
        // Request
        const response = await fetch(
            'http://localhost:5050/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    mode: 'development', // Set the mode to development to not send the request to Open AI for now
                    provider: 'open-ai',
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    stream: isStream,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a software developer', // This is the system message, it will control the behavior of the chatbot
                        },
                        {
                            role: 'user',
                            content: prompt, // This is the user message, it will be the prompt for the chatbot
                        },
                    ],
                }),
            }
        );
        if (!response.ok) {
            // If the response is not ok, throw an error by parsing the JSON response
            const { error } = await response.json();
            throw new Error(error);
        }
        // Conditionally process the response depending on the value of `isStream`
        if (isStream) {
            // Process stream response
            // Get the responses stream
            const reader = response.body.getReader();
            // Create a new TextDecoder
            const decoder = new TextDecoder('utf-8');
            // Variable to store the data result
            let dataResult = '';
            // Create a new paragraph element before the loop
            // const p = document.createElement('p');
            // resultsContainer.appendChild(p);
            // Variable to check if the stream is done
            let isDone = false;
            // While the stream is not closed, i.e. done is false
            while (!isDone) {
                // Read the next chunk
                const result = await reader.read();
                // If the result is done, break out of the loop
                if (result.done) {
                    isDone = true;
                    break;
                }
                // Decode the result
                const chunk = decoder.decode(result.value, {
                    stream: true,
                });
                // Split lines by new line, you can get more than one line per chunk
                const lines = chunk.split('\n');
                // Loop through each line
                lines.forEach((line) => {
                    // Check if the line starts with data:, that's how Open AI sends the data
                    if (line.startsWith('data:')) {
                        // Get the JSON string without the data: prefix
                        const jsonStr = line.replace('data:', '');
                        // Parse the JSON string
                        const data = JSON.parse(jsonStr);
                        // Get the content from the first choice
                        const content = data.choices[0]?.delta?.content;
                        // If there is content
                        if (content) {
                            dataResult += content;
                            console.log(dataResult);

                            // const md = marked.parse(dataResult);
                            // Add the content to the paragraph element;
                            // p.innerHTML = md;
                            // Prism.highlightAll();
                        }
                    }
                });
            }
        } else {
            // Process response normally
            const dataResult = await response.json();
            console.log(dataResult);

            // Output the response to the results container
            // resultsContainer.innerHTML = `<p>${marked.parse(
            //     dataResult.message?.content
            // )}</p>`;
            // Prism.highlightAll();
        }
    } catch (error) {
        // If an error occurs, log it to the console
        console.error(error);
    } finally {
        // Enable the submit button
        // submit.disabled = false;
        // submit.classList.remove(
        //     'bg-gray-500',
        //     'hover:bg-gray-500',
        //     'cursor-not-allowed'
        // );
        // stream.disabled = false;
    }
};
```

### Refactor using React logic

-   Let's visit each commented section, and we what we need to do to bring this into React

#### form.elements

-   We can completely get rid of these DOM selectors

```js
// const {
//     prompt: { value: prompt },
//     stream: { checked: isStream },
//     submit,
// } = form.elements;
```

#### resultsContainer

-   We see here our first piece related to rendering OpenAi's response
-   We have a component now for the results container - <Chat/>
-   What do we need instead of DOM manipulation to render there?
    -   A piece of state for the message
    -   What should that piece of state look like?
    -   Where should that state live? Form and Chat both need it

```js
// Clear the results container
// resultsContainer.innerHTML = '';
```

-   Let's just call it `dataResult` to match our current variable
-   `App.jsx`
-   We declare our state, and pass the state to Chat, and the setter to Form

```js
import { useState } from 'react';
import Form from './components/Form';
import Chat from './components/Chat';
function App() {
    const [dataResult, setDataResult] = useState('');
    return (
        <div className='h-screen container mx-auto p-5 flex flex-col justify-between gap-5'>
            <Form setDataResult={setDataResult} />
            <Chat dataResult={dataResult} />
        </div>
    );
}

export default App;
```

-   `Chat.jsx`
-   Deconstruct it, and conditionally render it

```js
const Chat = ({ dataResult }) => {
    return (
        <div
            id='results'
            className='h-2/3 w-full p-8 bg-slate-600 rounded-lg shadow-md'
        >
            {dataResult && dataResult}
        </div>
    );
};

export default Chat;
```

-   Back in `Form.jsx` we deconstruct the setter, and can use it for rendering
-   Now to clear the results container, we reset the state to an empty string

```js
// Clear the results container
setDataResult('');
```

-   Let's circles back to disabling the submit button

#### using our setter

-   If we search for `dataResult` we can find places we'll need to use our setter instead
-   Since we have our state, we don't need this variable anymore, we also don't need the DOM stuff right after

```js
// Variable to store the data result
// let dataResult = '';
// Create a new paragraph element before the loop
// const p = document.createElement('p');
// resultsContainer.appendChild(p);
```

-   Now inside the `if (content)` we use the setter

```js
// dataResult += content;
// console.log(dataResult);
setDataResult((prev) => (prev += content));
```

-   Easy as that to render our stream response!
-   For our json response it's just as easy

```js
const dataResult = await response.json();
// console.log(dataResult);
setDataResult(dataResult.message?.content);
```

### Disabling the button

-   We have the basic functionality, now let's circle back to disabling the button.
-   How can we do that in React? Where can we find an example of how we could?

    -   If we set a loading state, we can use it to conditionally render, like [the demo on friday](https://github.com/WD-059/Frontend/blob/main/module06-gen-ai-integration/frontend-auth-and-protected-route-demo/src/pages/SignIn.jsx)

-   Make a loading state

```js
const [loading, setLoading] = useState(false);
```

-   Set it to true if our validation checks pass

```js
// Disable the submit button
setLoading(true);
```

-   Set it to false in the finally

```js
// Enable the submit button
setLoading(false);
```

-   Now we can set the disabled property to match the loading state for our submit button, and the checkbox

```js
<form onSubmit={handleSubmit}>
    <input
        id='stream'
        type='checkbox'
        onChange={toggleChecked}
        value={isStream}
        disabled={loading}
    />
    // rest of form
    <button
        id='submit'
        type='submit'
        className='mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        disabled={loading}
    >
        Submit✨
    </button>
</form>
```

-   Now to show they're disabled, we could simply copy/paste the styling, and conditionally render it...
-   Or we could take advantage of DaisUI, and use their `btn` and `checkbox` classes.
    -   If we hover over them, we can see they handle changing the styling while it's disabled for us

```js
<form onSubmit={handleSubmit}>
    <input
        id='stream'
        type='checkbox'
        className='checkbox checkbox-primary'
        onChange={toggleChecked}
        value={isStream}
        disabled={loading}
    />
    <label htmlFor='stream'>Stream response?</label>
    //textarea
    <button
        id='submit'
        type='submit'
        className='mt-4 w-full px-4 py-2 btn btn-primary'
        disabled={loading}
    >
        Submit✨
    </button>
</form>
```

-   We clean up our classNames, and save some effort

## Turning this into a full Chatbot

-   Now it's up to you to turn this into a fully fledged chatbot!
-   It's another big project, work incrementally
-   Our demo of managing the message history yesterday can get you started, but there will be more considerations to be made
-   DaisyUI conveniently has Chat Bubble components
-   I'll add code highlighting to this example as a reference, and give links to the libraries I used
