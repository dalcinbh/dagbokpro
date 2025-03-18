import os

BASE_DIR = "/home/adriano/dev/agiliza/dagbok"
LOGS_DIR = os.path.join(BASE_DIR, "logs")
EXCLUDE_FILE = os.path.join(BASE_DIR, "utils", "exclude")
OUTPUT_FILE = os.path.join(LOGS_DIR, "estrutura_com_conteudo.txt")

# Cria logs se não existir
os.makedirs(LOGS_DIR, exist_ok=True)

# Carrega EXCLUDES
exclude_dirs = set()
exclude_files = set()

if os.path.isfile(EXCLUDE_FILE):
    with open(EXCLUDE_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("DIR="):
                # Ex.: DIR=.github  -> BASE_DIR/.github
                relative_path = line[4:].lstrip("./")
                exclude_dirs.add(os.path.join(BASE_DIR, relative_path))
            elif line.startswith("FILE="):
                # Ex.: FILE=frontend/package-lock.json -> BASE_DIR/frontend/package-lock.json
                relative_path = line[5:].lstrip("./")
                exclude_files.add(os.path.join(BASE_DIR, relative_path))

# Se quiser ignorar utils mesmo que não esteja no exclude:
# exclude_dirs.add(os.path.join(BASE_DIR, "utils"))

def is_ignored_file(file_path: str) -> bool:
    """
    Retorna True se o arquivo deve ser ignorado.
    - Está listado em exclude_files
    - Tem extensão .svg
    - É binário (contém caractere nulo no início)
    """
    if file_path in exclude_files:
        return True
    if file_path.endswith(".svg"):
        return True
    try:
        with open(file_path, "rb") as bfile:
            chunk = bfile.read(1024)
            if b"\x00" in chunk:  # Sinal de arquivo binário
                return True
    except:
        # Se não conseguir ler, ignore também
        return True
    return False

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    out.write("Arquivos relevantes (conteúdo):\n\n")

    # Caminha no BASE_DIR
    for root, dirs, files in os.walk(BASE_DIR, topdown=True):
        # Se o root for ou começar com algum diretorio do exclude, pula
        if any(root == d or root.startswith(d + os.sep) for d in exclude_dirs):
            continue

        # Também filtramos dirs no nível atual
        dirs[:] = [d for d in dirs
                   if os.path.join(root, d) not in exclude_dirs]

        for filename in files:
            fullpath = os.path.join(root, filename)

            # Se for ignorado, pula
            if is_ignored_file(fullpath):
                print(f"Ignorando arquivo: {fullpath}")
                continue

            # Escreve o cabeçalho
            rel = os.path.relpath(fullpath, BASE_DIR)
            out.write("==========================================\n")
            out.write(f"Arquivo: {rel}\n")
            out.write("==========================================\n")

            # Tenta escrever o conteúdo
            try:
                with open(fullpath, "r", encoding="utf-8") as fin:
                    out.write(fin.read())
            except Exception as e:
                out.write(f"[Erro ao ler o arquivo: {e}]\n")

            out.write("\n\n")

print(f"Arquivo {OUTPUT_FILE} gerado com sucesso!")
