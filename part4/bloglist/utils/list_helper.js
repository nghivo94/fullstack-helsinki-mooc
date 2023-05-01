const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs ? blogs.map(blog => blog.likes).reduce((aggSum, newEle) => {return aggSum + newEle}, 0)
        : 0
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    
    const favorite = blogs.filter(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))[0]
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const authorBlogs = {}
    blogs.forEach(blog => {
        if (blog.author in authorBlogs) {
            authorBlogs[blog.author] = authorBlogs[blog.author] + 1
        }
        else {
            authorBlogs[blog.author] = 1
        }
    })
    const mostAuthorBlogs = Object.keys(authorBlogs).filter(author => authorBlogs[author] === Math.max(...Object.values(authorBlogs)))[0]
    return {
        author: mostAuthorBlogs,
        blogs: authorBlogs[mostAuthorBlogs]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const authorLikes = {}
    blogs.forEach(blog => {
        if (blog.author in authorLikes) {
            authorLikes[blog.author] = authorLikes[blog.author] + blog.likes
        }
        else {
            authorLikes[blog.author] = blog.likes
        }
    })
    const mostAuthorLikes = Object.keys(authorLikes).filter(author => authorLikes[author] === Math.max(...Object.values(authorLikes)))[0]
    return {
        author: mostAuthorLikes,
        likes: authorLikes[mostAuthorLikes]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}