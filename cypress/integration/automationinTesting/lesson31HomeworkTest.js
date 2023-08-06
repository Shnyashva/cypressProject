import { mockRequests } from './mock'

context('Написание теста в рамках домашнего задания', function () {

    beforeEach(function () {
        mockRequests()
        cy.intercept('GET', '**/branding', { fixture: 'automationinTesting/branding.json' }).as('branding')
        cy.intercept('GET', '**/room', { fixture: 'automationinTesting/room.json' }).as('room')
        cy.intercept('POST', '**/message', { statusCode: 201, fixture: 'automationinTesting/testmessage.json' }).as('message')
        cy.visit('/')
    })

    function fillForm() {
        cy.wait(['@branding', '@room'])
        cy.get('[data-testid="ContactName"]').type('Vasya')
        cy.get('[data-testid="ContactEmail"]').type('email@mail.ru')
        cy.get('[data-testid="ContactPhone"]').type('33344455512')
        cy.get('[data-testid="ContactSubject"]').type('subject')
        cy.get('[data-testid="ContactDescription"]').type('TextText')
        cy.get('#submitContact').click()
    }

    it('Тестирование корректности заполнения формы', () => {
        fillForm()
        cy.wait('@message')
        cy.get('.contact').children().should('contain', 'Thanks for getting in touch Vasya!')
            .and('contain', 'subject')
    })
})