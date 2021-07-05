const listHelper = require('../utils/list_helper')
const testHelper = require('../utils/test_helper')    

const listWithOneBlog = testHelper.listWithOneBlog
const blogs = testHelper.blogs

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })
    
    test('of list with multiple blogs is calculated correctly', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

})

describe('favorite blog', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual(undefined)
    })

    test('of list with one element is the only element in the list', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
    })
    
    test('of list with multiple blogs is calculated correctly', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blogs[2])
    })
})

describe('most blogs', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual(undefined)
    })

    test('of list with one element is the only element in the list', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        const expected = { author: 'Edsger W. Dijkstra', blogs: 1 }
        expect(result).toEqual(expected)
    })
    
    test('of list with multiple blogs is calculated correctly', () => {
        const result = listHelper.mostBlogs(blogs)
        const expected = { author: 'Robert C. Martin', blogs: 3 }
        expect(result).toEqual(expected)
    })
})


describe('most likes', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual(undefined)
    })

    test('of list with one element is the only element in the list', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        const expected = { author: 'Edsger W. Dijkstra', likes: 5 }
        expect(result).toEqual(expected)
    })
    
    test('of list with multiple blogs is calculated correctly', () => {
        const result = listHelper.mostLikes(blogs)
        const expected = { author: 'Edsger W. Dijkstra', likes: 17 }
        expect(result).toEqual(expected)
    })
})
