describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.contains(/login/i);
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/auth/login').as('loginRequest');
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/auth/logout').as('logoutRequest');
    cy.intercept('POST', 'https://test2.ku-ai-instructor.azzammourad.org/favicon.ico').as('chapterLoaded');
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/quiz/practice_post/11').as('generateQuiz');
    cy.intercept('POST', 'https://qapi.ku-ai-instructor.azzammourad.org/graded_quiz/teacher/1').as('generateGradedQuiz');

    cy.intercept('POST', 'https://api.heygen.com/v1/streaming.start').as('streamingStart');
  });

  let quizID = 0;
  it.only('GradedQuiz_001, Verify Quizzes are answered rtight', () => {

    //Generate Quiz with Azzam Teacher Account

    cy.get('input[name="username"]').type("azzam");
    cy.get('input[name="password"]').type("2025");
    cy.contains('button', 'Submit').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.get('h4').contains(/courses/i).should('exist');

    cy.get('a[href="/teacher/courses"] button').eq(2).click().click();
    cy.get('a[href="/teacher/graded_quiz"]').click()
    cy.contains('button', /add quiz/i).click()

    //fill in the inputs
    cy.get('input[name="title"]').type('test3')
    cy.get('input[name="time_limit"]').type('5')
    cy.get('input[name="course_weight"]').type('10')
    cy.get('input[name="is_visible_for_students"]').click()
    cy.contains('button', /submit/i).click()
    cy.wait('@generateGradedQuiz').its('response.statusCode').should('eq', 200)
    cy.wait(2000)
    cy.get('div[aria-colindex="1"]').eq(0).click().click()
    //Assert that the test is created
    cy.get('div[aria-colindex="2"]').eq(1).contains(/test3/i)
    cy.get('div[aria-colindex="1"]').eq(1).then((id) => {
      quizID = id.text()
    }).then(() => {
      cy.get(`a[href="/teacher/graded_quiz/${quizID}/questions"]`).click()
      cy.wait(2000)
      cy.url().should('eq', `https://test2.ku-ai-instructor.azzammourad.org/teacher/graded_quiz/${quizID}/questions`)
      cy.contains(/no rows/i)
      cy.contains('button', /generate question/i).click()
      //fill the form
      cy.get('input[name="multiple_choice_question"]').type(2)
      cy.get('input[name="true_false"]').type(8)
      cy.get('#mui-component-select-content_id').click()
      cy.get('.css-ubifyk li').first().click()
      cy.contains('button', /submit/i).click()
      cy.intercept('POST', `https://qapi.ku-ai-instructor.azzammourad.org/graded_quiz/teacher/${quizID}/generate_questions?content_id=7`).as('generateGradedQuestions');
      cy.wait('@generateGradedQuestions', { timeout: 35000 }).its('response.statusCode').should('eq', 200)
      cy.get('.css-1vouojk > div').should('have.length', 10)
      cy.get('.css-1mzzf4q').click()
      cy.contains('button', /logout/i).click()
      cy.wait('@logoutRequest').its('response.statusCode').should('eq', 200);
      //login as a student
      cy.get('input[name="username"]').type("1020");
      cy.get('input[name="password"]').type("1020us");
      cy.contains('button', 'Submit').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.get('h4').contains(/courses/i).should('exist');

      cy.get('.css-zmr5k1').eq(2).then(($el) => {
        if ($el.length) {
          cy.wrap($el).click();
        }
      });
      cy.get('body').then($body => {
        const $btn = $body.find('button:contains("Graded Quizzes")');
        if ($btn.length) {
          cy.wrap($btn).click();
        }
      });
      cy.contains('div', /test3/i).click()
      cy.contains('button', /start/i).click()

      //Answer randomly to the questions
      cy.get('.css-1ytbthu').each($div => {
        const $labels = $div.find('label');
        const randomIndex = Math.floor(Math.random() * $labels.length);
        cy.wrap($labels.eq(randomIndex)).click();
      });
      cy.contains('button', /submit/i).click()

      cy.get('.css-1yv1rpc').click()
      cy.contains('button', /logout/i).click()
      cy.wait('@logoutRequest').its('response.statusCode').should('eq', 200);
      //login as teacher
      cy.get('input[name="username"]').type("azzam");
      cy.get('input[name="password"]').type("2025");
      cy.contains('button', 'Submit').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.get('h4').contains(/courses/i).should('exist');

      cy.get('a[href="/teacher/courses"] button').eq(2).click().click();
      cy.get('a[href="/teacher/graded_quiz"]').click()
      cy.get(`a[href="/teacher/graded_quiz/${quizID}/submissions"]`).click()
      cy.contains('button', /correct submissions/i).click()
      cy.contains('button', /confirm/i).click()
      // cy.intercept('POST', `https://qapi.ku-ai-instructor.azzammourad.org/graded_quiz/teacher/${quizID}/correct`).as('correctTheQuiz')
      // cy.wait('@correctTheQuiz', { timeout: 35000 }).its('response.statusCode').should('eq', 200)
      cy.contains('button',/change grade visibility/i).click()
      cy.contains('button',/submit/i).click()

      cy.get('.css-1mzzf4q').click()
      cy.contains('button', /logout/i).click()
      cy.wait('@logoutRequest').its('response.statusCode').should('eq', 200);
      cy.get('input[name="username"]').type("1020");
      cy.get('input[name="password"]').type("1020us");
      cy.contains('button', 'Submit').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.get('h4').contains(/courses/i).should('exist');

      cy.get('.css-zmr5k1').eq(2).then(($el) => {
        if ($el.length) {
          cy.wrap($el).click();
        }
      });
      cy.get('body').then($body => {
        const $btn = $body.find('button:contains("Graded Quizzes")');
        if ($btn.length) {
          cy.wrap($btn).click();
        }
      });
      cy.contains('div', /test3/i).click()
      cy.contains(/failed|passed/i).should('exist');

    })



  });

});