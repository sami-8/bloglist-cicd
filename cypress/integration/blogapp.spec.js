const CLIENT_PORT = Cypress.env('CLIENT_PORT')
const SERVER_PORT = Cypress.env('SERVER_PORT')
const clientUrl = `http://localhost:${CLIENT_PORT}`
const serverUrl = `http://localhost:${SERVER_PORT}`

describe('When not logged in', function () {
  describe('and visiting url paths', function () {
    it('front page can be opened', function () {
      cy.visit(clientUrl)
      cy.contains('BlogList')
    })

    it('login page can be opened', function () {
      cy.visit(`${clientUrl}/login`)
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('register page can be opened', function () {
      cy.visit(`${clientUrl}/register`)
      cy.contains('Sign up')
      cy.get('[data-cy=signup]').should('be.visible')
    })

    it('/blogs redirects to login page', function () {
      cy.visit(`${clientUrl}/blogs`)
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('/users redirects to login page', function () {
      cy.visit(`${clientUrl}/users`)
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('/blogs/:id redirects to login page', function () {
      cy.visit(`${clientUrl}/blogs/someid`)
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('/users/:id redirects to login page', function () {
      cy.visit(`${clientUrl}/users/someid`)
      cy.get('[data-cy=signin]').should('be.visible')
    })
  })

  describe('and navigating the website without being logged in', function () {
    beforeEach(function () {
      cy.visit(clientUrl)
    })

    it('front page can be opened', function () {
      cy.contains('Sign in')
        .click()
      cy.contains('BlogList').should('not.be.visible')

      cy.contains('Home')
        .click()
      cy.contains('BlogList').should('be.visible')
    })

    it('login page can be opened', function () {
      cy.contains('Sign in')
        .click()
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('register page can be opened', function () {
      cy.contains('Sign up')
        .click()
      cy.get('[data-cy=signup]').should('be.visible')
    })

    it('link to blogs redirects to login page', function () {
      cy.contains('Blogs')
        .click()
      cy.get('[data-cy=signin]').should('be.visible')
    })

    it('link to users redirects to login page', function () {
      cy.contains('Users')
        .click()
      cy.get('[data-cy=signin]').should('be.visible')
    })
  })
})

describe('When trying to register', function () {
  beforeEach(function () {
    cy.request('POST', `${serverUrl}/api/testing/reset`)
    cy.visit(`${clientUrl}/register`)
  })

  it('with proper input, user has registered successfully.', () => {
    cy.get('[data-cy=username]')
      .type('username')
    cy.get('[data-cy=name]')
      .type('name')
    cy.get('[data-cy=password]')
      .type('secret')
    cy.get('[data-cy=signup]')
      .click()

    cy.contains('Registration successful. You can now log in.')
  })

  it('username has to be at least 3 characters long.', () => {
    cy.get('[data-cy=username]')
      .type('12')
    cy.get('[data-cy=name]')
      .type('name')
    cy.get('[data-cy=password]')
      .type('secret')
    cy.get('[data-cy=signup]')
      .click()

    cy.contains('Registration successful. You can now log in.').should('not.be.visible')

    cy.get('[data-cy=username]')
      .type('3')
    cy.get('[data-cy=signup]')
      .click()
    cy.contains('Registration successful. You can now log in.')
  })

  it('password has to be at least 3 characters long.', () => {
    cy.get('[data-cy=username]')
      .type('123')
    cy.get('[data-cy=name]')
      .type('name')
    cy.get('[data-cy=password]')
      .type('12')
    cy.get('[data-cy=signup]')
      .click()

    cy.contains('Registration successful. You can now log in.').should('not.be.visible')
    cy.contains('Password should be at least 3 characters long.').should('be.visible')

    cy.get('[data-cy=password]')
      .type('3')
    cy.get('[data-cy=signup]')
      .click()
    cy.contains('Registration successful. You can now log in.')
  })

  it('all fields have to be filled with something else than whitespace.', function () {
    cy.get('[data-cy=signup]')
      .click()
    cy.contains('Please fill every field')

    cy.get('[data-cy=username]').type('aaa')
    cy.get('[data-cy=name]').type('aaa')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')
    cy.get('[data-cy=password]').clear().type('   ')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')

    cy.get('[data-cy=username]').clear()
    cy.get('[data-cy=name]').clear()
    cy.get('[data-cy=password]').clear()

    cy.get('[data-cy=username]').type('aaa')
    cy.get('[data-cy=password]').type('aaa')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')
    cy.get('[data-cy=name]').clear().type('   ')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')

    cy.get('[data-cy=username]').clear()
    cy.get('[data-cy=name]').clear()
    cy.get('[data-cy=password]').clear()

    cy.get('[data-cy=name]').type('aaa')
    cy.get('[data-cy=password]').type('aaa')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')
    cy.get('[data-cy=username]').clear().type('   ')
    cy.get('[data-cy=signup]').click()
    cy.contains('Please fill every field')
  })
})

describe('When trying to log in', function () {
  beforeEach(function () {
    cy.request('POST', `${serverUrl}/api/testing/reset`)
    const user = {
      name: 'root',
      username: 'root',
      password: 'sekret'
    }
    cy.request('POST', `${serverUrl}/api/users/`, user)
    cy.visit(`${clientUrl}/login`)
  })

  describe('with correct username and password', function () {
    it('user has successfully logged in', function () {
      cy.get('[data-cy=username]')
        .type('root')
      cy.get('[data-cy=password]')
        .type('sekret')
      cy.get('[data-cy=signin]')
        .click()
      cy.get('[data-cy=username]').should('not.be.visible')
      cy.contains('root logged in')
    })
  })

  describe('with wrong username or password', function () {
    it('incorrect username won\'t work', function () {
      cy.get('[data-cy=username]')
        .type('non-existing user')
      cy.get('[data-cy=password]')
        .type('pass')
      cy.get('[data-cy=signin]')
        .click()
      cy.contains('Wrong username or password')
    })

    it('incorrect password won\'t work', function () {
      cy.get('[data-cy=username]')
        .type('root')
      cy.get('[data-cy=password]')
        .type('wrongpass')
      cy.get('[data-cy=signin]')
        .click()
      cy.contains('Wrong username or password')
    })
  })
})

describe('When logged in', function () {
  beforeEach(function () {
    cy.request('POST', `${serverUrl}/api/testing/reset`)
    const user = {
      name: 'root',
      username: 'root',
      password: 'sekret'
    }
    cy.request('POST', `${serverUrl}/api/users/`, user)

    cy.visit(`${clientUrl}/login`)

    cy.get('[data-cy=username]')
      .type('root')
    cy.get('[data-cy=password]')
      .type('sekret')
    cy.get('[data-cy=signin]')
      .click()

    cy.get('[data-cy=signin]')
      .should('not.be.visible')
  })

  describe('and visiting url paths as a logged in user', function () {
    it('front page can be opened', function () {
      cy.visit(clientUrl)
      cy.contains('BlogList')
    })

    it('login page redirects to home', function () {
      cy.visit(`${clientUrl}/login`)
      cy.contains('Welcome root')
    })

    it('/blogs can be opened', function () {
      cy.visit(`${clientUrl}/blogs`)
      cy.contains('new blog')
    })

    it('/users can be opened', function () {
      cy.visit(`${clientUrl}/users`)
      cy.contains('Users')
      cy.contains('Username')
      cy.contains('Real name')
      cy.contains('Blogs added')
    })
  })

  describe('and attempting to submit a blog', function () {
    beforeEach(function () {
      cy.contains('Blogs')
        .click()

      cy.contains('BlogList')
        .should('not.be.visible')

      cy.contains('new blog')
        .click()
    })

    it('with all fields filled, a new blog is successfully created', function () {
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

    it('if some field contains only whitespace, cannot send a new blog', function () {
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

    it('if some field is empty, cannot send a new blog', function () {
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

