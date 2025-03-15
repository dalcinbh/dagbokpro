// Define uma interface para as propriedades do componente Head, com um campo opcional para o título
interface HeadProps {
  title?: string; // Campo opcional que define o título do cabeçalho, como o nome do currículo
}

// Componente funcional Head que exibe o cabeçalho da página, utilizando React.FC para tipagem
const Head: React.FC<HeadProps> = ({ title }) => {
  // Renderiza o cabeçalho com o título fornecido ou um valor padrão
  return (
    // Cabeçalho estilizado com fundo cinza claro, texto centralizado, padding vertical, borda inferior e sombra leve
    <header className="bg-gray-100 text-center py-6 border-b border-gray-200 shadow-sm">
      {/* Título principal com fonte grande, negrito e cor cinza escura; exibe o título fornecido ou "My Resume" como padrão */}
      <h1 className="text-3xl font-bold text-gray-800">{title || "My Resume"}</h1>
    </header>
  );
};

// Exporta o componente Head como padrão para uso em outras partes da aplicação
export default Head;