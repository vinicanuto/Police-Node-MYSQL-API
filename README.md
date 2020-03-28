<h1>Desafio: Police REST API</h1>
<p>Suba uma API REST em Node.JS contendo rotas com as
funcionalidades a seguir. Caso sinta necessidade de alguma rota que não está
presente nos requisitos abaixo, sinta-se livre para fazê-la.</p>
<h3>Tecnologias: Node JS, MYSQL, Express</h2>
<h3>Restrição</h2>
<p>Não fazer utilização de ORM</p>
<h3>Requisitos Funcionais</h2>
<ul>
  <li>Trazer todas as armas que já foram utilizadas em algum crime.</li>
  <li>Trazer todas as informações acerca de um determinado crime (vítimas, armas,criminosos, país e data).</li>
  <li>Inserir um novo crime com todas as suas informações agregadas (armas,vítimas, criminosos).</li>
  <li>Remover um crime do sistema.</ul>
</ul>
<br>
<h3>Instruções</h3>
<p>Para rodar o projeto faça o clone do projeto e rode o comando:</p>
<p>npm install ou yarn</p>
<p>Edite as configurações de conexão com seu banco de dados MYSQL no diretório "src/config/db.js"/p>
<p>Para startar o server Express rode o comando "npm run dev ou yarn dev"</>
  
 <h3>Rotas</h3>
 <ul>
  <li>Informações de um crime: GET /crimes/:idCrime</li>
  <li>Todas armas utilizadas em crimes: GET /crimes/weapons</li>
  <li>Deleta um crime: DELETE /crimes/:idCrime</li>
  <li>Cria um crime: POST /crimes/ </li>
</ul>

<h3> Exemplo de criação de um crime </h3>
<p> POST /crimes
  {
	"country": "Brasil",
	"date": "2019-02-22 00:00:00",
	"weaponCrime": [
		{
			"id_weapon": "2"
		},
		{
			"id_weapon": "3"
		},
		{
			"id_weapon": "4"
		}
	],
	"victimCrime": [
		{
			"name": "Aviões do forró"
		},
		{
			"name": "Tyler the creato"
		}
	],
	"criminal": [
		{
			"name": "Gisele",
			"criminalCrime": [
				{
					"idCrimeType": 1
				},
				{
					"idCrimeType": 2
				}
			]
		}
	]
}
  </>
