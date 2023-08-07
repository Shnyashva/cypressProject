import { mockRequests } from './mock'

context('Написание теста в рамках домашнего задания', function () {

    beforeEach(function () {
        mockRequests()
        cy.visit('/')
        cy.intercept('POST', '**/message').as('message')
    })

    function fillForm() {
        cy.fixture('automationinTesting/testmessage.json').then((message) => {
            cy.get('[data-testid="ContactName"]').type(message.name)
            cy.get('[data-testid="ContactEmail"]').type(message.email)
            cy.get('[data-testid="ContactPhone"]').type(message.phone)
            cy.get('[data-testid="ContactSubject"]').type(message.subject)
            cy.get('[data-testid="ContactDescription"]').type(message.description)
            cy.get('#submitContact').click()
        })
    }

    it('Тестирование корректности заполнения формы', () => {
        fillForm()
        cy.wait('@message').should(xhr => {
            expect(xhr.response.body).have.property('description', 'description test message')
            expect(xhr.response.body).have.property('subject', 'This is a subject')
            expect(xhr.response.body).have.property('phone', '88005553535')
            expect(xhr.response.body).have.property('email', 'email@mail.com')
            expect(xhr.response.body).have.property('name', 'Vasya')
        })
        cy.get('.contact').children().should('contain', 'Thanks for getting in touch Vasya!')
            .and('contain', 'This is a subject')
    })
})