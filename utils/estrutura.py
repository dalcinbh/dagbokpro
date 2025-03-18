import os
import subprocess

# Define os diretórios e arquivos
BASE_DIR = "/home/adriano/dev/agiliza/dagbok"
LOGS_DIR = os.path.join(BASE_DIR, "logs")
EXCLUDE_FILE = os.path.join(BASE_DIR, "utils", "exclude")
OUTPUT_FILE = os.path.join(LOGS_DIR, "estrutura_com_conteudo.txt")
TREE_OUTPUT_FILE = os.path.join(LOGS_DIR, "estrutura_arvore.txt")

# Cria o diretório de logs se não existir
os.makedirs(LOGS_DIR, exist_ok=True)

# Lê os arquivos e diretórios a serem ignorados
exclude_dirs = set()
exclude_files = set()
if os.path.exists(EXCLUDE_FILE):
    with open(EXCLUDE_FILE, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("DIR="):
                exclude_dirs.add(os.path.join(BASE_DIR, line[4:]))
            elif line.startswith("FILE="):
                exclude_files.add(os.path.join(BASE_DIR, line[5:]))

# Adiciona utils e arquivos SVG à lista de ignorados
exclude_dirs.add(os.path.join(BASE_DIR, "utils"))

# Função para verificar se um arquivo é binário ou SVG
def is_ignored_file(file_path):
    if file_path.endswith(".svg"):
        return True
    try:
        with open(file_path, 'rb') as f:
            chunk = f.read(1024)
            return b'\x00' in chunk  # Se contiver caracteres nulos, provavelmente é binário
    except Exception:
        return True

# Gera a árvore de diretórios ignorando os excluídos
def generate_tree(base_dir, tree_output_file):
    with open(tree_output_file, "w") as f:
        f.write("Árvore de Diretórios Incluídos:\n")
        tree_cmd = ["tree", base_dir, "-a", "-I", "|".join(os.path.basename(d) for d in exclude_dirs)]
        result = subprocess.run(tree_cmd, capture_output=True, text=True)
        f.write(result.stdout + "\n\n")

# Gera a árvore e a salva separadamente
generate_tree(BASE_DIR, TREE_OUTPUT_FILE)

# Percorre os arquivos no diretório base
with open(OUTPUT_FILE, "w") as out_file:
    for root, dirs, files in os.walk(BASE_DIR, topdown=True):
        # Remove os diretórios ignorados
        dirs[:] = [d for d in dirs if os.path.join(root, d) not in exclude_dirs]
        
        for file in files:
            file_path = os.path.join(root, file)
            if file_path in exclude_files or is_ignored_file(file_path):
                print(f"Ignorando arquivo: {file_path}")
                continue
            
            print(f"Processando: {file_path}")
            out_file.write("==========================================\n")
            out_file.write(f"Arquivo: {os.path.relpath(file_path, BASE_DIR)}\n")
            out_file.write("==========================================\n")
            
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    out_file.write(f.read())
            except Exception as e:
                out_file.write(f"[Erro ao ler o arquivo: {e}]\n")
            
            out_file.write("\n\n")

print(f"Arquivo {OUTPUT_FILE} gerado com sucesso!")
print(f"Árvore dos diretórios incluídos salva em {TREE_OUTPUT_FILE}")
