#!/bin/bash

# Define o diretório base do projeto (nível acima de utils)
BASE_DIR="/home/adriano/dev/agiliza/dagbok/backend"
LOGS_DIR="/home/adriano/dev/agiliza/dagbok/logs"
OUTPUT_FILE="$LOGS_DIR/estrutura_com_conteudo.txt"

# Cria o diretório logs se não existir
mkdir -p "$LOGS_DIR"

# Limpa o arquivo de saída se existir
> "$OUTPUT_FILE"

# Função para verificar se um arquivo é binário
is_binary() {
    local file="$1"
    if grep -Iq . "$file"; then
        return 1 # Não é binário
    else
        return 0 # É binário
    fi
}

# Usa `/usr/bin/fdfind` para buscar arquivos, respeitando o .gitignore e excluindo pastas irrelevantes
/usr/bin/fdfind --type f --hidden --exclude '.git' --exclude 'node_modules' --exclude 'venv' --exclude 'dist' . "$BASE_DIR" | while read -r file; do
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
