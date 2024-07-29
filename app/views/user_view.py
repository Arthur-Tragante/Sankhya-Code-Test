from typing import List
from app.models.user import Usuario

def format_user(user: Usuario):
    """Formata um objeto de usuário em um dicionário para ser retornado como JSON."""
    return {
        "id": user.id,
        "nome": user.nome,
        "email": user.email
    }

def format_users(users: List[Usuario]):
    """Formata uma lista de objetos de usuário em uma lista de dicionários para ser retornada como JSON."""
    return [format_user(user) for user in users]
