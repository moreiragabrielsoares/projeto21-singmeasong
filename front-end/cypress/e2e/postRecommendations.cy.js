import { faker } from '@faker-js/faker';

describe('Test for post new recommendation', () => {
    it('Testa se cadastra um usuário com sucesso', () => {
    const newRecommendation = {
        name: faker.lorem.words(2),
        youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y8",
    };
  
    cy.visit('http://localhost:3000/');
    cy.intercept('GET', 'http://localhost:5000/recommendations').as('getRecommendations');
    cy.wait('@getRecommendations');


    cy.get('input[placeholder="Name"]').type(newRecommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(newRecommendation.youtubeLink);

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('postNewRecommendation');
    cy.intercept('GET', 'http://localhost:5000/recommendations').as('getRecommendations');

    cy.get('#enter').click();

    cy.wait('@postNewRecommendation');
    cy.wait('@getRecommendations');

    cy.url().should('equal', 'http://localhost:3000/');
    });
});