var _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    return blogs.map(blog => blog.likes).reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
    if (!blogs) {
        return {}
    }
    const reducer = (previous, current) => {
        return previous.likes > current.likes
            ? previous
            : current
    }
    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    const authorBlogCount = _.countBy(blogs, (blog) => blog.author)
    const topAuthor = Object.keys(authorBlogCount).pop()
    const topAuthorBlogCount = authorBlogCount[Object.keys(authorBlogCount).pop()]
    const result = {
        author: topAuthor,
        blogs: topAuthorBlogCount
    }
    return result
}

const mostLikes = (blogs) => {

    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    const topBlog = blogs.find(blog => blog.likes === maxLikes)
    const result = {
        'author': topBlog['author'],
        'likes': topBlog['likes']
    }
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}