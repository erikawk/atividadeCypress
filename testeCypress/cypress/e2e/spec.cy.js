// Padrões ---------------------------------------------------------------------------
describe('Reprodutor de video', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
  })

  it("Verificar título", () => {
    cy.title('include', 'Aplicativo de Vídeo')
  })

  it('Verificar se o reprodutor de vídeo está visível quando um vídeo é selecionado na lista de vídeos.', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').should('be.visible')
  })

  it('Testar se o vídeo começa a ser reproduzido quando um vídeo é selecionado.', () => {
    cy.get(".thumbnail").first().click();
    cy.get("#videoPlayer").should("have.prop", "paused", false);
  })

  it('Testar os controles do reprodutor de vídeo. Verifique se o vídeo pausa quando o botão de pausa é clicado e se retoma quando o botão de play é clicado.', () => {
    // cy.window().then((win) => {
    //   cy.stub(win, 'playVideo').as('funcaoStub')
    // })

    // cy.get('.thumbnail').first().click()
    // cy.get('@funcaoStub').should('be.called')
  })

  it('Verifique se a barra de progresso está funcionando corretamente, mostrando o progresso conforme o vídeo avança.', () => {
    cy.get('.thumbnail').first().click()
    cy.get('#videoPlayer').then(($videoPlayer) => {
      const video = $videoPlayer.get(0)
      const progressBar = Cypress.$('#videoPlayer')

      cy.wrap(video).should('have.prop', 'currentTime').and('be.gte', 0)
      cy.wait(1000)

      cy.get(progressBar).should(($progressBar) => {
        const time = $progressBar.prop('currentTime')
        const duration = $progressBar.prop('duration')
        const progress = (time / duration) * 100

        expect(progress).to.be.greaterThan(0)
      })
    })
  })

  it('Verificar se a lista de vídeos é renderizada corretamente na tela inicial.', () => {
    cy.get('#videoList').should('be.visible')
  })

  it('Verificar se um vídeo começa a ser reproduzido quando é selecionado na lista de vídeos.', () => {
    cy.window().then((win) => {
      cy.stub(win, 'playVideo').as('funcaoStub')
    })

    cy.get('.thumbnail').first().click()
    cy.get('@funcaoStub').should('be.called')
  })
})

