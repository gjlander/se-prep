# Working with OpenAI's Chat Completion API

## Topics to cover

-   Nothing is truly secure on the frontend
-   Use of proxy to secure our API key
-   Signing Up for OpenAI
-   Working with our proxy
-   Making requests in Postman
    -   Work in development while configuring
    -   For production can use free credits (if available), or 5 euros would be more than enough to practice with this week
    -   You'll have a solo project where you'll get a token from WBS to work with

## Nothing is fully secure on the frontend

-   While working with OpenAI's API, you will have a secret key to identify yourself when you make requests (just like with TMDB)
-   To help keep our secret key for TMDB secure, in the React Router exercise, it was in a `.env.local` file, and we access that environmental variable instead of hard-coding it

```js
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        // create a .env.local file and add VITE_TMDB_KEY=<your tmdb auth key>
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    },
};
```

-   This is a huge step towards protecting our secret key, however nothing is truly secret on the frontend. Any code your write, and any information you use is visible somewhere
-   By keeping our secret key in the environment, it's at least not accessible to anyone anytime in GitHub. The key is now only accessible when the program is running, and when an actual request is being made
-   Go to network tab
    -   Show ALL code we wrote is available
    -   in `tmdb.js` that environmental variable is exposed
    -   we can also see it in the headers of the actual request
-   This is still an important security measure because now in order to see the key, a potential hacker would have to go to your site, and open up the network tab manually, and look for this information
    -   To my understanding, this is safe from things like web scrapers, but it it's not fully secure.
-   For something like TMDB, which is a free service, this is enough of a security measure. But for something like OpenAI, where this could potentially cost you thousands of euros, we need more security
-   In fact, for this reason OpenAI, along with some other APIs, won't even let you make a request to their API from the frontend.

### Well then, how do you make things secure?

-   The only way to truly hide information, is to send a request from a server on the backend.
-   In the coming weeks, you'll learn how to build your own backends, but for now, you will use a proxy provided for you.

### What is a proxy? go to [LMS article](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%97%9e%ef%b8%8f-proxying-requests/)

-   A proxy (or more specifically in our case, a reverse proxy) acts as a middle-man between the client and the server (in our case OpenAI's server)
-   Because this reverse proxy is itself a server, it can keep your OpenAI secret key fully secure.

## Working with our OpenAI Proxy

-   Today, you'll follow the tutorial in [Making your first request to OpenAI](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%a7%a9-making-your-first-request-to-openai/)
-   It can be a bit tricky, so I want to cover a few things before I have you try it

#### Walk through setting up an account

-   On signup you'll have a few more clicks, just follow the instructions on each page
-   Once signed in, you can either follow the direct link in the LMS to the API keys, or click on the `Dashboard`, then `API Keys`
-   Make sure to copy the key once you create it, as it won't be available to you again. if you forget to, or lose track of it, simply make a new key

### Cloning and setting up the proxy

-   Follow link to the repo, and follow steps in the README
-   Clicking the copy button adds weird symbols, so just highlight to copy/paste

#### Move to hidden screen to add my API key

-   Once I start the server, I see it is running on server 5050
-   I will never make requests to OpenAI directly, I always have to make sure this server is running, and send requests to it

### Making requests in Postman

-   Now that the server is running, let's open Postman to make some requests
-   Make a new collection, and new POST request to our base URL, since we're running on port 5050 `http://localhost:5050`
    -   And add the path listed in the README, so full endpoint is `http://localhost:5050/api/v1/chat/completions`

#### Adding the headers

-   As described in the README, we need to add 2 headers
    -   provider: open-ai
    -   mode: development
-   Always use development while you're testing and setting things up. This won't send a real request to OpenAI, but will make a mock response. You can use it to verify everything is working, and save your tokens for when you want to see something real
    -   If you don't get your free tokens, and don't want to pay for any (which is understandable), just stay in development mode for this week. You can do all of the exercises while in development, and for the AI project, you will get a token from Besslan you can use.
    -   We don't need to manually add `type: application/json`, since it is automatically generated for us

#### Adding the body

-   The README also provides an example of what we could put in the body of the request
-   Two properties are required

##### Model

-   We can specify which ChatGPT model we want to work with. We'll use `gpt-4o` like in the example
-   This is always a `string`

##### Messages

-   This is what allows OpenAI to keep track of the chat history
-   It is an array of objects with two properties
    -   role - can be `system`, `user`, or `assistant`
        -   The first item's role is always `system`. This is a prompt to style how the assistant should reply
        -   `user` - these are the messages the user inputs
        -   `assistant` - these are the replies from ChatGPT
    -   content - as it implies is the content of the message (or the prompt for the `system`)
-   There are other optional properties that we can explore soon.
-   Here is a stringified version of the example

```json
{
    "model": "gpt-4o",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Who won the world series in 2020?"
        },
        {
            "role": "assistant",
            "content": "The Los Angeles Dodgers won the World Series in 2020."
        },
        {
            "role": "user",
            "content": "Where was it played?"
        }
    ]
}
```

-   Because we are in development, we just get some dummy text, but it models what a response will look like
-   If we switch to production, we can see what a real response would be

#### Play around with different system prompts, and messages

## Changing the mock response content

-   There's a lot going on in the Proxy code. By the end of the backend block you'll be able to understand most of it!
-   For now though, the only change you'll want to make to it (aside from the .env file) is in utils > OpenAIMock.js
-   Some object oriented programming is being used to create these mock responses, we're only interested in the ChatMock
-   There's a lot that doesn't make sense, but if we go line by line, there's a lot that will make sense
    -   line 50 and 51 are validation, throwing an error if you don't have the required properties in the body
    -   line 53 is where we're assigning the actual text that will come back. If we edit this line, then make a new request, we get a new response
-   You can use this to model a specific response for testing purposes.
