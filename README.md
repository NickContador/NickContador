# 🐧 otimiza-linux

> Script leve, open-source e compatível com **qualquer distribuição Linux** — inspirado nos melhores projetos de otimização do GitHub.

![versão](https://img.shields.io/badge/versão-3.2-blue)
![licença](https://img.shields.io/badge/licença-MIT-green)
![shellcheck](https://img.shields.io/badge/shellcheck-0%20achados-brightgreen)

---

## ✨ Recursos

| Módulo | O que faz |
|---|---|
| 🧹 **Limpeza** | Cache, temporários com mais de 7 dias, logs antigos e pacotes órfãos |
| ⚡ **Desempenho** | Memória, kernel, ZRAM ativo no boot, SSD/NVMe e E/S de disco |
| 🎮 **Modo Jogos** | Reduz latência, prioridade em tempo real, ativa BBR |
| 🔊 **Áudio** | Eleva prioridade e reduz latência de áudio |
| 🌐 **Rede** | Buffers maiores, TCP Fast Open, BBR congestion control |
| 🔋 **Modo Bateria** | Economia de energia para notebooks |
| 📊 **Diagnóstico** | Status completo do sistema + verificação de otimizações ativas |
| 🔧 **Segurança** | Backup `.bak`, **restauração real dos valores originais** e desinstalação |

✅ Funciona em: Ubuntu • Debian • Fedora • Arch • Manjaro • openSUSE • Mint • Zorin • e qualquer distro com `systemd`

---

## 🚀 Como Usar — Passo a Passo

### Opção 1 — Baixar com um comando
```bash
wget https://raw.githubusercontent.com/SEU-USUARIO/otimiza-linux/main/otimiza-linux-completo.sh
chmod +x otimiza-linux-completo.sh
sudo ./otimiza-linux-completo.sh
```

### Opção 2 — Criar o arquivo manualmente
```bash
nano otimiza-linux-completo.sh
# (cole o conteúdo do script, depois: Ctrl+O → Enter → Ctrl+X)

chmod +x otimiza-linux-completo.sh
sudo ./otimiza-linux-completo.sh
```

Na primeira execução o script pergunta se você deseja **instalar** os comandos permanentemente:

| Comando | O que faz |
|---|---|
| `sudo otimiza-linux` | Instala (opcional) e abre o menu interativo |
| `sudo otimiza-linux --desinstalar` | Remove as otimizações e o próprio programa |
| `sudo desinstalar-otimizador` | Atalho criado durante a instalação |
| `otimiza-linux --ajuda` | Mostra a ajuda da linha de comando |

---

## 📋 Menu Principal

```
🧹 LIMPEZA          1) Cache   2) Temporários   3) Logs   4) Pacotes
⚡ DESEMPENHO       5) Memória e kernel   6) ZRAM   7) SSD/NVMe   8) E/S
🎮 JOGOS E ÁUDIO    9) Ativar Modo Jogos  10) Desativar  11) Áudio
🌐 REDE E NOTEBOOK  12) Rede  13) Ativar Bateria  14) Desativar
🛠️  SISTEMA         15) Status  16) Verificar  17) Aplicar todas
                    18) Restaurar tudo  19) Desinstalar  0) Sair
```

---

## 🔙 Como Desinstalar

Pelo menu: opção **19) 🗑️ Desinstalar o otimizador**, ou direto:

```bash
sudo otimiza-linux --desinstalar
```

A desinstalação remove os arquivos criados, **devolve os valores originais do
`sysctl`** (gravados em `/var/lib/otimiza-linux/`), desliga o ZRAM e apaga os
comandos instalados.

---

## 🛡️ Segurança

- **Backup automático:** antes de sobrescrever, cada configuração vira
  `arquivo.conf.bak.AAAAMMDD_HHMMSS` em `/etc/sysctl.d/` e `/etc/security/limits.d/`.
- **Restauração real:** os valores de `sysctl` vigentes são salvos antes da
  otimização, então a opção 18 (e a desinstalação) voltam ao estado original —
  sem depender de reboot.
- **Temporários:** a limpeza preserva arquivos alterados nos últimos 7 dias
  (sockets de sessões ativas, ssh-agent etc.).
- **ZRAM reversível:** desligado com `swapoff` e removido na restauração.

> ⚠️ Como qualquer otimizador, revise as opções antes de aplicar em servidores
> de produção.

---

## 🧪 Qualidade

```bash
shellcheck -S style otimiza-linux-completo.sh   # 0 achados (v0.11.0)
bash -n otimiza-linux-completo.sh               # sintaxe OK
```

O script passa por testes automatizados de ponta a ponta (instalação → todos os
módulos → verificação → restauração → desinstalação) em ambiente isolado.

---

## 📄 Licença

[MIT](LICENSE) © 2026 Marco Antonio
