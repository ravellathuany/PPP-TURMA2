# PPP-TURMA2

## Imagens em Questões

É possível anexar uma imagem opcional somente no momento da criação da questão.

- Criar questão com imagem: `POST /api/questions` (multipart/form-data)
	- Campos: `subjectId` (int), `text` (string), `options` (array de 5 strings), `answerIndex` (0 a 4), `image` (arquivo)
	- Tipos permitidos: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp` — até 2MB
	- Permissão: professor
	- Resposta: objeto `Question` com o campo `imageUrl`

- Após criada, a questão não pode ser editada (incluindo a imagem). Para alterar, remova e crie novamente.

As imagens são servidas estaticamente em `/uploads/...`. O campo `imageUrl` nas questões aponta para a URL pública do arquivo.