# jsonQUIZ
**Crie e jogue quizzes com amigos de forma divertida!**

[![PWA](https://img.shields.io/badge/Progressive_Web_App-4188D3?style=flat-square)](https://web.dev/what-are-pwas/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 🌟 Funcionalidades
- 📁 Importe perguntas personalizadas via arquivos JSON
- 📱 Interface responsiva para mobile e desktop
- 🎨 Design moderno com animações suaves
- 📥 Funciona offline (PWA)

---

## 🚀 Como Usar
1. **Escolha o modo de jogo:**
    - Individual
    - Multiplayer local

1. **Carregue suas perguntas**:
   - Clique no botão "Importar JSON"
   - Selecione seu arquivo de perguntas formatado

2. **Jogue com amigos**:
   - Aproveita o aplicativo com seus amigos.

3. **Personalize**:
   - Crie suas próprias perguntas.

---

![Demontração](demo.gif)

---

## 🛠️ Criando seu Arquivo de Perguntas
Use a estrutura JSON abaixo (*exemplo completo na pasta* `/dist/`):

```json
[
    {
        "quiz": "Quem construiu a arca?",
        "a": "Noé",
        "b": "Moisés",
        "c": "Abraão",
        "d": "Davi",
        "x": "a",
        "ref": "Gênesis 6:14"
    },
    {
        "quiz": "Quem venceu Golias?",
        "a": "Sansão",
        "b": "Davi",
        "c": "Josué",
        "d": "Salomão",
        "x": "b",
        "ref": "1 Samuel 17:49-50"
    }
]
```

### 🔍 Regras de Formatação:
1. Use **letras minúsculas** em `x` (`a`, `b`, `c` e `d`)
2. Sempre coloque vírgula entre perguntas
3. Não use espaços após as vírgulas

---

## 📜 Licença
Este projeto está sob licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.