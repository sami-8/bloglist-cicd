
describe('When not logged in', function() {
    describe('and visiting url paths', function() {
        it('front page can be opened', function() {
            cy.visit('http://localhost:3000')
            cy.contains('BlogList App')
        })

        it('login page can be opened', function() {
            cy.visit('http://localhost:3000/login')
            cy.contains('Sign in')
        })

        it('/blogs redirects to login page', function() {
            cy.visit('http://localhost:3000/blogs')
            cy.contains('Sign in')
        })

        it('/users redirects to login page', function() {
            cy.visit('http://localhost:3000/users')
            cy.contains('Sign in')
        })

        it('/blogs/:id redirects to login page', function() {
            cy.visit('http://localhost:3000/blogs/someid')
            cy.contains('Sign in')
        })

        it('/users/:id redirects to login page', function() {
            cy.visit('http://localhost:3000/users/someid')
            cy.contains('Sign in')
        })
    })

    describe('and navigating the website without being logged in', function() {
        beforeEach(function() {
            cy.visit('http://localhost:3000')
        })

        it('front page can be opened', function() {
            cy.contains('login')
                .click()
            cy.contains('BlogList App').should('not.be.visible')

            cy.contains('home')
                .click()
            cy.contains('BlogList App').should('be.visible')
        })

        it('login page can be opened', function() {
            cy.contains('login')
                .click()
            cy.contains('Sign in')
        })

        it('link to blogs redirects to login page', function() {
            cy.contains('blogs')
                .click()
            cy.contains('Sign in')
        })

        it('link to users redirects to login page', function() {
            cy.contains('users')
                .click()
            cy.contains('Sign in')
        })
    })
})

describe('When trying to log in', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'root',
            username: 'root',
            password: 'sekret'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000/login')
    })

    describe('with correct username and password', function() {
        it('user has successfully logged in', function() {
            cy.get('[data-cy=username]')
                .type('root')
            cy.get('[data-cy=password]')
                .type('sekret')
            cy.contains('Sign in')
                .click()
            cy.contains('root logged in')
        })
    })

    describe('with wrong username or password', function() {
        it('incorrect username won\'t work', function() {
            cy.get('[data-cy=username]')
                .type('non-existing user')
            cy.get('[data-cy=password]')
                .type('pass')
            cy.contains('Sign in')
                .click()
            cy.contains('Wrong username or password')
        })

        it('incorrect password won\'t work', function() {
            cy.get('[data-cy=username]')
                .type('root')
            cy.get('[data-cy=password]')
                .type('wrongpass')
            cy.contains('Sign in')
                .click()
            cy.contains('Wrong username or password')
        })
    })
})

describe('When logged in', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'root',
            username: 'root',
            password: 'sekret'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.visit('http://localhost:3000/login')

        cy.get('[data-cy=username]')
            .type('root')
        cy.get('[data-cy=password]')
            .type('sekret')
        cy.contains('Sign in')
            .click()

        cy.contains('Sign in')
            .should('not.be.visible')
    })

    describe('and visiting url paths as a logged in user', function() {
        it('front page can be opened', function() {
            cy.visit('http://localhost:3000')
            cy.contains('BlogList App')
        })

        it('login page redirects to home', function() {
            cy.visit('http://localhost:3000/login')
            cy.contains('Welcome root')
        })

        it('/blogs can be opened', function() {
            cy.visit('http://localhost:3000/blogs')
            cy.contains('new blog')
        })

        it('/users can be opened', function() {
            cy.visit('http://localhost:3000/users')
            cy.contains('Users')
            cy.contains('Username')
            cy.contains('Real name')
            cy.contains('Blogs added')
        })
    })

    describe('and attempting to submit a blog', function() {
        beforeEach(function() {
            cy.contains('blogs')
                .click()

            cy.contains('BlogList App')
                .should('not.be.visible')

            cy.contains('new blog')
                .click()
        })

        it('with all fields filled, a new blog is successfully created', function() {
            cy.get('[data-cy=blogtitle]')
                .type('blog name')
            cy.get('[data-cy=blogauthor]')
                .type('blog author')
            cy.get('[data-cy=blogurl]')
                .type('blog url')
            cy.contains('send')
                .click()

            cy.contains('a new blog created')
            cy.contains('blog name')
        })

        it('if some field contains only whitespace, cannot send a new blog', function() {
            cy.get('[data-cy=blogtitle]')
                .type('     ')
            cy.get('[data-cy=blogauthor]')
                .type('blog author')
            cy.get('[data-cy=blogurl]')
                .type('blog url')
            cy.contains('send')
                .click()

            cy.contains('Please fill every field')
        })

        it('if some field is empty, cannot send a new blog', function() {
            cy.get('[data-cy=blogauthor]')
                .type('blog author')
            cy.get('[data-cy=blogurl]')
                .type('blog url')
            cy.contains('send')
                .click()

            cy.contains('Please fill every field')
        })
    })
})

