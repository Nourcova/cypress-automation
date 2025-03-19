describe('Feedback', () => {
    it('Send Feedback', () => {
        cy.visit('/')
        cy.contains(/login/i)
        cy.get('input[name=username]').type("102")
        cy.get('input[name=password]').type("102ah")
        // cy.get('button').contains(/submit/i).click()
        // cy.get('h3').contains(/courses/i).should('exist')

        cy.intercept('POST', 'https://papi.ku-ai-instructor.azzammourad.org/auth/login').as('loginRequest'); // Intercept the request

        cy.contains('button', 'Submit').click(); // Click the submit button

        cy.wait('@loginRequest') // Wait for the request to complete
            .its('response.statusCode').should('eq', 200); // Assert response status
        cy.get('h3').contains(/courses/i).should('exist')

        cy.get('button').contains(/provide feedback/i).click()
        cy.get('#alert-dialog-description').should('exist');
        cy.get('#alert-dialog-description').within(()=>{
            cy.get('div[role="combobox"]').click()
        })
    })
})