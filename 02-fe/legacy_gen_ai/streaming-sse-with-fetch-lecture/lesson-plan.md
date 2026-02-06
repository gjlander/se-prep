# Streaming SSE with Fetch

- copy/paste `index.html`
  - get rid of <> in tailwind CDN
- We have a simple form with a textarea for the user to type in, and a checkbox to choose whether to stream the response or not
- create `index.js`
- This is a step-by-step tutorial that gives you all of the code you need, but I want to go over it together first, and really break down what's going on. You'll have the day to recreate the app, and in the correction, we'll look at building on to it

## Back to Basics with DOM Manipulation

- Select the form, and add an event listener with an async function
- We'll also add a try/catch block

```js
form.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    console.log('Form submitted!');
  } catch (error) {
    console.error(error);
  }
});
```

- We've used a couple of techniques to access inputs in a form, one option is to use the elements property of the form

```js
form.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    const formElements = form.elements;
    console.log('form elements: ', formElements);
  } catch (error) {
    console.error(error);
  }
});
```

- Even though this looks like an array with the straight brackets, it's an `HTMLFormControlsCollection`, which means we can deconstruct them based on their id's

```js
form.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    const { prompt, stream } = form.elements;
    console.log('form elements: ', prompt, stream);
  } catch (error) {
    console.error(error);
  }
});
```

- Because we only care about their values, we can take that a step further with nested deconstruction
- textareas have a value property, just like text inputs. Checkboxes have a checked property, which is a boolean

```js
form.addEventListener('submit', async e => {
  try {
    e.preventDefault();
    const {
      prompt: { value: promptValue },
      stream: { checked: streamValue }
    } = form.elements;
    console.log('form element values: ', promptValue, streamValue);
  } catch (error) {
    console.error(error);
  }
});
```

- Now that we have captured the input value, we can validate and make sure it's not blank

```js
form.addEventListener('submit', async e => {
  try {
    e.preventDefault();

    const {
      prompt: { value: promptValue },
      stream: { checked: streamValue }
    } = form.elements;

    if (!promptValue) return alert('Please enter a prompt');

    console.log('form element values: ', promptValue, streamValue);
  } catch (error) {
    console.error(error);
  }
});
```

### Making our fetch request

- Now that we have our initial setup, we can make our fetch request, because at the end of the day, we're making a POST request to an API

##### Bring up side-by-side with Postman

- Just like Friday, let's convert our Postman request into JS code
- We specify the URL

```js
// after console.log()
const response = await fetch('http://localhost:5050/api/v1/chat/completions');
```

- Then add our configuration object (compare to Postman setting each time)
- We specify this is a POST request

```js
    method: 'POST',
```

- We add our 3 headers
  - We do have to specify the content-type

```js
headers: {
        'Content-Type': 'application/json',
        mode: 'development', // Set the mode to development to not send the request to Open AI for now
        provider: 'open-ai',
        },
```

- And add our body
  - To convert this into JSON, we have to stringify
  - We still need a system message first
  - Now for the user content, we use value of whatever they typed in

```js
body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are a software developer student that only speaks in rhymes', // This is the system message, it will control the behavior of the chatbot
                        },
                        {
                            role: 'user',
                            content: promptValue, // This is the user message, it will be the prompt for the chatbot
                        },
                    ],
                }),
```

- If we're not streaming, we treat this like any old fetch request, and use the .json() method to get our data, then log it

```js
const data = await response.json();
// Log the response to the console
console.log(data);
```

- Now our response looks just like in Postman!
- This it out of order from the tutorial, but before we dive into streaming, let's output this message to the DOM, and add in some error handling
- Let's see what happens if we don't include a provider
- The proxy still returns json, but with an error message. Now instead of our usual generic error message, we pass this error to be logged
- Because we know this API provides an error property in the response of an error, we can deconstruct it, and pass it along

```js
if (!response.ok) {
  // If the response is not ok, throw an error by parsing the JSON response
  const { error } = await response.json();
  throw new Error(error);
}
```

```js
headers: {
                    'Content-Type': 'application/json',
                    mode: 'development', // Set the mode to development to not send the request to Open AI for now
                    // provider: 'open-ai',
                },
```

- Select our results container

```js
const resultsContainer = document.querySelector('#results');
```

- Now, all we want is to render the content of what the `assistant` said
- So, we can dot notate to get there, and set the innerHTML of the resultsContainer
- By adding this question mark here, we're checking if this property exists

```js
resultsContainer.innerHTML = data.message?.content;
```

- This result appears quickly, because we're making a fake request, but a real request could take time. Doing it this traditional way could make the app feel slow and laggy. To get that effect where the text appears a few words at a time, we have to use streaming

## Streaming our response

- First thing is to add the stream property to the body of the request

```js
body: JSON.stringify({
                    model: 'gpt-4o',
                    stream: streamValue,
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are a software developer student that only speaks in rhymes', // This is the system message, it will control the behavior of the chatbot
                        },
                        {
                            role: 'user',
                            content: promptValue, // This is the user message, it will be the prompt for the chatbot
                        },
                    ],
                }),
```

- Now we can use an if/else to handle our response differently based on if we're streaming
- Our current logic goes in the else, inside of the if is where we'll add our logic to handle the stream

```js
if (streamValue) {
} else {
  const data = await response.json();
  // Log the response to the console
  console.log(data);
  resultsContainer.innerHTML = data.message?.content;
}
```

- Now nothing happens when we stream, but this highlights a bug. The old response is still there, so let's add a line to clear the old response to make room for the new one

```js
//near the top
if (!promptValue) return alert('Please enter a prompt');
resultsContainer.innerHTML = '';
```

- Since we haven't written any code to handle the stream, we don't see anything in the UI, but in the network tab we can see a continuous stream of information
- Compare this to the json response where it all comes at once

### Handling the stream

- If we `console.log()` the response object, we can see that meta data we've been getting
- You'll notice the body is a `readable stream`. We've seen that before, now we can work with it.
- If we look at the Prototype, there's a body property. And this body property has a method called `getReader`. This creates a reader object that will lock into the stream, and allow us to, well, read it

```js
const reader = response.body.getReader();
```

- This reader has a .read() method that returns a promise, so we await it, and get our result

```js
const result = await reader.read();
console.log('result: ', result);
```

- If we log the result, we can see a few things that our interesting
  - there is a `done` property that is a boolean. This will tell us if the stream is done
  - the value property is this array of numbers. We see it's called "Uint8Array"
- We'll take more about the value property in a second, but this false property tells us that the stream isn't done. There's more coming.
- Right now we are only processing the first chunk, we want to repeat this logic for every chunk, until this property comes back as true
- Let's use a while loop, and create an `isDone` condition
- We keep looping to read the next chunk while it isn't done yet

```js
let isDone = false;

while (!isDone) {
  const result = await reader.read();
  console.log('result: ', result);

  const chunk = decoder.decode(result.value, { stream: true });
  console.log('chunk: ', chunk);

  // const lines = chunk.split('\n');
  // console.log('lines: ', lines);
}
```

- On our last chunk result, the done property will be true, so we make a little if statement, and break the loop when it is

```js
if (result.done) {
          isDone = true;
          break;
        }
```

- Now this will process all of the chunks, and finish when the stream is done. Nice! But we still can't read it...

- Our result value comes in UTF-8 encoded characters. This is an international standard for encoding characters. We've seen it already in our html file

```html
<meta charset="UTF-8" />
```

- In order to decode these UTF-8 characters into something human readable, we also need a decoder. JS has a built-n `TextDecoder` interface that will do this for us

```js
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');
```

- This decoder has an aptly named decode method that will take 2 arguments
  - The value to decode
  - an object to tell it that this is a stream, so data will come in chunks

```js
const chunk = decoder.decode(result.value, { stream: true });
console.log('chunk: ', chunk);
```

- The chunk comes as a string, and it's a little hard to read, but we can see that each chunk has a work or two of the response.
- It's not super clear in this format, but sometimes we get multiples lines back, to make this a bit more workable, we can split it into an array, where each line is an item
- Remember the \\n is a sign to start a new line

```js
const lines = chunk.split('\n');
console.log('lines: ', lines);
```

- We can see we're getting three lines, but 2 and 3 are always empty. This could change in different responses. But the key thing here, is the first line is always prefaced with `data`
- This is OpenAI's way of indicating to us that this is data to be processed. If you take a closer look, you'll notice that after the word data, we have JSON format
- Now we can iterate over this lines array, and if the line starts with `data` we process it by
  - first removing the word data
  - the parsing the JSON

```js
lines.forEach(line => {
  // Check if the line starts with data:, that's how Open AI sends the data
  if (line.startsWith('data:')) {
    // Get the JSON string without the data: prefix
    const jsonStr = line.replace('data:', '');
    const data = JSON.parse(jsonStr);
    console.log('data :', data);
  }
});
```

- Now we've got some objects we can work with!
- If we look at the object, we've got some metadata about the model, the id etc.
- In the `choices` property, we get an array with 1 object
  - A real response could have multiple choices, but we'll still always choose the first one
- That object has a delta property, which is an object with a content property, where we can finally see the message!
- Through some lengthy dot and bracket notation, we can access that content
  -We add those ?, just to be safe and avoid potential errors

```js
const content = data.choices[0]?.delta?.content;
console.log('content: ', content);
```

- Finally, we've taken that initial stream object, and uncovered the actual content!
- From here, we can create a variable that starts as an empty string to bring all of this together in a single string
- We'll declare it outside of the while loop

```js
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');
let dataResult = '';
```

- Then if there is content, we add it to the end of the string

```js
lines.forEach(line => {
  // Check if the line starts with data:, that's how Open AI sends the data
  if (line.startsWith('data:')) {
    // Get the JSON string without the data: prefix
    const jsonStr = line.replace('data:', '');
    const data = JSON.parse(jsonStr);
    // console.log('data :', data);

    const content = data.choices[0]?.delta?.content;
    // console.log('content: ', content);
    if (content) {
      dataResult += content;
      console.log(dataResult);
    }
  }
});
```

- Now we can see it building one chunk at a time!
  - Note that chunks are often one word, but not always

### Outputting to the DOM

- First we'll create a new p element, and append it to our results container

```js
// console.log(response);
const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');
let dataResult = '';
const p = document.createElement('p');
resultsContainer.appendChild(p);
```

- Then we simply set the innerHTML to our dataResult

```js
if (content) {
  dataResult += content;
  p.innerHTML = dataResult;
  // console.log(dataResult);
}
```

- And we get that snappy word-at-a-time result that chat bots have!
- The last thing we want to to is disable the buttons while it's loading, and update the styling to reflect that
- To reference the submit button, let's give it an id

```html
<button
  id="submit"
  type="submit"
  class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Submit✨
</button>
```

- Then we can add it to our deconstructed form elements

```js
const {
  prompt: { value: promptValue },
  stream: { checked: streamValue },
  submit
} = form.elements;
```

- Then we disable the button, and add some styling. And disable the stream checkbox

```js
if (!promptValue) return alert('Please enter a prompt');
resultsContainer.innerHTML = '';
// Disable the submit button
submit.disabled = true;
submit.classList.add('bg-gray-500', 'hover:bg-gray-500', 'cursor-not-allowed');
stream.disabled = true;
```

- And then enable them again, once all is done. We'll put this in a finally block, so that it happens even if we land in the catch block

```js
finally {
        // Enable the submit button
        submit.disabled = false;
        submit.classList.remove(
            'bg-gray-500',
            'hover:bg-gray-500',
            'cursor-not-allowed'
        );
        stream.disabled = false;
    }
```

## Syntax Highlighting Markdown

- For simple text, we're all done. But as you know, ChatGPT can write code, and if code comes back we want it to be properly highlighted, so that it's readable
- We'll use 2 libraries CDNs for a quick setup here, marked to process and format the markdown, and Prismjs to highlight it properly

```html
<!-- inside head -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-darcula.min.css" rel="stylesheet" />
<!-- at end of body -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/prism.min.js"></script>
<script src="index.js"></script>
```

- To test this, we can update to a message with markdown syntax in the proxy

````js
const text =
  'Certainly! Here is a simple ES6 function that adds two numbers together:\n\n```javascript\nconst addNumbers = (a, b) => a + b;\n\n// Example usage:\nconsole.log(addNumbers(3, 4)); // Output: 7\n```\n\nThis function uses an arrow function to take two parameters, `a` and `b`, and returns their sum. You can call this function with any two numbers you want to add.';
````

- First let's update the normal JSON response

```js
else {
            const data = await response.json();
            // Log the response to the console
            console.log('data: ', data);
            // resultsContainer.innerHTML = data.message?.content;
            resultsContainer.innerHTML = `<p>${marked.parse(
                data.message?.content
            )}</p>`;
            Prism.highlightAll();
        }
```

- For streaming handle it in each chunk

```js
// inside forEach
if (content) {
  dataResult += content;
  // p.innerHTML = dataResult;
  // console.log(dataResult);
  const md = marked.parse(dataResult);
  // Add the content to the paragraph element;
  p.innerHTML = md;
  Prism.highlightAll();
}
```

- And voila! We have all the tools we need to work with a streamed response

## The tutorial will get you this same result. Ideas for further development

- This is one BIG function, how could you modularize it?
- We'll be transitioning this to React tomorrow
  - How could you recreate this exact app in React?
  - If you wanted to keep track of the message history, how could you do that?

## Going further - Keeping track of messages

- First we need a variable to store them in. Since the system message isn't from user input, let's start with it already there

```js
const messages = [
  {
    role: 'system',
    content: 'You are a software developer student that only speaks in rhymes' // This is the system message, it will control the behavior of the chatbot
  }
];
```

- Then, we make an object for the user message, and push it onto the array

```js
const userMsg = {
  role: 'user',
  content: promptValue // This is the user message, it will be the prompt for the chatbot
};
messages.push(userMsg);
console.log('messages in request: ', messages);
```

- And update or request body to take the messages array

```js
const response = await fetch('http://localhost:5050/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    mode: 'development', // Set the mode to development to not send the request to Open AI for now
    provider: 'open-ai'
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    stream: streamValue,
    messages
  })
});
```

- From here, handling the traditional JSON response is relatively straightforward.
- Show the data response and message property
- This message property has exactly what we need, so we again, just push it to the end

```js
else {
            const data = await response.json();
            // Log the response to the console
            // console.log('data: ', data);
            messages.push(data.message);
            console.log('messages after response: ', messages);

            // resultsContainer.innerHTML = data.message?.content;
            resultsContainer.innerHTML = `<p>${marked.parse(
                data.message?.content
            )}</p>`;
            Prism.highlightAll();
        }
```

### Where things get interesting is if we're streaming

- If we turn streaming on, and log at the data object we're getting back, it doesn't resemble our message object anymore.
- We're also only getting the content one piece at a time. So in order to store this we need to do a few things
  - We need to check if we're continuing a message, or starting a new message
  - If we're starting a new message we need to create an object, and set the content from our response
  - Else we're continuing a message, and need to find it and update it with the newest piece of the message

#### Making an assistant message object

- We know what the message object looks like. We know it's role is assistant, and we'll start it as an empty string

```js
const asstMsg = {
  role: 'assistant',
  content: ''
};
```

- Now inside of our `if (content)` block, we can update that message content, similar to the `dataResult`, and push the message to the end

```js
if (content) {
  dataResult += content;
  asstMsg.content += content;
  messages.push(asstMsg);
  console.log('streaming messages: ', messages);
}
```

#### Oop! We've got a bug in our code!

- Every time a new chunk is coming, it's pushing the whole thing to the end of the array
- In order to fix this, we need
  - Only push if we're starting a new message
  - A way to uniquely identify each message

##### How can we uniquely identify each message?

- We can add and id property! To make sure our data is consistent, we should add an id to all the messages
- We can use `crypto.randomUUID()` to give us a high chance the ids will be unique

```js
// at the top
const messages = [
  {
    id: crypto.randomUUID(),
    role: 'system',
    content: 'You are a software developer student that only speaks in rhymes' // This is the system message, it will control the behavior of the chatbot
  }
];
// line 36ish
const userMsg = {
  id: crypto.randomUUID(),
  role: 'user',
  content: promptValue // This is the user message, it will be the prompt for the chatbot
};

// inside if (streamValue)
const asstMsg = {
  id: crypto.randomUUID(),
  role: 'assistant',
  content: ''
};

// inside else
const asstMsg = { ...data.message, id: crypto.randomUUID() };
messages.push(asstMsg);
```

- Now that we have id's, we can check if the message we're working on previously exists. If it doesn't we do our original push

```js
if (content) {
  dataResult += content;
  asstMsg.content += content;
  const msgExists = messages.some(msg => msg.id === asstMsg.id);

  if (!msgExists) {
    messages.push(asstMsg);
  }
}
```

- Moving into React, there would be more considerations, but we'll dive more into that tomorrow
