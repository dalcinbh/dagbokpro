#!/bin/bash

# Define o diretório base do projeto
BASE_DIR="/home/adriano/dev/agiliza/dagbok"
LOGS_DIR="$BASE_DIR/logs"
EXCLUDE_FILE="$BASE_DIR/utils/exlude_dirs.txt"
OUTPUT_FILE="$LOGS_DIR/estrutura_com_conteudo.txt"

# Cria o diretório logs se não existir
mkdir -p "$LOGS_DIR"

# Limpa o arquivo de saída se existir
> "$OUTPUT_FILE"

# Monta a lista de exclusões dinamicamente
EXCLUDES=()
if [[ -f "$EXCLUDE_FILE" ]]; then
    while IFS= read -r line; do
        if [[ $line == DIR=* ]]; then
            EXCLUDES+=("--exclude=${line#DIR=}")
        elif [[ $line == FILE=* ]]; then
            EXCLUDES+=("--exclude=${line#FILE=}")
        fi
    done < "$EXCLUDE_FILE"
fi

# Função para verificar se um arquivo é binário
is_binary() {
    local file="$1"
    if grep -Iq . "$file"; then
        return 1 # Não é binário
    else
        return 0 # É binário
    fi
}

# Usa `/usr/bin/fdfind` para buscar arquivos, respeitando o .gitignore e excluindo arquivos/diretórios listados
/usr/bin/fdfind --type f --hidden "${EXCLUDES[@]}" . "$BASE_DIR" | while read -r file; do
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
