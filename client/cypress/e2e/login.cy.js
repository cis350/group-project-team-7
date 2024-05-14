import Chance from 'chance';
const chance = new Chance();

describe('Login', () => {
    const username = chance.first();
    const password = "validpassword123";
    const serverUrl = "http://localhost:8080";
    
    beforeEach(() => {
        cy.visit(serverUrl);
    });

    it('contains expected title', () => {
        cy.contains('Moder Patshala');

        // check that login has a link to the signup page
        cy.contains('Sign up');
        cy.get('a').contains('Sign up').click();
        cy.url().should('include', '/signup');

    });

    it('login existing user', () => {
      cy.intercept('POST', '**/login*', (req) => {
        if (req.url.includes(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)) {
          req.reply({
            statusCode: 201,
            body: {
              message: 'Login successful',
              user: { username: username }
            }
          });
        } else {
          req.reply({
            statusCode: 400,
            body: 'Username or password is incorrect'
          });
        }
      }).as('loginAttempt');
      
      cy.get('input[name="Username"]').type(username);
      cy.get('input[name="Password"]').type(password);
      cy.get('button').contains('Continue').click();

      cy.wait('@loginAttempt').its('response.statusCode').should('eq', 201);
    });

    it('show feedback for incorrect login', () => {
      cy.intercept('POST', '**/login*', (req) => {
        if (req.url.includes(`username=${encodeURIComponent('nonexistent')}`)) {
          req.reply({
            statusCode: 400,
            body: 'Username does not exist'
          });
        }
      }).as('loginAttempt');

      cy.get('input[name="Username"]').type(username);
      cy.get('input[name="Password"]').type(password);
      cy.get('button').contains('Continue').click();

      cy.wait('@loginAttempt').its('response.statusCode').should('eq', 400);
      cy.contains('Username or password is incorrect');
    });
});

describe('Registration', () => {
  const username = chance.first();
  const password = "validpassword123";
  const serverUrl = "http://localhost:8080";

  beforeEach(() => {
      cy.visit('http://localhost:3000/signup');
  });

  it('contains expected title', () => {
      cy.contains('Create your account');

      // check that signup has a link to the login page
      cy.contains('Log in');
      cy.get('a').contains('Log in').click();
      cy.url().should('contains', '/login');
  });

  it('register new user', () => {
    cy.intercept('POST', '**/signup*', (req) => {
      if (req.url.includes(`username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)) {
        req.reply({
          statusCode: 201,
          body: {
            message: 'Registration successful',
            user: { username: username }
          }
        });
      } else {
        req.reply({
          statusCode: 400,
          body: 'Username already exists'
        });
      }
    }).as('registerAttempt');
    
    cy.get('input[name="Username"]').type(username);
    cy.get('input[name="Password"]').type(password);
    cy.get('button').contains('Continue').click();

    cy.wait('@registerAttempt').its('response.statusCode').should('eq', 201);
    cy.contains('Signed up!');
  });

  it('show feedback for existing user', () => {
    cy.intercept('POST', '**/signup*', (req) => {
      if (req.url.includes(`username=${encodeURIComponent(username)}`)) {
        req.reply({
          statusCode: 400,
          body: 'Username already exists'
        });
      }
    }).as('registerAttempt');

    cy.get('input[name="Username"]').type(username);
    cy.get('input[name="Password"]').type(password);
    cy.get('button').contains('Continue').click();

    cy.wait('@registerAttempt').its('response.statusCode').should('eq', 400);
    cy.contains('Username in use');
  });
})