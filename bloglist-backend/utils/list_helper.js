const { groupBy, toPairs, maxBy } = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => {
    return blogs
        .reduce((acc, o) => o.likes + acc, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    return blogs
        .reduce((best, current) => current.likes > best.likes ? current : best, blogs[0])
}

const groupAuthors = (blogs) => {
    const blogsByAuthor = groupBy(blogs, (blog) => blog.author)
    const pairs = toPairs(blogsByAuthor)
    return pairs
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const pairs = groupAuthors(blogs)
    const max = maxBy(pairs, (p) => p[1].length)

    return ({
        author: max[0],
        blogs: max[1].length
    })
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return undefined
    }

    const pairs = groupAuthors(blogs)
    const likesByAuthor = pairs.map(([author, arr]) => {
        return [ author, arr.reduce((acc, o) => o.likes + acc, 0) ]
    })
    const max = maxBy(likesByAuthor, ([_, likes]) => likes)

    return ({
        author: max[0],
        likes: max[1]
    })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}
