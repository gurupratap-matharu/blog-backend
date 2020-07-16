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
    console.log(result)
    return result
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}