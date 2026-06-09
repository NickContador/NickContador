# AutoWorks 3D

Diagnóstico de geometria veicular 3D.

## Estrutura

```
alinhamento 3d/
├── backend/          # Servidor Python (FastAPI)
│   ├── config.py     # Configurações do app
│   ├── database.py   # Conexão com SQLite
│   ├── models.py     # Tabelas do banco
│   ├── schemas.py    # Validação de dados
│   ├── routes.py     # Endpoints da API
│   ├── server.py     # Inicialização do servidor
│   └── requirements.txt
├── frontend/          # Interface web
│   ├── index.html     # Página principal
│   ├── css/style.css  # Estilos
│   └── js/app.js     # Lógica do frontend
├── dados/             # Banco SQLite
│   └── alinhamento.db
├── README.md
└── .gitignore
```

## Rodar

```bash
cd backend
pip install -r requirements.txt
python server.py
```
