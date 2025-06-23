# Clone Tabnews

- 1 - A fundação:

  - Começamos criando um repositório GitHub.
  - Neste repositório criamos um Codespaces.
  - Igualamos a versão do node utilizando `nvm`.
  - `nvm` significa Node Version Manager.
  - Em [pesquisa no chatGPT](https://chatgpt.com/share/6853592f-8c1c-8003-8c3b-cc8d62616bfd) descobri que `node.js` é simplesmente um motor para rodar Javascript fora do navegador.
  - `nvm ls` (de listar) me mostra as versões atuais disponíveis do node.
  - Sempre usar a flag `--help` para descobrir como os comandos funcionam.
  - Sugestão de utilizar a versão `lts/hydrogen` (v18.20.8).
  - Se por algum motivo a instalação desta versão não desse certo instalar a próxima lts que seria a `lts/iron`, mas não foi necessário.
  - Versões mais atuais da mesma lts tem compatibilidade umas com as outras. Sendo incluídos apenas `patch` com correções de vulnerabilidades.
  - Quando desligar este Codespaces a versão anterior irá retornar e o comando `nvm alias default lts/hydrogen` resolveu o problema. Tudo indica que este comando `nvm alias default <versao>` parace configurar a versão globalmente. Como esta máquina não rodará mais nenhum projeto, acredito que não será um problema, mas para um ambiente local (minha máquina, por exemplo), acredito ser bom descobrir o comando equivalente que mudará somente o local.
  - Para "documentar" no projeto o que estamos fazendo é bom criar o arquivo `.nvmrc`.

    - No arquivo `.nvmrc` incluimos na primeira linha a definição da versão `lts/hydrogen`. Este arquivo precisa de uma linha em branco no final.
    - Sobre definir a versão node global ou localmente foi sanada quando clonei o repositório para minha máquina. Ao `cd` dentro do projeto clonado, o `nvm` já baixou a versão necessária para o projeto e definiu que ela seria utilizado no mesmo:

      ```
      ➜  gabrielbdornas cd clone-tabnews
      Found '/home/gabrielbdornas/code/gabrielbdornas/clone-tabnews/.nvmrc' with version <lts/hydrogen>
      Downloading and installing node v18.20.8...
      Downloading https://nodejs.org/dist/v18.20.8/node-v18.20.8-linux-x64.tar.xz...
      ####################################################################################################################################################### 100.0%
      Computing checksum with sha256sum
      Checksums matched!
      Now using node v18.20.8 (npm v10.8.2)
      ➜  clone-tabnews git:(main) node --version
      v18.20.8
      ➜  clone-tabnews git:(main) cd ..
      ➜  gabrielbdornas node --version
      v20.19.2
      ```

      - Repare que fora do projeto a versão node configurada é outra.

    - Com este arquivo, bastará rodar `nvm install` e ele fará toda mágica de instalação para nós. Não sei se o Python tem este tipo de mágica. Acredito que foi esse comando que foi chamado quando clonei e `cd` para dentro do projeto em minha máquina.
    - O `rc` aqui no final significa run commands, e podemos encontrar este sufixo em vários outros lugares como em `bashrc`. Isso é uma convenção criada para arquivos que possuem instruções para inicialização.

- 2 - A primeira parede:

  - Usando `next.js`, que turbina o `react` como se permitindo rodar a parte de backend do sistema. Veja a resposa [chatGPT](https://chatgpt.com/share/68536101-21f0-8003-a04a-078b4032ad28).
  - `next.js` possibilita uma das melhoras integrações Framework / Web Host. Colocar um site no ar (back e front) com esta ferramenta nunca foi tão fácil.
  - `next.js` é desenvolvido pela vercel.com, o que faz o combo `next.js` + vercel muito bom.
  - Criamos o arquivo `package.json` que Felipe classificou como arquivo Manifesto, ou responsável por listar as dependências do projeto.
  - `package.json` é ótimo para permitir que teremos as mesmas versões ao replicar o sistema (no servidor de produção, por exemplo).
  - Para iniciar a criação deste arquivo basta rodar `npm init`.
  - Para instalar pacotes basta `npm install package-name@version`, como em `npm install next@13.1.6`.
  - Instala `react` e `react-dom` ambos na versão `18.2.0`. O `react-dom` é um renderizador para páginas HTML. Estes renderizadores foram dividios para facilitar o trabalho de front. Um deles, por exemplo, é o react-native.
  - Só com estas 3 dependências dá para fazer muita coisa legal. Oque? Posso pensar em exemplos para escrever posts e praticar.
  - Estamos instalando as mesmas versões para evitar erros neste momento, mas no futuro os testes automatizados vão deixar a atualização de versão sempre em dia.

- 2.1 - Recapitulando:

  - `nvm`: Node version manager: Gerencia as versões do node. Para iniciar um projeto em outra máquina necessário rodar `nvm install`. Como vimos o próprio `nvm` faz isso ao `cd` dentro de um projeto clonado que tenha o arquivo `nvmrc`. Ou ele usa este arquivo para `run commands` de instalação da versão necessária ao iniciar o projeto.
  - `npm`: Node package manager: Gerencia a instalação de pacotes. Ou seja, após definirmos a versãod do node que utilizaremos com `nvm install` devemos instalar os pacotes compatíveis com essa já utilizadas no projeto. Para isso rodamos o `npm install`. Isso criará uma pasta `node_modules` em nosso projeto (a ser incluído no `.gitignore`).

- 3 - Protocolos e rodando o site de forma local

  - O que é de fato um serviço WEB?
  - Começamos por protocolos, existem vários como HTTP, FTP, SMTP, cada um com seu objetivo.
  - Protocolo é apenas um acordo, um combinado entre a parte que envia e a parte que recebe (partes que estão tentando se comunicar).
  - Posso dizer que um protocolo é o mesmo que uma API? Se não, qual a diferença?
  - Qual problema de erros de informação?
  - Um protocolo é montado sobre o outro, por exemplo o HTTP é montado em cima do TCP (que garante que as informações chegarão do outro lado), que usando o IP (internet protocol) para tramitar tudo pelos tuneis da internet.
  - Utilizar o protocolo tcp tem custo, pois como ele garante que toda informação chegará do outro lado a transmissão pode ficar mais lenta.
  - Transmissão de zoom e teams é um exemplo de onde o TCP pode não ser necessário. Video chamadas utilizam o protocolo udp. [Video mostrando diferenças protocolos tcp e udc](https://www.youtube.com/watch?v=ZEEBsq3eQmg)
  - Vamos então ligar o servidor utilizando o next. Deveríamos rodar utilizando `next dev`, mas o next não está instalado globalmente na máquina. Ele esté instalado no node, então tenho que usar o `npm` para rodá-lo. Para isso, incluo este comando como um script no arquivo `package.json`. Assim rodo `npm run dev`.

- 4 - Página Inicial:

  - Next usa um sistema chamado File-Based Routing, ou roteamente baseado em arquivos.
  - Agora o Next aceita os arquivos na pasta `pages` ou `ap`. A opção foi para a pasta `pages`, usando quando da criação do sistema.
  - No futuro podemos pensar em mudar para `ap`.
  - `index.js` nada mais é do que o índice das nossas páginas. Indice (ou index.md) eram como as páginas funcionavam no passado.
  - No Nest qualquer pasta que tenha um arquivo `index.js` ou `jsx` vira uma rota pública. No nosso caso nosso `index.js` na raiz de `pages` virará a nossa Home.
  - Agora dará para ver a linha que separa o Next do React. Next é que entrega a conexão do mundo lá fora (as rotas) para os components React que serão entregues.
  - Após criar o arquivo `pages/index.js` rodamos novamente o comando `npm run dev` e o servidor já está no ar.
  - Detalhe que o Codespaces deixa acessarmos este servidor em um link online. Ele mesmo pergunta se não queremos abrir o resultado do servidor no navegador.
  - A aba no navegador que foi aberta, por padrão só está disponível para mim, mas se eu clicar na anteninha (barra no pé do editor) ele abre a opção de portas (opção ao lado do terminal também). Alí posso mudar a visibilidade para Public, assim todos tem acesso àquela página
