// Define uma interface para cada entrada de experiência profissional, com campos opcionais para informações relevantes
interface ExperienceEntry {
  company?: string; // Nome da empresa onde a experiência ocorreu
  role?: string; // Cargo ou função exercida na empresa
  timeline?: string; // Período de tempo da experiência (ex.: "jan 2020 - dez 2021")
  description?: string; // Descrição geral das responsabilidades ou contexto da experiência
  highlights?: string[]; // Lista de conquistas ou destaques específicos durante a experiência
}

// Define a interface de propriedades do componente Experience, com um campo opcional para a lista de experiências
interface ExperienceProps {
  items?: ExperienceEntry[]; // Array opcional contendo entradas de experiência profissional
}

// Componente funcional Experience que exibe uma lista de experiências profissionais, utilizando React.FC para tipagem
const Experience: React.FC<ExperienceProps> = ({ items }) => {
  // Renderiza uma seção com a lista de experiências profissionais
  return (
    // Seção estilizada com fundo branco, padding, bordas arredondadas e sombra
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      {/* Título "Experience" com fonte grande, negrito e cor escura */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
      {/* Verifica se há itens de experiência e se a lista não está vazia; se sim, renderiza os itens, caso contrário, exibe uma mensagem padrão */}
      {items && items.length > 0 ? (
        // Mapeia cada entrada de experiência para criar uma seção individual
        items.map((item, index) => (
          // Divisão para cada experiência, com margem inferior, borda inferior e sem borda no último item
          <div key={index} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
            {/* Exibe o nome da empresa, se disponível, com fonte média e cor escura */}
            {item.company && (
              <h3 className="text-xl font-medium text-gray-800">{item.company}</h3>
            )}
            {/* Exibe o cargo, se disponível, com texto em cinza claro */}
            {item.role && <p className="text-gray-600">{item.role}</p>}
            {/* Exibe o período de tempo, se disponível, com texto em cinza claro */}
            {item.timeline && <p className="text-gray-600">{item.timeline}</p>}
            {/* Exibe a descrição da experiência, se disponível, com margem superior e texto em cinza escuro */}
            {item.description && (
              <p className="mt-2 text-gray-700">{item.description}</p>
            )}
            {/* Verifica se há destaques e se a lista não está vazia; se sim, renderiza os destaques em uma lista */}
            {item.highlights && item.highlights.length > 0 && (
              // Lista estilizada com marcadores de disco, margem superior e espaçamento vertical entre os itens
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                {/* Mapeia cada destaque para criar um item da lista */}
                {item.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        // Mensagem exibida quando não há entradas de experiência disponíveis
        <p className="text-gray-700">No experience entries available</p>
      )}
    </section>
  );
};

// Exporta o componente Experience como padrão para uso em outras partes da aplicação
export default Experience;