require('dotenv').config()
const express = require('express')
const app = express()
const port = 4000

const githubData = {
    "login": "zeeshanalianjam",
    "id": 150502850,
    "node_id": "U_kgDOCPh9wg",
    "avatar_url": "https://avatars.githubusercontent.com/u/150502850?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/zeeshanalianjam",
    "html_url": "https://github.com/zeeshanalianjam",
    "followers_url": "https://api.github.com/users/zeeshanalianjam/followers",
    "following_url": "https://api.github.com/users/zeeshanalianjam/following{/other_user}",
    "gists_url": "https://api.github.com/users/zeeshanalianjam/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/zeeshanalianjam/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/zeeshanalianjam/subscriptions",
    "organizations_url": "https://api.github.com/users/zeeshanalianjam/orgs",
    "repos_url": "https://api.github.com/users/zeeshanalianjam/repos",
    "events_url": "https://api.github.com/users/zeeshanalianjam/events{/privacy}",
    "received_events_url": "https://api.github.com/users/zeeshanalianjam/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Zeeshan Ali Anjam",
    "company": "AlphaSloutions",
    "blog": "https://icoder.freewebhostmost.com",
    "location": "Tank,KPK,Pakistan",
    "email": null,
    "hireable": true,
    "bio": "I am passionate developer .\r\nMy journey is sooo crazy. I'm now on this time frontend developer at AlphaSloutions Software Tech Company .\r\nI'm work on Backend..",
    "twitter_username": null,
    "public_repos": 8,
    "public_gists": 0,
    "followers": 0,
    "following": 2,
    "created_at": "2023-11-11T04:57:38Z",
    "updated_at": "2024-07-08T06:05:57Z"
    }

app.get('/', (req, res) => {
  res.send('Home Page!')
})

app.get('/login' , (req, res) => {
    res.send('Login Page')
})

app.get('/signup' , (req, res) => {
    res.send('Signup Page')
})

app.get('/github', (req, res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})