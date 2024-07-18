require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");



const posts = [
    {
        username: "Corn",
        password: "Yes",
        title: "Post 1"
    },
    {
        "username": "Jeff",
        "password": "CHECK",
        "title": "TestPost"
    }
    
]

app.use(bodyParser.json());
app.get('/posts', authenticateToken, (req, res) => {
    res.json(
        posts.filter(post => (
            post.username === req.user.name
        ))
    )
})
app.post('/login', (req,res) => {
    // Yes

    const username = req.body.username;
    const user = {
        name: username
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken})
})

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null){
        return res.sendStatus(401)
    }

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403);
        };
        req.user = user;
        next()
    })
}
app.listen(4000);