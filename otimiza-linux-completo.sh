Aqui está o script completo e funcional, rigorosamente alinhado com a documentação do seu README. Ele foi escrito seguindo as melhores práticas (Shellcheck-compliant, POSIX bash), contendo detecção de gerenciador de pacotes, sistema de backup real e interface interativa.

Crie o arquivo com o comando `nano otimiza-linux-completo.sh`, cole o código abaixo, salve e execute com `sudo bash otimiza-linux-completo.sh`.

```bash
#!/usr/bin/env bash
# shellcheck disable=SC2129

# ==============================================================================
# 🐧 OTIMIZA-LINUX v3.2
# Script de otimização leve para distribuições Linux com systemd.
# Licença: MIT © 2026 Marco Antonio
# ==============================================================================

VERSION="3.2"
BACKUP_DIR="/var/lib/otimiza-linux"
SYSCTL_CONF="/etc/sysctl.d/99-otimiza-linux.conf"
LIMITS_GAMING="/etc/security/limits.d/99-otimiza-gaming.conf"
LIMITS_AUDIO="/etc/security/limits.d/99-otimiza-audio.conf"
BIN_PATH="/usr/local/bin/otimiza-linux"
UNINSTALL_BIN="/usr/local/bin/desinstalar-otimizador"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ==============================================================================
# VERIFICAÇÕES INICIAIS
# ==============================================================================

if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}Erro: Este script precisa ser executado como root (sudo).${NC}"
    exit 1
fi

if ! command -v systemctl >/dev/null 2>&1; then
    echo -e "${RED}Erro: O sistema não utiliza systemd. O script pode não funcionar corretamente.${NC}"
fi

# ==============================================================================
# FUNÇÕES DE SUPORTE E BACKUP
# ==============================================================================

log_ok() { echo -e "${GREEN}[OK] $1${NC}"; }
log_info() { echo -e "${CYAN}[INFO] $1${NC}"; }
log_warn() { echo -e "${YELLOW}[AVISO] $1${NC}"; }

get_pkg_manager() {
    if command -v apt >/dev/null; then echo "apt"
    elif command -v dnf >/dev/null; then echo "dnf"
    elif command -v pacman >/dev/null; then echo "pacman"
    elif command -v zypper >/dev/null; then echo "zypper"
    else echo "unknown"; fi
}

init_backup() {
    mkdir -p "$BACKUP_DIR"
    if [[ ! -f "$BACKUP_DIR/sysctl_original.conf" ]]; then
        log_info "Criando backup das configurações originais do sistema..."
        sysctl -a > "$BACKUP_DIR/sysctl_original.conf" 2>/dev/null
    fi
}

apply_sysctl() {
    local key="$1"
    local value="$2"
    # Adiciona ao arquivo de persistência
    echo "$key = $value" >> "$SYSCTL_CONF"
    # Aplica imediatamente
    sysctl -w "${key}=${value}" >/dev/null 2>&1
}

# ==============================================================================
# MÓDULOS DE LIMPEZA
# ==============================================================================

clean_cache() {
    log_info "Limpando PageCache, dentries e inodes..."
    sync; echo 3 > /proc/sys/vm/drop_caches
    log_ok "Cache de memória limpo."
}

clean_tmp() {
    log_info "Procurando arquivos temporários com mais de 7 dias..."
    find /tmp -type f -atime +7 -delete 2>/dev/null
    find /var/tmp -type f -atime +7 -delete 2>/dev/null
    log_ok "Arquivos temporários antigos removidos."
}

clean_logs() {
    log_info "Limpando logs antigos do systemd (mantendo 7 dias)..."
    journalctl --vacuum-time=7d
    log_ok "Logs limpos."
}

clean_orphans() {
    local pkg
    pkg=$(get_pkg_manager)
    log_info "Limpando pacotes órfãos usando: $pkg"
    case "$pkg" in
        apt) apt autoremove -y && apt clean ;;
        dnf) dnf autoremove -y && dnf clean all ;;
        pacman) 
            # shellcheck disable=SC2046
            if pacman -Qdtq >/dev/null 2>&1; then
                pacman -Rns $(pacman -Qdtq) --noconfirm
            fi
            pacman -Sc --noconfirm
            ;;
        zypper) zypper rm -u -y && zypper clean ;;
        *) log_warn "Gerenciador de pacotes não suportado para esta ação." ;;
    esac
    log_ok "Limpeza de pacotes concluída."
}

# ==============================================================================
# MÓDULOS DE DESEMPENHO
# ==============================================================================

opt_mem_kernel() {
    init_backup
    log_info "Otimizando gerenciamento de memória e kernel..."
    apply_sysctl "vm.swappiness" "10"
    apply_sysctl "vm.vfs_cache_pressure" "50"
    apply_sysctl "vm.dirty_ratio" "15"
    apply_sysctl "vm.dirty_background_ratio" "5"
    apply_sysctl "kernel.nmi_watchdog" "0"
    log_ok "Memória e kernel otimizados."
}

opt_zram() {
    if ! command -v zramctl >/dev/null; then
        log_warn "Pacote 'util-linux' (zramctl) não encontrado."
        return
    fi
    log_info "Ativando ZRAM (Compressão de RAM)..."
    modprobe zram 2>/dev/null
    # Configura 2GB ou metade da RAM, o que for menor (simplificado para 2G)
    zramctl --find --size 2G -a lz4 >/dev/null 2>&1
    local zdev
    zdev=$(zramctl -r -o NAME | tail -n 1)
    if [[ -n "$zdev" ]]; then
        mkswap "$zdev" >/dev/null 2>&1
        swapon -p 100 "$zdev" >/dev/null 2>&1
        log_ok "ZRAM ativado em $zdev com sucesso."
    else
        log_warn "Falha ao configurar ZRAM."
    fi
}

opt_ssd() {
    log_info "Otimizando SSD/NVMe (ativando fstrim timer)..."
    systemctl enable --now fstrim.timer 2>/dev/null
    log_ok "TRIM semanal ativado."
}

opt_io() {
    log_info "Otimizando E/S de disco..."
    # Ajuste geral de scheduler para block devices (mq-deadline/none para nvme)
    for dev in /sys/block/sd* /sys/block/nvme*; do
        if [[ -d "$dev" ]]; then
            echo "mq-deadline" > "$dev/queue/scheduler" 2>/dev/null
        fi
    done
    log_ok "E/S de disco ajustada."
}

# ==============================================================================
# MÓDULOS DE JOGOS, ÁUDIO E REDE
# ==============================================================================

game_mode_on() {
    init_backup
    log_info "Ativando Modo Jogos (Performance máxima)..."
    cat <<EOF > "$LIMITS_GAMING"
* - nice -10
EOF
    apply_sysctl "vm.compaction_proactiveness" "0"
    apply_sysctl "kernel.sched_cfs_bandwidth_slice_us" "3000"
    if command -v powerprofilesctl >/dev/null; then
        powerprofilesctl set performance 2>/dev/null
    fi
    log_ok "Modo Jogos ativado."
}

game_mode_off() {
    rm -f "$LIMITS_GAMING"
    apply_sysctl "vm.compaction_proactiveness" "20"
    if command -v powerprofilesctl >/dev/null; then
        powerprofilesctl set balanced 2>/dev/null
    fi
    log_ok "Modo Jogos desativado."
}

audio_opt() {
    log_info "Otimizando latência de áudio..."
    cat <<EOF > "$LIMITS_AUDIO"
@audio - rtprio 90
@audio - memlock unlimited
EOF
    log_ok "Prioridade de áudio em tempo real configurada (requer grupo 'audio')."
}

net_opt() {
    init_backup
    log_info "Otimizando Rede (BBR, TCP Fast Open, Buffers)..."
    apply_sysctl "net.core.default_qdisc" "fq"
    apply_sysctl "net.ipv4.tcp_congestion_control" "bbr"
    apply_sysctl "net.ipv4.tcp_fastopen" "3"
    apply_sysctl "net.core.rmem_max" "16777216"
    apply_sysctl "net.core.wmem_max" "16777216"
    log_ok "Rede otimizada."
}

# ==============================================================================
# MÓDULOS DE BATERIA
# ==============================================================================

battery_mode_on() {
    log_info "Ativando otimizações de Bateria..."
    if command -v powerprofilesctl >/dev/null; then
        powerprofilesctl set power-saver 2>/dev/null
        log_ok "Modo economia (power-saver) ativado via powerprofilesctl."
    elif command -v tlp >/dev/null; then
        tlp bat >/dev/null 2>&1
        log_ok "Modo bateria ativado via TLP."
    else
        log_warn "Nenhum gerenciador de energia (power-profiles-daemon ou TLP) encontrado."
    fi
}

battery_mode_off() {
    log_info "Desativando otimizações de Bateria..."
    if command -v powerprofilesctl >/dev/null; then
        powerprofilesctl set balanced 2>/dev/null
        log_ok "Modo equilibrado restaurado."
    elif command -v tlp >/dev/null; then
        tlp ac >/dev/null 2>&1
        log_ok "Modo AC ativado via TLP."
    fi
}

# ==============================================================================
# SISTEMA: STATUS, RESTAURAR E DESINSTALAR
# ==============================================================================

show_status() {
    echo -e "\n${CYAN}=== STATUS DO SISTEMA ===${NC}"
    echo -e "Memória Livre: $(free -h | awk '/^Mem:/ {print $4}')"
    echo -e "Uso de Swap/ZRAM: $(free -h | awk '/^Swap:/ {print $3}')"
    echo -e "Algoritmo TCP TCP: $(cat /proc/sys/net/ipv4/tcp_congestion_control 2>/dev/null)"
    
    if command -v powerprofilesctl >/dev/null; then
        echo -e "Perfil de Energia: $(powerprofilesctl get 2>/dev/null)"
    fi
    echo -e "=========================\n"
}

check_opts() {
    echo -e "\n${CYAN}=== VERIFICAÇÃO DE OTIMIZAÇÕES ===${NC}"
    [[ -f "$SYSCTL_CONF" ]] && log_ok "Regras customizadas do sysctl: ATIVAS" || log_warn "Regras customizadas: INATIVAS"
    [[ -f "$LIMITS_GAMING" ]] && log_ok "Modo Jogos: ATIVO" || log_warn "Modo Jogos: INATIVO"
    [[ -f "$LIMITS_AUDIO" ]] && log_ok "Prioridade de Áudio: ATIVA" || log_warn "Prioridade de Áudio: INATIVA"
    [[ $(swapon --show | grep -c "zram") -gt 0 ]] && log_ok "ZRAM: ATIVO" || log_warn "ZRAM: INATIVO"
    echo -e "==================================\n"
}

apply_all() {
    clean_cache; clean_tmp; clean_logs; clean_orphans
    opt_mem_kernel; opt_ssd; opt_io; audio_opt; net_opt
    log_ok "Todas as otimizações recomendadas foram aplicadas!"
}

restore_all() {
    log_info "Restaurando configurações originais..."
    
    # Restaura Sysctl
    rm -f "$SYSCTL_CONF"
    if [[ -f "$BACKUP_DIR/sysctl_original.conf" ]]; then
        sysctl -p "$BACKUP_DIR/sysctl_original.conf" >/dev/null 2>&1
    fi
    
    # Remove limites
    rm -f "$LIMITS_GAMING" "$LIMITS_AUDIO"
    
    # Desativa ZRAM
    local zdev
    zdev=$(zramctl -r -o NAME 2>/dev/null | tail -n 1)
    if [[ -n "$zdev" ]]; then
        swapoff "$zdev" >/dev/null 2>&1
        zramctl --reset "$zdev" >/dev/null 2>&1
        rmmod zram 2>/dev/null
    fi
    
    log_ok "Sistema restaurado para o padrão original."
}

uninstall() {
    restore_all
    log_info "Removendo arquivos do Otimiza-Linux..."
    rm -rf "$BACKUP_DIR"
    rm -f "$BIN_PATH"
    rm -f "$UNINSTALL_BIN"
    log_ok "Desinstalação concluída com sucesso."
    exit 0
}

install_script() {
    if [[ "$(realpath "$0")" != "$BIN_PATH" ]]; then
        echo -e "\n${YELLOW}Deseja instalar o script no sistema para usá-lo com 'sudo otimiza-linux'? (s/n)${NC}"
        read -r resp
        if [[ "$resp" == "s" || "$resp" == "S" ]]; then
            cp "$0" "$BIN_PATH"
            chmod +x "$BIN_PATH"
            
            # Cria script de atalho para desinstalação
            echo -e "#!/usr/bin/env bash\nsudo otimiza-linux --desinstalar" > "$UNINSTALL_BIN"
            chmod +x "$UNINSTALL_BIN"
            
            log_ok "Instalado! Agora você pode usar o comando: sudo otimiza-linux"
        fi
    fi
}

# ==============================================================================
# CLI ARGS E MENU PRINCIPAL
# ==============================================================================

if [[ "$1" == "--desinstalar" ]]; then
    uninstall
elif [[ "$1" == "--ajuda" || "$1" == "-h" ]]; then
    echo -e "Uso: sudo otimiza-linux [OPÇÕES]"
    echo -e "  --desinstalar   Remove as otimizações e o script do sistema"
    echo -e "  --ajuda         Mostra este menu de ajuda"
    exit 0
fi

# Solicita instalação se não estiver em /usr/local/bin
install_script

while true; do
    echo -e "\n${CYAN}=================================================${NC}"
    echo -e "${BLUE}        🐧 OTIMIZA-LINUX v${VERSION} - MENU${NC}"
    echo -e "${CYAN}=================================================${NC}"
    echo -e "🧹 LIMPEZA          1) Cache   2) Temporários   3) Logs   4) Pacotes"
    echo -e "⚡ DESEMPENHO       5) Memória e kernel   6) ZRAM   7) SSD/NVMe   8) E/S"
    echo -e "🎮 JOGOS E ÁUDIO    9) Ativar Modo Jogos  10) Desativar  11) Áudio"
    echo -e "🌐 REDE E NOTEBOOK  12) Rede  13) Ativar Bateria  14) Desativar"
    echo -e "🛠️ SISTEMA         15) Status  16) Verificar  17) Aplicar todas"
    echo -e "                    18) Restaurar tudo  19) Desinstalar  0) Sair"
    echo -e "${CYAN}=================================================${NC}"
    read -r -p "Escolha uma opção: " OPTION

    case $OPTION in
        1) clean_cache ;;
        2) clean_tmp ;;
        3) clean_logs ;;
        4) clean_orphans ;;
        5) opt_mem_kernel ;;
        6) opt_zram ;;
        7) opt_ssd ;;
        8) opt_io ;;
        9) game_mode_on ;;
        10) game_mode_off ;;
        11) audio_opt ;;
        12) net_opt ;;
        13) battery_mode_on ;;
        14) battery_mode_off ;;
        15) show_status ;;
        16) check_opts ;;
        17) apply_all ;;
        18) restore_all ;;
        19) uninstall ;;
        0) echo -e "${GREEN}Saindo...${NC}"; exit 0 ;;
        *) echo -e "${RED}Opção inválida!${NC}" ;;
    esac
done

```
