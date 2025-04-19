describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.contains(/login/i);
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/auth/login').as('loginRequest');
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/auth/logout').as('logoutRequest');
    cy.intercept('POST', 'https://test2.ku-ai-instructor.azzammourad.org/favicon.ico').as('chapterLoaded');
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/quiz/practice_post/11').as('generateQuiz');

    cy.intercept('POST', 'https://api.heygen.com/v1/streaming.start').as('streamingStart');
  });

  it.only('PracticeQuiz_001, Verify Quizes are answered right', () => {

    //Generate Quiz with Azzam Teacher Account

    cy.get('input[name="username"]').type("azzam");
    cy.get('input[name="password"]').type("2025");
    cy.contains('button', 'Submit').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.get('h4').contains(/courses/i).should('exist');

    cy.get('a[href="/teacher/courses"] button').eq(2).click().click();
    cy.get('a[href="/teacher/quizzes/practice_quiz"]').click()
    cy.get('.css-1kbld div').eq(0).click()
    cy.get('.css-194gybb').click()
    cy.contains('button', /generate quiz/i).click();
    cy.get('.css-1pk1fka').eq(0).type(3)
    cy.get('.css-1pk1fka').eq(1).type(7)
    cy.contains('button',/submit/i).click()
    cy.wait('@generateQuiz').its('response.statusCode').should('eq',200)
    cy.get('.css-1mzzf4q').click()
    cy.contains('button',/logout/i).click()
    cy.wait('@logoutRequest').its('response.statusCode').should('eq', 200);



    cy.get('input[name="username"]').type("1020");
    cy.get('input[name="password"]').type("1020us");
    cy.contains('button', 'Submit').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.get('h4').contains(/courses/i).should('exist');

    cy.get('a[href="/student/practice_quiz"] button').click();
    cy.get('.css-1kbld div').first().click();
    cy.contains('button', /start quiz/i).click();

    // Loop until the current score equals the total
    cy.wrap(null).then(function checkScore() {
      return cy.get('div.css-7zyx8e p').eq(3)
        .invoke('text')
        .then((text) => {
          const [current, total] = text.trim().split(' / ').map(Number);

          if (current < total) {
            // Click a random answer
            cy.get('.css-lkjjpk').then((answers) => {
              const randomIndex = Math.floor(Math.random() * answers.length);
              cy.wrap(answers[randomIndex]).click();
            });

            // Submit and go to next question
            cy.contains('Submit').click();
            cy.contains(/next question/i).click();

            // Wait a bit for UI update, then recheck
            cy.wait(500);
            return checkScore(); // ⬅️ no named function, just a recursive .then
          }

          // Done with quiz, continue
          
        });
    });

  });

});