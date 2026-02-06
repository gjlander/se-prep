# Intro to Node

- Review environments in [LMS](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/javascript-basics/topic/%f0%9f%93%9a-intro-to-javascript/)
- So far, all we've really done is log things to the console in the browser. This week, we'll focus on how to use JS to actually interact with the web page.
- We won't dive into Node until we get to the backend, but for now it will give us a place to practice our JavaScript skills without having to worry about the web page yet. We can continue console logging things, without the extra setup. And even get some user input

## Running JS with Node

- Without Node, we had to make an HTML doc, and connect it to our JS file, then open the live server just to see our console logs. With node, we can trim things down to just our JS file, and stay in VS Code

- In the terminal, make sure I'm in the right folder
- Create hello.js, and add a console log

```js
console.log('Hello, world');
```

- Now, to run the code, I simply write `node hello.js`
- Remember if our environment is the browser, we find the console logs print to the console in the dev tools. For Node, console logs print to the terminal.

### Can do all of our JS abilities, still only see what gets logged

- Make new file `randomMsg.js`

```js
if (Math.random() > 0.5) {
  console.log('Omnomnomnomnom');
} else {
  console.log('Grrrrrrrrr!');
}
```

## Installing [Node](https://nodejs.org/en/download/package-manager)

- If you are on Windows, use the Prebuilt installer
- On mac, use Brew, and follow the commands (install v22)
- This will also install npm, which will become important later
- Once it is installed, I want you to confirm the node version, and npm version and comment it in a thread I'll make in slack

#### Work on the Node content, and JS Array Cardio today
