# Prompt Chaining and Tool Calling

- One thing that's often necessary to get better response, is to add context specific to the question. We can provide additional context (such as information from an API) by chaining prompts together, and in a more sophisticated way, with tool calling. Let's first dive into Prompt Chaining

## Prompt Chaining

### Starting Point Tour

- Very similar to our `ai-simple-server`, we have a `completionsRouter`, and are using Zod v3
- We have a currently unused util, that will send the response as a stream or json (using `setHeader()` instead of `writeHead()` and no logic for chat history in DB or memory)
- In our controller, we are using local LLM in `development` and a real one in production (can of course be changed)

### Step 1: Interpret the User Request

- We're first going to check if a user is asking about pokemon, and we want a structured output for that, so we need to import the zod helper function

```ts
import type { RequestHandler } from 'express';
import { zodResponseFormat } from 'openai/helpers/zod'; // only new import
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
import type { z } from 'zod';
import { createOpenAICompletion } from '#utils';
import type { PromptBodySchema } from '#schemas';
import OpenAI from 'openai';
```

- We'll want to store the model in a variable, again based on if we're in production. I've set our `NODE_ENV` to production, and will be using `gemini-2.0-flash`

```ts
const client = new OpenAI({
	apiKey:
		process.env.NODE_ENV === 'development'
			? process.env.LOCAL_LLM_KEY
			: process.env.OPENAI_API_KEY,
	baseURL:
		process.env.NODE_ENV === 'development'
			? process.env.LOCAL_LLM_URL
			: undefined
});
// Model, we define it here so we can use it in both steps
const model =
	process.env.NODE_ENV === 'development'
		? process.env.LOCAL_LLM_MODEL!
		: process.env.OPENAI_MODEL!;
```

- We'll also set our initial messages array, and update our type import
  - note the first message is our instruction to the system

```ts
import type { ChatCompletionMessageParam } from 'openai/resources';

const messages: ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content:
			'You determine if a question is about Pokémon. You can only answer questions about a sinlge Pokémon and not open-ended questions.'
	},
	{
		role: 'user',
		content: prompt
	}
];
```

- Instead of `chat.completions.create()` we'll use `parse()`, since we want a structured output
  - we set temp to 0 to reduce randomness

```ts
// Step 1: Check if the prompt is about Pokémon
const checkIntentCompletion = await client.chat.completions.parse({
	model,
	messages,
	temperature: 0
});
```

- We can use the `zodResponseFormat` function to help us out, which means we need Zod schema

```ts
export const Intent = z.object({
	isPokemon: z.boolean(),
	type: z.string(),
	pokemonName: z.string(),
	reason: z.string()
});
```

- Then we import it, and use it to get a structured output

```ts
import { type PromptBodySchema, Intent } from '#schemas';

const checkIntentCompletion = await client.chat.completions.parse({
	model,
	messages,
	temperature: 0,
	response_format: zodResponseFormat(Intent, 'Intent')
});
```

- If we log the full thing, we see our familiar structure, with the choices array

```ts
console.log(checkIntentCompletion);
```

- We can then get to our deeply nested value, which should follow our Intent schema

```ts
console.log(intent);
```

- We can use our `isPokemon` property to check if they asked about a pokemon (which is all this Chat is allowed to do). So if it's not about Pokemon, we send back a 400 response

```ts
if (!intent?.isPokemon) {
	res.status(400).json({
		completion:
			intent?.reason ||
			'I cannot answer this question, try asking about a Pokémon.'
	});
	return;
}
```

- So at this stage, we get an actual response if they question was outside the scope of what the bot allows

- And add a log for our dev process

```ts
console.log(
	`\x1b[34mIntent detected. Received a question about: ${intent.pokemonName}\x1b[0m`
);
```

- Add the structured response to the messages array, so it's there to reference for step 2
  - `null` shouldn't be effecting much, the `2` adds some white space for readability

```ts
messages.push({
	role: 'assistant',
	content: JSON.stringify(intent, null, 2)
});
```

### Step 2 - Call the Pokemon API

- If the question is about a Pokemon, we'll make a request to the now-familiar PokeAPI. We'll use a wrapper library for convenience
- Install the library

```
npm i pokedex-promise-v2
```

- import the pokedex

```ts
import Pokedex from 'pokedex-promise-v2';
```

- create an instance of the `Pokedex` class, and get our pokemon data, and respond with an error if no data is found

```ts
// Step 2: Fetch the Pokémon data from the PokeAPI
const P = new Pokedex();
const pokemonData = await P.getPokemonByName(intent.pokemonName.toLowerCase());

if (!pokemonData) {
	res.status(404).json({
		completion: `Pokémon ${intent.pokemonName} not found.`
	});
	return;
}
console.log(`\x1b[32mFetched data for Pokémon: ${pokemonData.name}\x1b[0m`);
```

### Step 3: Generate the Final Answer

- Now we format what we want to get back from the chat, and make our schema

```ts
export const FinalResponse = z.object({
	id: z.number(),
	name: z.string(),
	aboutSpecies: z.string(),
	types: z.array(z.string()),
	abilities: z.array(z.string()),
	abilitiesExplained: z.string(),
	frontSpriteURL: z.string()
});
```

- import it, and create a DTO type for the response to update our generic

```ts
import { type PromptBodySchema, FinalResponse, Intent } from '#schemas';

type FinalResponseDTO = z.infer<typeof FinalResponse> | { completion: string };

export const createCompletion: RequestHandler<
	unknown,
	FinalResponseDTO,
	IncomingPrompt
> = async (req, res) => {};
```

- We send add a new message with instructions of how to shape the final response

```ts
// Step 3: Add the Pokémon data to the messages and generate a final response
messages.push({
	role: 'assistant',
	content: `This is all the relevant data about the Pokémon: ${
		intent.pokemonName
	}: ${JSON.stringify(pokemonData, null, 2)}
    Combine it with what you know about it to give the user a complete answer.`
});
console.log(
	`\x1b[33mAdded Pokémon data to messages for further processing.\x1b[0m`
);
```

- We call `parse()` again to get our next structured output, and then send back an error if something goes wrong, or the final response

```ts
const finalCompletion = await client.chat.completions.parse({
	model,
	messages,
	temperature: 0,
	response_format: zodResponseFormat(FinalResponse, 'FinalResponse')
});
const finalResponse = finalCompletion.choices[0]?.message.parsed;
if (!finalResponse) {
	res.status(500).json({
		completion: 'Failed to generate a final response.'
	});
	return;
}
res.json(finalResponse);
```

- Since we know exactly how the response will be structured, we could safely build UI based on that (i.e showing a card with the Pokemon)
- At this point, we are telling OpenAI when to call the PokeAPI, but we can abstract that into a tool for the AI to call

## Tool Calling

- The repo linked here is just the result from the Prompt Chaining Tutorial, so we'll just continue building on ours
- We'll need 2 functions to list as tools

  1.  `get_pokemon` - to call the PokeAPI
  2.  `return_error` - a fallback, just in case we run into a error, so we have proper error handling

- Let's first make a `types` folder for tome types we'll need

```ts
import type { z } from 'zod';
import type { FinalResponse, PromptBodySchema } from '#schemas';

export type IncomingPrompt = z.infer<typeof PromptBodySchema>;

export type ErrorResponseDTO = {
	success: false;
	error: string;
};
export type FinalResponseDTO =
	| z.infer<typeof FinalResponse>
	| ErrorResponseDTO
	| { completion: string };
```

- We can make those functions in our `utils` folder

```ts
import Pokedex from 'pokedex-promise-v2';
import type { ErrorResponseDTO } from '#types';

export const getPokemon = async ({
	pokemonName
}: {
	pokemonName: string;
}): Promise<Pokemon> => {
	console.log(
		`\x1b[35mFunction get_pokemon called with: ${pokemonName}\x1b[0m`
	);
	const P = new Pokedex();
	return await P.getPokemonByName(pokemonName.toLowerCase());
};

export const returnError = async ({
	message
}: {
	message: string;
}): Promise<ErrorResponseDTO> => {
	console.error(`\x1b[31mError: ${message}\x1b[0m`);
	return {
		success: false,
		error: message
	};
};
```

- Now we want to define these functions as tools for our model to use. This will come as an array of objects with specific properties
- We'll need to pass:
  - `type`: currently only `function` is supported, but that is what our tool is
  - `function`: a nested object with the rest of our properties
    - `strict`: will tell whether to strictly follow the schema defined in the `parameters` property
    - `name`: the name of the function
    - `description`: this is used by the model to determine when/how to call the function
    - `parameters`: another nested object where we describe the function parameters, follows a specific standard set by [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step)
      - `type`: data type (i.e string, array, object, etc.)
      - `description`: self-explanatory
      - `properties`: since this is an object, we also need to describe the properties
      - `required`: listing the properties that are required on our object
      - `additionalProperties`: a flag to indicate if other properties are allowed through

```ts
import type {
	ChatCompletionMessageParam,
	ChatCompletionTool
} from 'openai/resources';

const tools: ChatCompletionTool[] = [
	{
		type: 'function',
		function: {
			strict: true,
			name: 'get_pokemon',
			description: 'Get details for a single Pokémon by name',
			parameters: {
				type: 'object',
				description: 'The name of the Pokémon to get details for',
				properties: {
					pokemonName: {
						type: 'string',
						description: 'The name of the Pokémon to get details for',
						example: 'Pikachu'
					}
				},
				required: ['pokemonName'],
				additionalProperties: false
			}
		}
	},
	{
		type: 'function',
		function: {
			strict: true,
			name: 'return_error',
			description:
				'Return an error when the user asks something that is NOT about the weather.',
			parameters: {
				type: 'object',
				description: 'The reason why the question is not about Pokémon',
				properties: {
					message: {
						type: 'string',
						description: 'The reason why the question is not about Pokémon',
						example: 'This question is not about Pokémon.'
					}
				},
				required: ['message'],
				additionalProperties: false
			}
		}
	}
];
```

- Import our types, and our new utility functions

```ts
import type { RequestHandler } from 'express';
import { zodResponseFormat } from 'openai/helpers/zod'; // only new import
import type {
	ChatCompletionMessageParam,
	ChatCompletionTool
} from 'openai/resources';
import OpenAI from 'openai';
import Pokedex from 'pokedex-promise-v2';

import { getPokemon, returnError } from '#utils';
import { FinalResponse, Intent } from '#schemas';
import type { FinalResponseDTO, IncomingPrompt } from '#types';
```

- Now for our initial request checking for intent, we aren't using structured output, but instead calling our tool, so we need to pass it

```ts
// Step 1: Check if the prompt is about Pokémon
const checkIntentCompletion = await client.chat.completions.create({
	model,
	tools, // Pass the tools
	messages,
	temperature: 0
});
```

- As noted in the LMS, newer big models should handle this fine, but to help our our local models, we can add explicit instructions to our system prompt to use those tools

```ts
const messages: ChatCompletionMessageParam[] = [
	{
		role: 'system',
		content: `You determine if a question is about Pokémon. 
       If the user ask about a Pokémon, you will call the get_pokemon function to fetch data about it.
       If the question is not about Pokémon, you will call the return_error function with a reason why 
       the question is not about Pokémon.
      `
	},
	{
		role: 'user',
		content: prompt
	}
];
```

- and make it required (which is why we definitely need our fallback)

```ts
// Step 1: Check if the prompt is about Pokémon
const checkIntentCompletion = await client.chat.completions.create({
	model,
	tools,
	tool_choice: 'required',
	messages,
	temperature: 0
});
```

- At this stage, we always get our error fallback, no matter what we ask, but with the local model, we can peak under the hood to see the reasoning (demo logs in LM Studio)

- We'll still want to store the response, and send an error response if there is no message
  - we can see the message is of type `assistant`, and instead of `content` has a `tool_calls` property

````ts
 // Check if the completion has a message
  const checkIntentCompletionMessage = checkIntentCompletion.choices[0]?.message;
  // Early return if no message is found
  if (!checkIntentCompletionMessage) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate a response from the model.'
    });
    return;
  }
  console.log(checkIntentCompletionMessage);
	```
````

- We add the message to our `messages` array

```ts
// Add the check intent message to the messages array to enrich the context for the next steps
messages.push(checkIntentCompletionMessage);
```

- Since we can have a variable number of tools, we loop over all of them (we pass an empty array as a fallback)

```ts
// Since a model response can contain zero, one, or multiple tool calls, we iterate through them
// This is the official recommendation from OpenAI to handle tool calls <https://platform.openai.com/docs/guides/function-calling#handling-function-calls>
for (const toolCall of checkIntentCompletionMessage.tool_calls || []) {
	console.log(toolCall);
}
```

- In our log we can see what each `toolCall` looks like, we cna use those properties to create a control flow with various `if` conditions
- The first is if the `type` is `function`. We'll store the name in a variable, and parse our function arguments

```ts
if (toolCall.type === 'function') {
	const name = toolCall.function.name;
	const args = JSON.parse(toolCall.function.arguments);
	console.log(
		`\x1b[36mTool call detected: ${name} with args: ${JSON.stringify(
			args
		)}\x1b[0m`
	);
}
```

- Then based on the name, we call the corresponding function

```ts
if (name === 'get_pokemon') {
	await getPokemon({ pokemonName: args.pokemonName });
}
if (name === 'return_error') {
	await returnError({ message: args.message });
}
```

- We'll want to store the result in a variable, we can initialize one as an empty string
  - We'll also need to import the needed types

```ts
import Pokedex, { type Pokemon } from 'pokedex-promise-v2';

import { getPokemon, returnError } from '#utils';
import { FinalResponse, Intent } from '#schemas';
import type {
	FinalResponseDTO,
	IncomingPrompt,
	ErrorResponseDTO
} from '#types';

let result: Pokemon | ErrorResponseDTO | string = '';
if (name === 'get_pokemon') {
	result = await getPokemon({ pokemonName: args.pokemonName });
}
if (name === 'return_error') {
	result = await returnError({ message: args.message });
}
```

- We'll then push this message to our `messages` array, and add the result as `content`

```ts
messages.push({
	role: 'tool',
	tool_call_id: toolCall.id,
	content: result.toString()
});
```

- We have the tool call in our messages array (and it would get filtered out now based on our current FE logic for showing the chat)

```ts
console.log(messages);
```

- We can now basically get rid of our old Step 2, and skip right to the final response
- We'll need to update our Zod Schema to reflect to handle all possible scenarios

```ts
export const FinalResponse = z.object({
	isPokemon: z.boolean(),
	pokemonInfo: z
		.object({
			id: z.number(),
			name: z.string(),
			aboutSpecies: z.string(),
			types: z.array(z.string()),
			abilities: z.array(z.string()),
			abilitiesExplained: z.string(),
			frontSpriteURL: z.string()
		})
		.optional()
		.nullable(),
	error: z.string().optional().nullable()
});
```
