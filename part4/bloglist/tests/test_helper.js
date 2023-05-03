const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
    {
        username: "root",
        password: "secret"
    },
    {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "salainen"
    }
]

const validLogin = {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen"
}

const invalidUsernameLogin = {
    username: "unknown",
    password: "salainen"
}

const invalidPasswordLogin = {
    username: "mluukkai",
    password: "wrongpassword"
}

const validNewUser = {
    username: "artohellas",
    name: "Arto Hellas",
    password: "sallehotra"
}

const missingUsernameNewUser = {
    name: "Arto Hellas",
    password: "sallehotra"
}

const shortUsernameNewUser = {
    username: "ar",
    name: "Arto Hellas",
    password: "sallehotra"
}

const nonUniqueUsernameNewUser = {
    username: "root",
    password: "something"
}

const missingPasswordNewUser = {
    username: "artohellas",
    name: "Arto Hellas",
}

const shortPasswordNewUser = {
    username: "artohellas",
    name: "Arto Hellas",
    password: "sa"
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const userWithBlogs = async () => {
    const users = await User.find({})
    return users[0]
}

const generateValidToken = async () => {
    const users = await User.find({})
    const userWithBlogs = users[0]
    const userForToken = {
        username: userWithBlogs.username,
        id: userWithBlogs._id
    }
    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    return token
}

const generateInvalidToken = () => {
    const token = jwt.sign(
        {username: "something", id: "something"}, 
        "some random string",
        { expiresIn: 60*60 }
    )

    return token
}

const generateMismatchedToken = async () => {
    const users = await User.find({})
    const userWithoutBlogs = users[1]
    const userForToken = {
        username: userWithoutBlogs.username,
        id: userWithoutBlogs._id
    }
    const token = jwt.sign(
        userForToken, 
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    return token
}

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }  
]

const validNewBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
}

const validNoLikesNewBlog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
}

const missingTitleNewBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
}

const missingURLNewBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialUsers, validLogin, invalidUsernameLogin, invalidPasswordLogin,
    validNewUser, missingUsernameNewUser, shortUsernameNewUser, nonUniqueUsernameNewUser,
    missingPasswordNewUser, shortPasswordNewUser,
    usersInDb, userWithBlogs, generateValidToken, generateInvalidToken, generateMismatchedToken,
    initialBlogs, validNewBlog, validNoLikesNewBlog, missingTitleNewBlog, missingURLNewBlog, 
    blogsInDb
}