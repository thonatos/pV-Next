describe('Navigation', () => {
  it('should navigate to the about page', () => {
    cy.visit('/');
    cy.get('main').contains('ρV - undefined project');
  });
});
