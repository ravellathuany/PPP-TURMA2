# PPP-TURMA2

## Guia completo da API (resumo do Swagger)

- Base URL: `/api`
- Swagger UI: `http://localhost:3000/docs`

### Como executar

1) Instalar dependências

```powershell
npm install
```

2) Rodar o servidor (porta padrão 3000)

```powershell
# desenvolvimento (auto-reload)
npm run dev

# ou
npm start
```

Opcional: alterar porta

```powershell
$env:PORT=4000; npm start
```

### Autenticação e perfis

- JWT Bearer (`Authorization: Bearer <token>`)
- Perfis: `student` (padrão) e `teacher`
- `POST /api/auth/register` e `POST /api/auth/login`

### Regras de questões

- Exatamente 5 alternativas (`options`), todas obrigatórias e não vazias
- `answerIndex` entre 0 e 4
- Imagem opcional apenas na criação e somente via URL (`imageUrl` http/https no JSON). Não é possível editar depois.

### Imagens em Questões

É possível anexar uma imagem opcional somente no momento da criação da questão, e APENAS via URL pública (http/https) usando o campo `imageUrl` no corpo JSON. Não há upload de arquivo para o servidor.

- Criar questão com imagem: `POST /api/questions` (application/json)
	- Campos: `subjectId` (int), `text` (string), `options` (array de 5 strings), `answerIndex` (0 a 4), `imageUrl` (string http/https opcional)
	- Permissão: professor
	- Resposta: objeto `Question` com o campo `imageUrl`

- Após criada, a questão não pode ser editada (incluindo a imagem). Para alterar, remova e crie novamente.

Observação: `imageUrl` deve apontar para uma URL acessível publicamente (http/https). Caminhos locais (C:\\..., file:// ...) não funcionam via cliente.

### Endpoints

- Subjects: `GET /subjects`, `POST /subjects` (prof), `DELETE /subjects/{id}` (prof)
- Questions: `GET /questions`, `GET /questions/{id}`, `POST /questions` (prof — apenas JSON), `DELETE /questions/{id}` (prof)
- Quizzes: `POST /quizzes`, `POST /quizzes/{id}/finalize`, `GET /quizzes/me`
- Stats: `GET /quizzes/me/stats/overall`, `GET /quizzes/me/stats/subjects`
- Respondidas: `GET /quizzes/me/answered-questions` — IDs únicos de questões já respondidas pelo aluno

### Exemplos (PowerShell)

Criar questão via JSON (com imageUrl opcional):

```powershell
curl.exe -s -X POST "http://localhost:3000/api/questions" `
	-H "Authorization: Bearer <TOKEN>" `
	-H "Content-Type: application/json" `
	-d '{
		"subjectId": 1,
		"text": "Qual é a capital do Brasil?",
		"options": ["Rio de Janeiro","São Paulo","Brasília","Salvador","Belo Horizonte"],
		"answerIndex": 2,
		"imageUrl": "https://meu-cdn.exemplo.com/imagens/q1.png"
	}'
```

### Esquemas (resumo)

- Question: `{ id, subjectId, text, options[5], answerIndex (0..4), imageUrl? }`
- QuestionPublic: `{ id, subjectId, text, options[5], imageUrl? }`
- CreateQuizResponse: `{ quizId, subjects[], questions: QuestionPublic[] }`
- FinalizeQuizResponse: `{ quizId, total, correct, incorrect, bySubject, correctQuestionIds[], incorrectQuestionIds[], details[] }`
- StatsOverall: `{ totalQuestions, answeredByStudent }`
- StatsPerSubjectItem: `{ subjectId, subjectName, totalQuestions, answeredByStudent }`

Para detalhes completos, veja `resources/swagger.json` e a UI em `/docs`.