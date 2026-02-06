# HTTP Requests

## Points to cover

- HTTP methods
- - GET what they've been using
- - POST - to create a new resource
- - PUT - to update a resource
- - DELETE - to delete a resource
- Postman
- Fetch options

## HTTP Methods

### GET

- This is mainly what we've been working with so far
- Any URL put in the browser is making a GET request, so we could put our endpoints there to see what the response will be.
- Demo with DuckPond `https://duckpond-89zn.onrender.com/ducks/`

#### In order to use any other method, we'd have to write JS for it, and potentially build a UI. For testing and debugging this might not be practical.

### So we can use an HTTP Client: Postman

- Postman allows us to make HTTP requests without having to use our browser. We can pass data, and test.
- It's important to note that it doesn't have the security measures that your browser has, so only put in URLs you are confident are safe

#### Making a Collection

- You can see I already have several collections, this is a way to organize your requests
- Demo making a new collection with RE, called `DuckPond-Deployed`
- Then I can click `Add a request` to make a new request
- Demo Naming the request

#### Making a GET Request

- If I copy/paste that same URL and click `Send`
- I can see the response body, I can look at the Headers for more information, and I can see the response code
- Make a second request to single duck. I can see, just like in the browser, what the response is.
  - Note the addition of the owner property to the duck, this will come into play soon.

### POST

- If I change the method for the ducks endpoint, I get a different result
- On the same URL, I can use each of the HTTP methods to have something different happen
- What happens with each method on each endpoint would be in the documentation for that API (since I made this, I know what's needed)

#### Authentication and Authorization

- Some endpoints are protected. I wouldn't want any random person to be able to make a new duck, delete ducks, etc.
- This means I have to
  1. Authenticate the user - verify they are who they say they are
  2. Authorize the user - check if that user is allowed this operation
- You'll learn how to implement this at the end of the Backend block.
- For now, you can see I've created a few `auth` endpoints

### Adding to the body

- In a post request, you usually need to send accompanying information. On an app, this would usually come from a form. In Postman, we can add the data as raw json directly
- Susan Storm is one of our users, let's see what happens when she signs in
- We don't want to store sensitive information on the client, so we can use this token to encrypt some basic info. Later, we'll save this in local storage.

### Creating a new Duck

- Now we can add that token to the Headers (headers are meta-data about the request)
- Add Authorization header, `Bearer token`
- Where have you seen something like this before?
  - This is exactly what was happening when you made requests to TMDB
- Now we get a new error, because we don't have any duck info
- I've got some duck info prepared (note the addition of the owner property)

```json
{
  "name": "Quacksart",
  "imgUrl": "https://amsterdamduckstore.com/wp-content/uploads/2024/08/Mo-Rubber-Duck-Amsterdam-Duck-Store-front-e1725026098270.jpg",
  "quote": "Listening to your bugs is music to my ears!",
  "owner": "67a35cfd4348fa83ccb275bc"
}
```

- In our response, we get the newly created duck, and a 201, the response that means 'successfully created'

### PUT

- A put request will look very similar, we'll have the information to update in the body of the request

### DELETE

- Delete requests don't need anything in the body of the request

## Introduction to [API for group project](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/%f0%9f%9b%a0%ef%b8%8f-event-scheduler/)

- Demo running locally to show documentation
- Play around with it in Postman
- Has useful doc with swagger, but wanted to show postman already since we'll be using it in the backend

# End Here For Lecture
