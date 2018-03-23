# Dicas e solução de problemas

[TOC]

## Mudanças no cenário

Se você tentou **mudar o cenário** e não conseguiu, verifique se o desenho do cadeado está marcado como fechado e clique para marca-lo como aberto, cadeado fechado indica que a camada não pode ser editada



Se você percebeu que o cenário que estava fazendo **desapareceu**, verifique se a caixa de checagem antes do cadeado está desmarcada, caixas desmarcadas indicam que o que estiver naquela camada não deve ser mostrado na tela



## Menus sumiram

Se você perceber que algum dos menus citados anteriormente desapareceu, o coloque de volta usando o menu `menu > View > Bars`

![](imgs/menus.png)
você perceberá que caso clique em um menu faltante (tirando os três últimos da lista que estão disponíveis apenas na versão paga do Construct) ele aparecerá na tela, você pode arrasta-lo para a posição que desejar.

![](imgs/meuposicoes.png)



## Nomeando objetos

![](imgs/renameem.png)

Sempre renomeie os objetos do jogo para o que eles representam, isso será muito útil e facilitará seu trabalho na hora da programação.

Use `F2` com o mouse sob o campo que quer editar ou use a ferramenta de renomear

![](imgs/renamemenu.png)



## Teclas de atalho e uso do mouse

* Use a tecla `F11` para colocar ou tirar a ferramenta da tela cheia
* Use `shift + roda do mouse` para dar zoom no cenário
* `Aperte a roda do mouse e arraste` ou `espaço + arrastar o mouse `para se mover pelo cenário
* Use a tecla `F2` com o mouse em cima de um campo de **texto** para editá-lo
* `roda do mouse` para se mover na **vertical**
* `shift + roda do mouse` para se mover na **horizontal**
* `ctrl + e` para ir ao **event sheet**
* `ctrl + l` para ir ao **layout**




## Abas sumiram

Caso as abas **Layout** ou **Event Sheet** desapareçam, use este menu para abri-las novamente, você pode dar um clique duplo ou usar o botão direito do mouse.
![](imgs/mousemenu.png)



## Layout



* Ao mudar o tamanho de objetos, você pode apertar Shift e arrastar o mouse clicando em uma das abas para mudar o tamanho do objeto sem fazer com que ele seja distorcido

* Na hora de posicionar a plataforma que se movimenta no layout, coloque-a no **meio** da área que deve cobrir com o movimento

  * Depois de ter todas as plataformas prontas você pode criar uma cópia facilmente clicando e arrastando uma plataforma pronta enquanto segura a tecla `crtl`



## Propriedades do projeto

Clique na parte cinza (fora de qualquer objeto), na aba de propriedades serão mostradas as propriedades do projeto como um todo, marque a opção `Show Grid`, `Snap to Grid` e defina `Grid size` como `16x16` (ou o tamanho dependendo do projeto, normalmente `16x16`, `32x32`, `64x64` ou `128x128`)



![52138512986](imgs\1521385129865.png)

Caso ache interessante, pode ativar a opção `Show Collision Polygons` que mostrará os polígonos de colisão dos objetos no jogo.



## Criação do cenário

 Tenha um esboço feito de antemão, com ele tente deduzir
  * A largura do cenário
  * A altura do cenário
* Quando for pintar o cenário, comece do centro esquerdo

![52138747281](imgs\1521387472817.png)

* Sempre adicione paredes e um teto para evitar que o jogador mora por pular muito alto, por exemplo.

![52138770903](imgs\1521387709039.png)



Para redimensionar, clique na parte cinza do layout (fora de qualquer objeto), as propriedades do projeto em si aparecerão na lateral.

![52138779348](imgs\1521387793485.png)

Mude o atributo `Size` dependendo do tamanho do cenário que você pensou, lembre-se de que cenários muito grandes deixarão o jogo mais lento.



## Dicas de programação

Na programação, o ponto `.` é utilizado para separar dezenas de centenas e a vírgula `,` é utilizada para sperarar números:



| Na matemática  | Na programação |
| -------------- | -------------- |
| $$15,3; 17,5$$ | `15.3, 17.5`   |



Na programação uma função é algo com um **nome** que recebe **valores** faz um cálculo e devolve um valor. Quando você chamar uma função, pense que está colocando naquele lugar o valor que ela irá retornar:



| Função                    | Descrição                                                    | Equivale a   |
| ------------------------- | ------------------------------------------------------------ | ------------ |
| `max(50.5, 6.5)`          | Retorna o maior entre dois números                           | `50.5`       |
| `int(7.5)`                | Retorna a parte inteira de um número com vírgula             | `7`          |
| `distance(5, 7, 10, 20)` | Recebe dois pontos no plano cartesiano e retorna a distância entre eles (euclidiana) | `13.928388` |







