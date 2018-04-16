# Aula 3 - Colecionáveis

[TOC]



# Colecionáveis

## Parte visual

Crie um objeto do tipo *Sprite* para representar as moedas, crie duas animações com base nas imagens em `Items\Coin_spin` e `Items\Coin_shine`



![](imgs/coinspin.png) 



![](imgs/coinshine.png)



Defina a caixa de colisão para as moedas e use a opção de aplicar para todas as animações, assim como fizemos com o Player anteriormente.

![1523886878692](assets/1523886878692.png)



Dê um duplo clique  em um dos quadrados vermelhos para adicionar um outro ponto **antes** dele

![1523886938286](assets/1523886938286.png)

![1523886982394](assets/1523886982394.png)

![1523886999875](assets/1523886999875.png)

Aplicando para todas as animações:

![1523887083487](assets/1523887083487.png)



Você pode usar a mesma técnica para duplicar objetos ensinada anteriormente (clicar no objeto a copiar, segurar a tecla `ctrl` e arrastar o mouse) e definir qual vai ser a animação que deve ocorrer na moeda da seguinte forma:



![](imgs/initialanimation.png)



## Parte Lógica

O primeiro passo é criar uma variável de instância ao Player. Uma variável de instância é um campo que nos permite guardar um valor como um número ou um texto junto com algum objeto, nesse caso o objeto *Player*



![](imgs/addinstance.png)



![1523887250235](assets/1523887250235.png)



Nosso objetivo é criar esse bloco:



![](imgs/code addtocoins.png)



Para a primeira linha escolha `Coin > Destroy`

Para a segunda use o `Player > Add to` conforme as imagens



![](imgs/playerAddto.png)

![](imgs/addto2.png)







Você pode querer colocar o efeito de física na moeda, com ele é possível fazê-la interagir com as flechas que o jogador vai lançar e colocar o efeito delas sendo "sugadas" em direção ao jogador quando ele se aproximar delas.



Para isso você precisará:



1. Aplicar o comportamento `Physics` às moedas

![52138992448](imgs\1521389924489.png)

![52138994964](imgs\1521389949643.png)

2. Aplicar o comportamento de física ao cenário e garantir que a opção `Immovable` está marcada

![52139011293](imgs\1521390112933.png)



3. Criar o seguinte bloco que fará as moedas serem atraidas para o jogador

![52139019074](imgs\1521390190748.png)

Para isso, faça o seguinte

Crie um novo evento do tipo `System`

![52139023040](imgs\1521390230408.png)



Escolha a opção `for each`

![52139027737](imgs\1521390277375.png)



Escolha a opção `Coin`



![52139033494](imgs\1521390334944.png)



No bloco criado, escolha a opção `Add another condition`

![52139038276](imgs\1521390382766.png)

Escolha system novamente

![52139023040](imgs\1521390230408.png)

Escolha a opção `Compare two values`

![52139045955](imgs\1521390459550.png)



Coloque os seguintes valores

![52139051998](imgs\1521390519984.png)



O `for each` executará esse código para cada moeda e testaremos para cada uma delas se a distância no plano cartesiano entre ela e o jogador é menor que 40 px, se for ela irá na direção dele:

![52139091228](imgs\1521390912282.png)



Para fazer a moeda ser sugada, faremos o seguinte:

![52139097318](imgs\1521390973185.png)

![52139099521](imgs\1521390995219.png)



`dt` é a quantidade de ticks que o jogo tem, em computadores mais rápidos, o tick é menor, em mais lentos é maior, como a força será aplicada a cada tick, precisamos garantir que ela será a mesma para computadores mais rápidos e mais lentos, assim, com `3 * dt` fazemos com que:

* Num computador mais **lento** a ação de aplicar uma força que acontece **menos vezes** ocorra com **mais força**
* Num computador mais **rápido** a ação de aplicar uma força que acontece **mais vezes** ocorra com **menos força**



Dessa forma o efeito será o mesmo independentemente da plataforma.
