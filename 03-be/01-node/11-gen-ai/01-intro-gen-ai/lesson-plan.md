# Intro to Gen AI

## AI Providers

### Examples with Fetch vs SDK

- As Web Developers, all we're really doing is hitting an API endpoint. So even if we later add abstractions, what's really happening is a fetch request to an endpoint exposed by the provider
- All of these providers provide SDKs (Software Development Kits) for their APIs, so instead of making a fetch request, we make a new instance of `OpenAI` class, and use methods for our logic. Makes for a nicer DX. Since OpenAI's SDK is compatible with most other providers, we'll focus in on that one
  - Other providers might have limitations working with OpenAI's SDK vs their own, but that cross-compatibility is still real nice

## Prompt Engineering

- We'll cover structured responses in more detail soon, but we can use Zod (here it is again!) to make a schema to provide a detailed and reliable structured response
  - Note that the OpenAI SDK relies on Zod v3, so when installing, must use `npm i zod@3`
  - This means our types and Zod middleware will look slightly different than we're used to (another potential benefit of a microservices architecture)

### Prompting methods

- These mostly involve having a "hidden" message, or prefacing your own prompt message

## Simple server tour

### `package.json`

- Just had to add the OpenAI SDK library, and make sure to use Zod v3

### `app.ts`

- Same basic setup as always, here we have our `completionsRouter`

### `completionsRouter.ts`

- We have our 2 `POST` requests, and a `GET` requests
  - `POST` requests have Zod validation

## Chat controllers

- Where things get interesting is in the controllers
- We import `OpenAI` and create an instance of it using our API key
- We also store the model and systemInstruction in variables
  - For the free tier we'll stick with this model
  - we store our initial messages outside of the controller. The first message with role of `developer` or `system` is instructions for the AI
- We have a `messages` variable to simulate previous messages in the chat history. Important to note here is the structure
  - `role`: after initial message, will likely be either `user` or `model` tells who the message is from, you or the AI
  - `content`: the actual message

```js
const messages: ChatCompletionMessageParam[] = [
	{ role: 'developer', content: 'You are a helpful assistant' }
];
```

### `createSimpleChatCompletion`

- We destructure the prompt, as always

```js
const { prompt } = req.body;
```

- create an instance of the `OpenAI` class

```ts
const client = new OpenAI({
	apiKey: process.env.AI_API_KEY,
	baseURL: process.env?.AI_URL
});
```

- We push the user's message to our `messages` array

```ts
messages.push({ role: 'user', content: prompt });
```

- here is where we create the chat itself
  - it needs at least the model, and messages

```ts
const completion = await client.chat.completions.create({
	model: process.env.AI_MODEL || 'gemini-2.0-flash',
	messages
});
```

- We get to the deeply nested response text, with a fallback, and add it to our array

```ts
const completionText =
	completion.choices[0]?.message.content || 'No completion generated';

messages.push({ role: 'assistant', content: completionText });
```

- We still send back a JSON response with the ai's response

```js
res.json({ completion: completionText });
```

- All of this is built and modified from examples in the documentation

### Let's play around with this endpoint for a bit

## `createChatCompletion`

- Now we're moving from memory storage to an actual database
- We destructure `chatId` now as well

```js
const { prompt, chatId } = req.body;
```

- Now we query the database for that chat, we store it in `let` so we can update it if now chat is found

```js
let currentChat = await Chat.findById(chatId);
```

- Now instead of validating if `chatId` was passed, and separately if `chatId` was a valid ObjectId, and again if no chat came back, we consolidate that into one check
  - Did `Chat.findById` give us a chat? If not, create one
  - This could be a place to optimize if we ran into performance issues, but for now this is good enough

```ts
if (!currentChat) {
	const systemPrompt = {
		role: 'developer',
		content: 'You are a helpful assistant'
	};
	currentChat = await Chat.create({ history: [systemPrompt] });
}
```

- Now instead of pushing to our `messages` array that's in memory, we push to the DB (ensuring our model matches the structure given by OpenAI)

```ts
currentChat.history.push({
	role: 'user',
	content: prompt
});
```

### Let's diverge here to look at the `Chat` model

- Nothing crazy, just a `history` property that is an array of messages
- We use `enum` to ensure we only get options supported by OpenAI

### Back to the controller

- I'll admit this took some trial and error, but because `findById` returns an instance of the `Document` class from Mongoose, OpenAI doesn't like it
  - One way to `serialize`, or make a deep clone that is a plain JS object is to `stringify` and then `parse`
  - As noted, this gives us the same result as the `lean` option would, but since we later need to save, that won't work for us here

```ts
const completion = await client.chat.completions.create({
	model: process.env.AI_MODEL || 'gemini-2.0-flash',
	// stringifying and then parsing is like using .lean(). It will turn currentChat into a plain JavaScript Object
	// We don't use .lean(), because we later need to .save()
	messages: JSON.parse(JSON.stringify(currentChat.history))
});
```

- We then manually add the AI message to our database history, and save it

```js
const completionText =
	completion.choices[0]?.message.content || 'No completion generated';

currentChat.history.push({ role: 'assistant', content: completionText });

await currentChat.save();
```

- In our response, we add a `chatId`

```ts
res.json({ completion: completionText, chatId: currentChat._id.toString() });
```

#### Let's play around a bit, and see what gets stored now

## `getChatHistory`

- Nothing exciting here, let's test the endpoint
- This endpoint means that we can have persistence with the chat. A user could refresh the page, and not lose their chat history

# Your task: use the API to build a Chatbot with React

- Go over README and starter repo, ask for questions
- Go to DaisyUI docs
- Run server and show current version
