
describe('hist', () => {
    const username = "test"
    const password = "testestest"
    const serverUrl = 'http://localhost:3000'
  
    beforeEach(() => {
      // login using test account
      cy.visit(`${serverUrl}/login`)
      cy.get('input[name="Username"]').type(username)
      cy.get('input[name="Password"]').type(password)
      cy.get('button').contains('Continue').click()
      cy.url().should('include', '/form')

      // create a new form answer
      cy.intercept('POST', `**/update_answer*`).as('formSubmit');
  
      cy.get('#select1').select('Extremely Helpful');
      cy.get("#select1 option:selected")
        .invoke("text")
        .should("eq", "Extremely Helpful")
  
      cy.get('#select2').select('Very Helpful');
      cy.get("#select2 option:selected")
        .invoke("text")
        .should("eq", "Very Helpful")
  
      cy.get('#select3').select('I feel like I really belong');
      cy.get("#select3 option:selected")
        .invoke("text")
        .should("eq", "I feel like I really belong")
  
      cy.get('input').type('Great experience overall.');
      cy.get('button').contains('Submit').click();
  
      // check response code
      cy.wait('@formSubmit').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);
      });
  
      // Check for success toast
      cy.contains('Submitted Form!').should('be.visible');

    });
  
    it('can open history and see new post', () => {
        cy.intercept('GET', `**/get_user_answers*`).as('getAns');
        cy.get('button').contains('View History').click()

        cy.get('div').contains('Great experience overall.').should('be.visible');

        cy.wait('@getAns').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });

    it('can open history and delete new post', () => {
        cy.intercept('GET', `**/get_user_answers*`).as('getAns');
        cy.get('button').contains('View History').click()

        cy.get('div').contains('Great experience overall.').should('be.visible');

        cy.intercept('DELETE', `**/delete_one_answer*`).as('deleteAns');
        cy.get('button').contains('Delete').click()
        cy.contains('Deleted Answer!');

        cy.wait('@getAns').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
        cy.wait('@deleteAns').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });
  
  })