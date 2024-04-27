
describe('form', () => {
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
  });

  it('can select each option in each form field', () => {
    cy.get('#select1').children('option').each((option) => {
      const value = option.val();
      if (value) {
        cy.get('#select1').select(value);
        cy.get('#select1').should('have.value', value);
      }
    });

    cy.get('#select2').children('option').each((option) => {
      const value = option.val();
      if (value) {
        cy.get('#select2').select(value);
        cy.get('#select2').should('have.value', value);
      }
    });

    cy.get('#select3').children('option').each((option) => {
      const value = option.val();
      if (value) {
        cy.get('#select3').select(value);
        cy.get('#select3').should('have.value', value);
      }
    });

    cy.get('input').type('Great experience overall.');
    cy.get('input').should('have.value', 'Great experience overall.');
  });

  it('can fill out and submit form successfully', () => {
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
  })

  it('shows error if form is not completely filled out', () => {
    cy.get('button').contains('Submit').click();
    cy.contains('Please answer all the questions').should('be.visible');

    cy.get('#select1').select('Extremely Helpful');
    cy.get("#select1 option:selected")
      .invoke("text")
      .should("eq", "Extremely Helpful")

    cy.get('#select2').select('Very Helpful');
    cy.get("#select2 option:selected")
      .invoke("text")
      .should("eq", "Very Helpful")

    cy.get('input').type('I enjoyed the experience.');

    cy.get('button').contains('Submit').click();
    cy.contains('Please answer all the questions').should('be.visible');
  });
})