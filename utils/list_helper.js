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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}