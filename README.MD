# FastAPI MVC Project

## Descrição
Projeto de API utilizando FastAPI com estrutura MVC e autenticação JWT.

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/Arthur-Tragante/Sankhya-Code-Test.git
    cd Sankhya-Code-Test
    ```

2. Crie e ative um ambiente virtual:
    ```sh
    python3 -m venv venv
    source venv/bin/activate  # No Windows use `venv\Scripts\activate`
    ```

3. Instale as dependências:
    ```sh
    pip install -r requirements.txt
    ```

4. Execute a aplicação:
Em outro terminal:
    ```sh
    uvicorn app.main:app --reload
    ```

## Uso

Para obter um token JWT, use o endpoint `/token` fornecendo email e senha válidos. Use o token para acessar os endpoints protegidos.
body x-www-form-urlencoded
```
username: meu_email@examplo.com
password: minhasenha
```

## Endpoints

- `POST /usuarios/` - Cria um novo usuário.
- `GET /usuarios/` - Lista usuários com paginação. Também aceita o parametro search para filtrar nome ou email
- `GET /usuarios/{user_id}` - Retorna um usuário específico.
- `PUT /usuarios/{user_id}` - Atualiza um usuário existente.
- `DELETE /usuarios/{user_id}` - Deleta um usuário.

## Autenticação

A autenticação é feita usando JWT. Para acessar os endpoints protegidos, inclua o token no header da requisição:

```http
Authorization: Bearer seu_token_aqui
```

## Testes

Para executar os testes, dentro do diretorio /app, use o comando:
```
python -m pytest
```
## Front End

Dentro do diretório frontend/sankhya-front-end
Para instalar dependências

```
npm install
```

Para executar o front end
```
npm run dev
```




