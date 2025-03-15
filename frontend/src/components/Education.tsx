// Define uma interface para cada entrada de educação, permitindo chaves dinâmicas com valores que podem ser string ou array de strings
interface EducationEntry {
  [key: string]: string | string[]; // Chave dinâmica (ex.: nome da instituição) mapeia para detalhes, que podem ser uma string única ou um array de strings
}

// Define a interface de propriedades do componente Education, com um campo opcional para os itens de educação
interface EducationProps {
  items?: EducationEntry; // Objeto opcional contendo entradas de educação, onde cada chave representa uma instituição
}

// Componente funcional Education que exibe informações educacionais, utilizando React.FC para tipagem
const Education: React.FC<EducationProps> = ({ items }) => {
  // Renderiza uma seção com a lista de formações educacionais
  return (
    // Seção estilizada com fundo branco, padding, bordas arredondadas e sombra
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      {/* Título "Education" com fonte grande, negrito e cor escura */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
      {/* Verifica se há itens de educação e se o objeto não está vazio; se sim, renderiza a lista, caso contrário, exibe uma mensagem padrão */}
      {items && Object.keys(items).length > 0 ? (
        // Lista estilizada com marcadores de disco e espaçamento vertical entre os itens
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          {/* Mapeia as entradas do objeto items, onde cada entrada contém a instituição e os detalhes associados */}
          {Object.entries(items).map(([institution, details], index) => (
            // Item da lista com margem à esquerda para melhor alinhamento visual
            <li key={index} className="ml-4">
              {/* Nome da instituição em negrito e cor escura */}
              <strong className="text-gray-900">{institution}:</strong>{' '}
              {/* Verifica se os detalhes são um array; se sim, mapeia cada item do array, caso contrário, exibe a string diretamente */}
              {Array.isArray(details)
                ? details.map((detail, idx) => (
                    // Cada detalhe é renderizado como um span com margem à esquerda
                    <span key={idx} className="ml-1">
                      {detail}
                      {/* Adiciona uma vírgula e espaço entre os detalhes, exceto no último item */}
                      {idx < details.length - 1 ? ', ' : ''}
                    </span>
                  ))
                : details}
            </li>
          ))}
        </ul>
      ) : (
        // Mensagem exibida quando não há entradas de educação disponíveis
        <p className="text-gray-700">No education entries available</p>
      )}
    </section>
  );
};

// Exporta o componente Education como padrão para uso em outras partes da aplicação
export default Education;