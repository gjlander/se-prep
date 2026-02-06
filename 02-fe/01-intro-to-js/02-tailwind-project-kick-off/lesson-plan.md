# Figma and Tailwind Project Kick-off

## Agenda

- Introduce [project](https://learn.wbscodingschool.com/courses/full-stack-web-app/lessons/module-project-figma-and-tailwindcss/topic/%f0%9f%9b%a0%ef%b8%8f-project-guidelines-and-requirements/)
- Show [demo figma](<https://www.figma.com/design/cJMWiom7k05yqZVF5F5ztJ/Find-Your-Dream-Home-Website-UI-Template-(Community)?node-id=0-1&p=f&t=gQ05uju4g3KNtzt9-0>)
- Review GitHub project start and workflow

## Project Info

- Same same, but different. You'll be turning a figma design into an actual HTML page, but this time you'll use TailwindCSS to style it
- You can either create your own figma design if you're feeling creative, or use one provided
- Choose either desktop or mobile first design (provided figma is desktop first), then if time allows, make it responsive (but remember you can already do a lot by using percentage values!)
- Your MVP is the landing page, but if there's time you could also consider adding an about or contact page
- Several resources are linked at the bottom of the page - the Tailwind links can be especially helpful as you learn to navigate around the docs

## Project Setup and GitHub Workflow

### Meet as a group to plan your project

### Setup the GitHub repo

1. Create the initial structure, with the skeleton setup, which should include
   - `index.html` docs with Tailwind CDN linked, and sections commented, and perhaps a basic skeleton layout
   - empty `tailwind.config.js` file for IntelliSense
2. `git init`, `git add .`, `git commit -m "first commit"` to initialize the local Git repo
3. Go to GitHub and create a new repo
   - Your personal account should be the owner
   - Make sure it is public
   - Copy the "…or push an existing repository from the command line" commands and run them
4. (New) On local, create dev branch and push it to GitHub. From now on, feature branches should merge into dev, and only dev should merge into main
5. Add branch protections
   - Protect `main` and `dev`
   - Block force pushes
   - Require a pull request before merging (0 or 1 depending on group consensus)
6. Invite other Group members as collaborators

### Collaborator and workflow

1. Click on the green `code` button, and copy the SSH link
2. Go to the parent directory you want this in (ideally a folder with your other bootcamp work)
3. In that directory, run `git clone <ssh_url>`, then checkout in `dev`
4. Run `git pull origin dev` to ensure the branch is up-to-date
5. Checkout into new feature branch and start working (make sure to commit and push anytime you'd like to save your work)
6. Once the feature is finished, open a PR on GitHub (make sure to the base is `dev`). If there are merge conflicts, go back and merge `dev` into your branch first using VS Code and deal with the merge conflicts there.
7. Double check the changes, and either close the PR yourself, or have a teammate approve it.
8. Inform all teammates, everyone else should commit their work, checkout into dev, pull, and merge dev into their branch
9. Once a large milestone is complete (for example, your MVP), merge `dev` into `main`
10. Deploy from `main` using GitHub Pages
