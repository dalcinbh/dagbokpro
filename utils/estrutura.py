import os

# Configurações
BASE_DIR = "/home/adriano/dev/agiliza/dagbok"
LOGS_DIR = os.path.join(BASE_DIR, "logs")
HEADER_FILES = os.path.join(BASE_DIR, "utils", "header.txt")  # arquivo para incluir no início do arquivo de saída
INCLUDE_FILES = os.path.join(BASE_DIR, "utils", "include_files.txt")  # Lista de arquivos a serem incluídos
OUTPUT_FILE = os.path.join(LOGS_DIR, "conteudo_arquivos_relevantes.txt")  # Arquivo de saída

# Cria o diretório de logs se não existir
os.makedirs(LOGS_DIR, exist_ok=True)

# Função para carregar a lista de arquivos a serem incluídos
def load_include_list(file_path: str) -> list:
    """
    Carrega um arquivo de texto com os caminhos dos arquivos a serem incluídos (um por linha).
    Retorna uma lista com os caminhos completos.
    """
    include_list = []
    if os.path.isfile(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:  # Ignora linhas vazias
                    include_list.append(line)  # Adiciona o caminho completo à lista
    return include_list

# Função para carregar o conteúdo do cabeçalho
def load_header(file_path: str) -> str:
    """
    Carrega o conteúdo do arquivo de cabeçalho.
    Retorna o conteúdo como string ou uma mensagem de erro se o arquivo não existir.
    """
    if os.path.isfile(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            return f"[Erro ao ler o cabeçalho: {e}]"
    return "[Arquivo de cabeçalho não encontrado]"

# Carrega a lista de arquivos a serem incluídos
include_files = load_include_list(INCLUDE_FILES)

# Carrega o conteúdo do cabeçalho
header_content = load_header(HEADER_FILES)

# Gera o arquivo de saída
with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    # Escreve o cabeçalho no início do arquivo de saída
    out.write(header_content)
    out.write("\n\n")  # Adiciona duas linhas em branco após o cabeçalho

    # Processa cada arquivo na lista de inclusão
    for file_path in include_files:
        # Verifica se o arquivo existe
        if not os.path.isfile(file_path):
            print(f"Arquivo não encontrado: {file_path}")
            continue

        # Escreve o cabeçalho do arquivo no arquivo de saída
        rel_path = os.path.relpath(file_path, BASE_DIR)
        out.write("==========================================\n")
        out.write(f"Arquivo: {rel_path}\n")
        out.write("==========================================\n")

        # Tenta escrever o conteúdo do arquivo
        try:
            with open(file_path, "r", encoding="utf-8") as fin:
                out.write(fin.read())
        except Exception as e:
            out.write(f"[Erro ao ler o arquivo: {e}]\n")

        out.write("\n\n")

print(f"Arquivo {OUTPUT_FILE} gerado com sucesso!")