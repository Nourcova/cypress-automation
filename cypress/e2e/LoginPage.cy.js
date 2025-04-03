describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.contains(/login/i);
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/auth/login').as('loginRequest');
    cy.intercept('POST', 'https://test2.ku-ai-instructor.azzammourad.org/favicon.ico').as('chapterLoaded');
    cy.intercept('POST', 'https://api.heygen.com/v1/streaming.start').as('streamingStart');
  });

  it('LoginTC_001, Verify successful login with valid credentials', () => {

    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ah")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 200); // Assert response status
    cy.get('h3').contains(/courses/i).should('exist')
  })

  it('LoginTC_002, Verify error message for incorrect password', () => {
    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ahh")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 401); // Assert response status
    cy.contains(/incorrect username or password/i)
  })

  it('LoginTC_003, Verify error message for incorrect password', () => {
    cy.get('input[name=username]').type("no user")
    cy.get('input[name=password]').type("no pass")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 401); // Assert response status
    cy.contains(/incorrect username or password/i)
  })

  it('LoginTC_004, Verify login with empty username/password fields', () => {
    cy.get('button').should('be.disabled');
  })

  it('CoursesTC_004, Verify Resource button for each course, chapter and for each document is working', () => {
    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ah")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 200); // Assert response status
    cy.get('h3').contains(/courses/i).should('exist')

    cy.get('a[href="/student/courses/2"]').click();

    cy.get('h4').contains("Operating Systems").should('exist')

    cy.get('.css-69i1ev button').click()
    cy.get(".css-1l5fc5h li").last().should('contain.text', 'Give me the summary of this resource')

    cy.get(".css-105tbcy li:first-child .css-uwug0d").click()
    cy.get(".css-1l5fc5h li").last().should('contain.text', 'Give me the summary of this resource')

    cy.get("#panel1-header").click()
    cy.get(".css-1cbf1l2 button").click()
    cy.get(".css-1l5fc5h li").last().should('contain.text', 'Give me the summary of this resource')
  })

  it('CoursesTC_005, Verify Stard Session and End Session are working', () => {
    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ah")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 200); // Assert response status
    cy.get('h3').contains(/courses/i).should('exist')

    cy.get('a[href="/student/courses/2"]').click();

    cy.get('h4').contains("Operating Systems").should('exist')

    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Start Session']").should('exist')
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Interrupt']").should('have.attr', 'aria-disabled', 'true')
    cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Hold to Start Recording']").should('be.disabled')
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Start Session']").click()

    cy.wait('@streamingStart', { timeout: 40000 }).then((interception) => {
      if (interception.response.statusCode === 200) {
        // If the request is successful, check if "End session" exists
        cy.get('div[aria-label^="End Session"]', { timeout: 25000 }).should('exist')
        cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Interrupt']").should('not.be.disabled')
        cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Hold to Start Recording']").should('not.be.disabled')

        //  cy.get('div').contains('Starting Avatar Took too long, please try again!').should('not.exist')

      } else {
        // If the request fails, check that "End session" does NOT exist
        cy.get('div[aria-label^="End Session"]', { timeout: 25000 }).should('not.exist')
        //  cy.get('div').contains('Starting Avatar Took too long, please try again!').should('exist')
      }
    })

    cy.get('.css-qsg04 .css-yd8sa2 div[aria-label^="End Session"]').click();
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Start Session']").should('exist')
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Interrupt']").should('have.attr', 'aria-disabled', 'true')
    cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Hold to Start Recording']").should('be.disabled')
  })

  it('CoursesTC_006, Verify Record from the input is working', () => {
    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ah")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 200); // Assert response status
    cy.get('h3').contains(/courses/i).should('exist')

    cy.get('a[href="/student/courses/2"]').click();

    cy.get('h4').contains("Operating Systems").should('exist')

    cy.get('.css-y42r8g').trigger('mousedown')
    cy.get('.css-y42r8g').should('have.class', 'active')
    cy.get('.css-y42r8g').trigger('mouseup')
    cy.get('.css-y42r8g').should('not.have.class', 'active')
  })

  it('CoursesTC_007, Verify Record from Avatar is working', () => {
    cy.get('input[name=username]').type("102")
    cy.get('input[name=password]').type("102ah")

    cy.contains('button', 'Submit').click(); // Click the submit button

    cy.wait('@loginRequest') // Wait for the request to complete
      .its('response.statusCode').should('eq', 200); // Assert response status
    cy.get('h3').contains(/courses/i).should('exist')

    cy.get('a[href="/student/courses/2"]').click();

    cy.get('h4').contains("Operating Systems").should('exist')

    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Start Session']").should('exist')
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Interrupt']").should('have.attr', 'aria-disabled', 'true')
    cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Hold to Start Recording']").should('be.disabled')
    cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Start Session']").click()

    cy.wait('@streamingStart', { timeout: 40000 }).then((interception) => {
      if (interception.response.statusCode === 200) {
        // If the request is successful, check if "End session" exists
        cy.get('div[aria-label^="End Session"]', { timeout: 25000 }).should('exist')
        cy.get(".css-qsg04 .css-yd8sa2 div[aria-label^='Interrupt']").should('not.be.disabled')
        cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Hold to Start Recording']").should('not.be.disabled')
        //  cy.get('div').contains('Starting Avatar Took too long, please try again!').should('not.exist')

      } else {
        // If the request fails, check that "End session" does NOT exist
        cy.get('div[aria-label^="End Session"]', { timeout: 25000 }).should('not.exist')
        //  cy.get('div').contains('Starting Avatar Took too long, please try again!').should('exist')
      }
    })

    cy.get(".css-qsg04 .css-yd8sa2 > button").first().trigger('mousedown')
    cy.get(".css-qsg04 .css-yd8sa2 > button").first().should('not.be.disabled')
    cy.get(".css-qsg04 .css-yd8sa2 button[aria-label^='Release to Stop Recording']").should('exist')
    cy.get('.css-plk6wi video').should('have.css', 'outline', 'rgb(255, 193, 7) solid 5px')
    cy.get(".css-qsg04 .css-yd8sa2 > button").first().trigger('mouseup')
    cy.get(".css-qsg04 .css-yd8sa2 > button").first().should('not.have.attr', 'active')
    cy.get('.css-plk6wi video').should('not.have.css', 'outline', 'rgb(255, 193, 7) solid 5px')
    cy.get('.css-qsg04 .css-yd8sa2 div[aria-label^="End Session"]').click();

  })

})