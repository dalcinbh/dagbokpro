#!/bin/bash

# Define o diretório base do projeto
BASE_DIR="/home/adriano/dev/agiliza/dagbok"
LOGS_DIR="$BASE_DIR/logs"
EXCLUDE_FILE="$BASE_DIR/utils/exclude"
OUTPUT_FILE="$LOGS_DIR/estrutura_com_conteudo.txt"

# Cria o diretório logs se não existir
mkdir -p "$LOGS_DIR"

# Limpa o arquivo de saída se existir
> "$OUTPUT_FILE"

# Função para verificar se um arquivo é binário
is_binary() {
    grep -Iq . "$1" 2>/dev/null
    [[ $? -eq 1 ]] && return 0 || return 1
}

# Função para gerar a árvore de diretórios incluídos
generate_tree() {
    local base_dir="$1"
    local exclude_file="$2"
    local output_file="$3"

    # Constrói a lista de exclusões para o comando `tree`
    local tree_excludes=()
    if [[ -f "$exclude_file" ]]; then
        while IFS= read -r line; do
            if [[ $line == DIR=* ]]; then
                dir_pattern="${line#DIR=}"
                tree_excludes+=("--exclude=${dir_pattern}")
                tree_excludes+=("--exclude=${dir_pattern}/**")  # Exclui recursivamente
            elif [[ $line == FILE=* ]]; then
                file_pattern="${line#FILE=}"
                tree_excludes+=("--exclude=${file_pattern}")
            fi
        done < "$exclude_file"
    fi

    # Gera a árvore de diretórios e salva no arquivo de saída
    echo "Árvore de Diretórios Incluídos:" >> "$output_file"
    tree "$base_dir" -a -I '.git|node_modules|venv|__pycache__|.next|out|.vscode|zappa_logs|logs' "${tree_excludes[@]}" >> "$output_file"
    echo -e "\n\n" >> "$output_file"
}

# Gera a árvore de diretórios no início do arquivo de saída
generate_tree "$BASE_DIR" "$EXCLUDE_FILE" "$OUTPUT_FILE"

# Monta a lista de exclusões dinamicamente para o fdfind
EXCLUDES=()
if [[ -f "$EXCLUDE_FILE" ]]; then
    while IFS= read -r line; do
        if [[ $line == DIR=* ]]; then
            dir_pattern="${line#DIR=}"
            EXCLUDES+=("--exclude=${dir_pattern}")
            EXCLUDES+=("--exclude=${dir_pattern}/**")  # Exclui recursivamente
        elif [[ $line == FILE=* ]]; then
            file_pattern="${line#FILE=}"
            EXCLUDES+=("--exclude=${file_pattern}")
        fi
    done < "$EXCLUDE_FILE"
fi

# Usa `/usr/bin/fdfind` para buscar arquivos, respeitando o .gitignore e excluindo arquivos/diretórios listados
/usr/bin/fdfind --type f --hidden --full-path . "$BASE_DIR" "${EXCLUDES[@]}" | while read -r file; do
    # Verifica se o arquivo está explicitamente listado em FILE no EXCLUDE_FILE
    skip_file=0
    while IFS= read -r exclude; do
        if [[ $exclude == FILE=* ]]; then
            pattern="${exclude#FILE=}"
            pattern="${pattern#./}"  # Normaliza o caminho removendo ./
            full_path="$BASE_DIR/$pattern"
            if [[ "$file" == "$full_path" ]]; then
                echo "Ignorando arquivo: $file"
                skip_file=1
                break
            fi
        fi
    done < "$EXCLUDE_FILE"
    [[ $skip_file -eq 1 ]] && continue

    # Ignorar arquivos binários
    if is_binary "$file"; then
        echo "Ignorando binário: $file"
        continue
    fi

    echo "Processando: $file"

    # Adiciona o cabeçalho com o caminho relativo do arquivo
    echo "==========================================" >> "$OUTPUT_FILE"
    echo "Arquivo: ${file#$BASE_DIR/}" >> "$OUTPUT_FILE"
    echo "==========================================" >> "$OUTPUT_FILE"

    # Adiciona o conteúdo do arquivo
    cat "$file" >> "$OUTPUT_FILE"
    
    # Linha em branco para separação entre arquivos
    echo -e "\n\n" >> "$OUTPUT_FILE"
done

echo "Arquivo $OUTPUT_FILE gerado com sucesso!"