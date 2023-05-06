describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.message')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
      }

      cy.contains('new blog').click()

      cy.get('#title').type(newBlog.title)
      cy.get('#author').type(newBlog.author)
      cy.get('#url').type(newBlog.url)
      cy.contains('create').click()

      cy.contains(`${newBlog.title} ${newBlog.author}`)
        .contains('view').click()
      cy.contains(`${newBlog.url}`)
      cy.contains('likes 0')
      cy.contains('Matti Luukkainen')
      cy.contains('remove')
    })

    describe('and several blogs exist', function () {
      beforeEach(function() {
        const blogs = [
          {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 7
          },
          {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
          },
          {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
            likes: 10
          },
          {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2
          }
        ]
        cy.createBlog(blogs[0])
        cy.createBlog(blogs[1])
        const anotherUser = {
          name: 'Arto Hellas',
          username: 'artolas',
          password: 'hellas'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)
        cy.login({ username: 'artolas', password: 'hellas' })
        cy.createBlog(blogs[2])
        cy.createBlog(blogs[3])
        cy.login({ username: 'mluukkai', password: 'salainen' })
      })

      it('User can like a blog', function() {
        cy.get('.blog').contains('React patterns').as('likedBlog')
        cy.get('@likedBlog').contains('view').click()
        cy.get('@likedBlog').contains('likes 7').get('.like-button').click()

        cy.get('@likedBlog').should('not.contain', 'likes 7')
        cy.get('@likedBlog').contains('likes 8')
        cy.get('.message').should('contain', 'Matti Luukkainen liked the blog "React patterns" by Michael Chan')
      })

      it('User who created a blog can delete it', function () {
        cy.get('.blog').contains('React patterns').as('deletedBlog')
        cy.get('@deletedBlog').contains('view').click()
        cy.get('@deletedBlog').contains('remove').click()

        cy.get('.blog').should('not.contain', 'React patterns')
        cy.get('.message').should('contain', 'Removed the blog "React patterns" by Michael Chan')
      })

      it('Only the creator can see the delete button of a blog, not anyone else', function () {
        cy.get('.blog').contains('React patterns').as('currentUserBlog')
        cy.get('.blog').contains('Type wars').as('anotherUserBlog')
        cy.get('@currentUserBlog').contains('view').click()
        cy.get('@anotherUserBlog').contains('view').click()

        cy.get('@currentUserBlog').contains('remove')
        cy.get('@anotherUserBlog').should('not.contain', 'remove')
      })

      it('Blogs are ordered according to likes with the blog with the most likes being first', function () {
        cy.get('.blog').eq(0).should('contain', 'Canonical string reduction')
  	    cy.get('.blog').eq(1).should('contain', 'First class tests')
  	    cy.get('.blog').eq(2).should('contain', 'React patterns')
  	    cy.get('.blog').eq(3).should('contain', 'Type wars')

        cy.get('.blog').contains('First class tests').as('likedBlog')
        cy.get('@likedBlog').contains('view').click()
        cy.get('@likedBlog').get('.like-button').as('likeButton')

        cy.get('@likeButton').click()
        cy.get('@likeButton').click()
        cy.get('@likeButton').click()

        cy.get('@likedBlog').contains('likes 13')
  	    cy.get('.blog').eq(0).should('contain', 'First class tests')
        cy.get('.blog').eq(1).should('contain', 'Canonical string reduction')
      })
    })
  })
})