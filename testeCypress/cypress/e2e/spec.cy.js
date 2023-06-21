describe('Reprodutor de video', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
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
    cy.get(".thumbnail").first().click();
    cy.get("#videoPlayer").should("be.visible").as("video");
    cy.get("@video").then(($video) => {
      $video[0].pause();
    });
    cy.get("@video").should("have.prop", "paused", true);
    cy.get("@video").then(($video) => {
      $video[0].play();
    });
    cy.get("@video").should("have.prop", "paused", false);
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

  it('Verificar se a miniatura e o título de cada vídeo são exibidos corretamente na lista.', () => {
    cy.get(".video-thumbnail").each(($thumbnail) => {
      cy.wrap($thumbnail).find(".thumbnail").should("be.visible");
      cy.title('include', 'Aplicativo de Vídeo')
    })
  })

  it('Testar a funcionalidade de pesquisa inserindo uma palavra-chave e verificando se a lista de vídeos é filtrada corretamente.', () => {
    cy.get("#search").should('be.visible').should('be.enabled').type("Elephants");
    cy.get(".btn-primary").click();
    cy.get(".video-thumbnail").should("have.length", 1).should('be.visible');
    cy.get(".thumbnail").should("have.prop", "src", "https://peach.blender.org/wp-content/uploads/bbb-splash.png").should('be.visible');
  })

  it('Verificar se a filtragem funciona corretamente ao pressionar Enter.', () => {
    cy.get("#search")
      .type("Bunny{enter}");
    cy.get(".video-thumbnail")
      .should("have.length", 1);
    cy.get(".thumbnail")
      .should("have.attr", "src")
      .and("include", "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217");
  })

  it(' Verificar se a seção de comentários está visível quando um vídeo está sendo reproduzido.', () => {
    cy.get(".thumbnail").first().click();
    cy.get("#commentSection").should("be.visible");
  })

  it('Testar a funcionalidade de postagem de comentários. Verifique se um novo comentário é adicionado à lista de comentários quando o usuário insere um comentário e pressiona Enter.', () => {
    const comment = "Teste comentário";

    cy.get(".thumbnail")
      .first()
      .should("be.visible")
      .click();

    cy.get("#commentInput")
      .should("be.visible")
      .should("be.enabled")
      .type(comment + "{enter}");

    cy.get("#comments p")
      .first()
      .should("be.visible")
      .should("contain", comment);
  })

  it(' Verificar se a data e a hora são exibidas corretamente para cada comentário.', () => {
    const comment = "Outro comentário";

    cy.get(".thumbnail").first().click();
    cy.get("#commentInput").type(comment + "{enter}");

    cy.get("#comments p").first().should(($comment) => {
      const commentText = $comment.text();
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString();

      expect(commentText).to.include(comment);
      expect(commentText).to.include(dateString);
    });
  })

  it('Verificar se o contador de visualizações incrementa cada vez que um vídeo é reproduzido.', () => {
    cy.get("#search").type("Bunny{enter}")
      .get(".thumbnail").first().click()
      .get("#viewCount").then(($viewCount) => {
        const initialViews = parseInt($viewCount.text());

        cy.get("#search").type("{enter}")
          .get(".thumbnail").first().click()
          .get("#videoPlayer").should("be.visible")
          .get("#viewCount").should(($viewCount) => {
            const currentViews = parseInt($viewCount.text());
            expect(currentViews).to.be.greaterThan(initialViews);
          });
      });
  })
})

