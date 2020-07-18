## ParkFinder App

1. Para inicializar este projeto deve primeiro instalar NodeJs atraves do link www.nodejs.org

2. executar o comando git clone [a link]https://github.com/yaminyassin/ionicApp.git

2. Em seguida deve abrir um novo window cmd e digitar: 
    - npm install -g @ionic/cli 
    - npm install leaflet --save
    - npm install leaflet-routing-machine --save

3. Apos instalar os modulos deve abrir uma nova linha de comandos no root do projeto e escrever:
    - ionic build

4. Para Modificar o endereco IP do Servico RestApi deve ir ao ficheiro [service.service.ts](src\app\services\service.service.ts)

5. para Modificar o endereco IP do OSRM (servico routing) deve ir ao ficheiro [map.page.ts](src\app\pages\map\map.page.ts) e alterar a variavel OSRM


4. finalmente para visualizar a aplicacao no browser deve inserir:
    - ionic serve

