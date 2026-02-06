# Movie Diary (or Pokedex Diary) Kick-Off

## Agenda

-   Go over [project requirements](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%9b%a0%ef%b8%8f-movie-diary-or-pokedex/)
-   Walk through [TMDB Docs](https://developer.themoviedb.org/docs/getting-started)

## Project Requirements

-   The same for both options, just using a different API
-   Default to the Movie Diary, but can use Pokemon API if uncomfortable with having to sign up for TMDB
-   TMDB is blacklisted in India, so you have to use a VPN (has worked for another student), or do Pokedex

### Homepage

-   There is an endpoint in TMDB for searching, we'll go over that in a bit. The API for pokemon doesn't have a search endpoint, so it might not be as sophisticated, but you could still search by name or maybe id.
-   Search does not have to be at the top, and don't let the word `dialog` here make you feel like you have to use the HTML `dialog` component. Check out IMDB or other websites for inspiration on how you could display the search results
-   We will cover localStorage on Monday, it's the only missing piece to finish the project, but there's plenty to work on until then.

### Journal Page

-   Again, what's specific to localStorage will be covered on Monday, but manipulating favourites (adding or updating notes) will be basic array manipulation (The unique id's will be helpful here) not unique to localStorage
-   Only need to be able to add to favorites, and update notes in MVP. Once that's done, you could look into an option for deleting from favorites, and maybe having something different render based on if it's in favorites already or not

## TMDB Docs

-   The Pokemon API is a little easier to work through, but if a group decides for it and has questions, I can meet with your group to answer questions.

## Topics to cover

-   Signing up, finding docs
-   API Reference
-   Finding popular movies endpoint
-   Using images
-   Search endpoint

## Creating an account and finding the docs

-   Sign up with username and password
-   Confirm email, then request API key https://developer.themoviedb.org/docs/getting-started
-   Docs can be found through link in LMS, or TMDB -> More -> API

## API Reference

-   On the Docs Homepage Click `API Reference` tab
-   For code snippets, make sure to click JavaScript, if you don't see it listed, click the three dots
-   Show code snippet, click try it for getting started demo

### Popular movies endpoint

-   Along the left are all of the different endpoints
-   You'll need to scroll all the way down to `Movie Lists`, then choose popular
-   Demo try it, and show code snippet. This is working code that you can copy/paste, and then adjust to your specific needs
-   When you are signed in, it even gives you your API Key (later in the bootcamp we'll learn ways of keeping this secret, but for now it's pretty low risk to have it on GitHub)
-   Talk through the response, it gives you an object with some meta info, the results property is the actual array of movies

### Using images

-   Each movie is an object that has lots of information about the movie
-   Most of it is pretty straightforward, but you may notice the `poster_path` is missing the origin
-   To find the base URL, you have to go back to Guides, scroll down to Images -> basics
-   Copy the base URL, along with `poster_path` to demo how to use the poster_path
-   In your JS, you can do this by storing the base URL in a variable, and then concatenate it with the poster_path

### Search Endpoint

-   Again we have demo code
-   Demonstrate changing query params - type a movie and show how it updates the URL
-   This is the section you will need to be dynamic, you'll need to capture the user input, and pass it as an argument so the query matches the user input
-   You can see the response is basically identical to the popular endpoint.
