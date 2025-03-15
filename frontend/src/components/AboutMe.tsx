// Define uma interface para o resumo profissional, com um campo opcional para o texto do resumo
interface Summary {
  professional_summary?: string; // Campo opcional que armazena o resumo profissional do usuário
}

// Define uma interface para informações adicionais do usuário, como idiomas, cidadania, disponibilidade e interesses
interface AdditionalInformation {
  languages?: string[] | string; // Permite flexibilidade ao aceitar um array de idiomas ou uma única string
  citizenship?: string; // Campo opcional para a cidadania do usuário
  availability?: string; // Campo opcional para a disponibilidade do usuário (ex.: "Full-time", "Freelance")
  interests?: string; // Campo opcional para os interesses do usuário
}

// Define a interface de propriedades do componente AboutMe, que recebe conteúdo e informações adicionais
interface AboutMeProps {
  content?: Summary; // Objeto opcional contendo o resumo profissional
  additionalInfo?: AdditionalInformation; // Objeto opcional contendo informações adicionais do usuário
}

// Componente funcional AboutMe que exibe informações sobre o usuário, utilizando React.FC para tipagem
const AboutMe: React.FC<AboutMeProps> = ({ content, additionalInfo }) => {
  // Normaliza a propriedade languages para um array, garantindo compatibilidade com string ou array
  // Se languages for um array, usa diretamente; se for uma string, converte para array; se não existir, retorna array vazio
  const languagesArray = Array.isArray(additionalInfo?.languages)
    ? additionalInfo.languages
    : additionalInfo?.languages
    ? [additionalInfo.languages]
    : [];

  // Renderiza uma seção com informações sobre o usuário
  return (
    // Seção estilizada com fundo branco, padding, bordas arredondadas e sombra
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      {/* Título da seção "About Me" com fonte grande e cor escura */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
      {/* Verifica se há um resumo profissional; se sim, exibe o texto, caso contrário, mostra uma mensagem padrão */}
      {content?.professional_summary ? (
        <p className="text-gray-700 leading-relaxed">{content.professional_summary}</p>
      ) : (
        <p className="text-gray-700 leading-relaxed">No about me section available</p>
      )}
      {/* Verifica se há informações adicionais e, se houver, renderiza os detalhes */}
      {additionalInfo && (
        <div className="mt-4">
          {/* Exibe a disponibilidade do usuário, se disponível, com rótulo em negrito */}
          {additionalInfo.availability && (
            <p className="text-gray-700">
              <strong className="text-gray-900">Availability:</strong>{' '}
              {additionalInfo.availability}
            </p>
          )}
          {/* Exibe os interesses do usuário, se disponíveis, com rótulo em negrito */}
          {additionalInfo.interests && (
            <p className="mt-2 text-gray-700">
              <strong className="text-gray-900">Interests:</strong>{' '}
              {additionalInfo.interests}
            </p>
          )}
          {/* Verifica se há idiomas para exibir e, se houver, renderiza uma lista */}
          {languagesArray.length > 0 && (
            <div className="mt-2">
              {/* Subtítulo "Languages" com fonte média e cor escura */}
              <h3 className="text-xl font-medium text-gray-800 mb-2">Languages</h3>
              {/* Lista de idiomas em formato de bullet points */}
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {/* Mapeia o array de idiomas para criar itens de lista, usando o índice como chave */}
                {languagesArray.map((lang, index) => (
                  <li key={index}>{lang}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// Exporta o componente AboutMe como padrão para uso em outras partes da aplicação
export default AboutMe;