// Define uma interface para as propriedades do componente CoverLetter, com um campo opcional para o conteúdo da carta
interface CoverLetterProps {
  content?: string; // Campo opcional que armazena o texto da carta de apresentação
}

// Componente funcional CoverLetter que exibe uma carta de apresentação, utilizando React.FC para tipagem
const CoverLetter: React.FC<CoverLetterProps> = ({ content }) => {
  // Renderiza uma seção contendo a carta de apresentação
  return (
    // Seção estilizada com margem vertical (my-5) para espaçamento
    <section className="my-5">
      {/* Título "Cover Letter" com fonte grande e negrito */}
      <h2 className="text-2xl font-semibold">Cover Letter</h2>
      {/* Parágrafo que exibe o conteúdo da carta, ou uma mensagem padrão se o conteúdo não estiver disponível */}
      <p className="mt-2">{content || "No cover letter available"}</p>
    </section>
  );
};

// Exporta o componente CoverLetter como padrão para uso em outras partes da aplicação
export default CoverLetter;