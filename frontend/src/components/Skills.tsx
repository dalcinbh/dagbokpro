// Define uma interface para as propriedades do componente Skills, com um campo opcional para a lista de habilidades
interface SkillsProps {
  items?: string[]; // Array opcional contendo as habilidades do usuário
}

// Componente funcional Skills que exibe uma lista de habilidades, utilizando React.FC para tipagem
const Skills: React.FC<SkillsProps> = ({ items }) => {
  // Renderiza uma seção com a lista de habilidades
  return (
    // Seção estilizada com fundo branco, padding, bordas arredondadas e sombra
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      {/* Título "Skills" com fonte grande, negrito e cor escura */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
      {/* Lista estilizada com marcadores de disco e espaçamento vertical entre os itens */}
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {/* Verifica se há itens na lista de habilidades e se ela não está vazia; se sim, renderiza os itens, caso contrário, exibe uma mensagem padrão */}
        {items && items.length > 0 ? (
          // Mapeia cada habilidade para criar um item da lista
          items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          // Item único exibido quando não há habilidades disponíveis
          <li>No skills available</li>
        )}
      </ul>
    </section>
  );
};

// Exporta o componente Skills como padrão para uso em outras partes da aplicação
export default Skills;