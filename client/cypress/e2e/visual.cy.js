
describe('visual', () => {
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
      cy.intercept('GET', `**/get_answers*`).as('getAnswers');
      cy.get('button').contains('View Visualization').click()

    //   cy.wait('@getAnswers').then((interception) => {
    //     expect(interception.response.statusCode).to.eq(200);
    //   });

    });
  
    it('can retrieve answer 1 successfully', () => {  
      cy.get('#answerSelector').select('Answer 1');
      cy.get("#answerSelector option:selected")
        .invoke("text")
        .should("eq", "Answer 1")
    })

    it('can retrieve answer 2 successfully', () => {
        cy.intercept('GET', `**/get_answers*`).as('getAnswers');
    
        cy.get('#answerSelector').select('Answer 2');
        cy.get("#answerSelector option:selected")
          .invoke("text")
          .should("eq", "Answer 2")
    
        // check response code
        // cy.wait('@getAnswers').then((interception) => {
        //   expect(interception.response.statusCode).to.eq(200);
        // });
      })

      it('can retrieve answer 3 successfully', () => {
        cy.intercept('GET', `**/get_answers*`).as('getAnswers');
    
        cy.get('#answerSelector').select('Answer 3');
        cy.get("#answerSelector option:selected")
          .invoke("text")
          .should("eq", "Answer 3")
    
        // check response code
      //   cy.wait('@getAnswers').then((interception) => {
      //     expect(interception.response.statusCode).to.eq(200);
      //   });
      })

  })