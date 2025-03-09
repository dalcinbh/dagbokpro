interface Summary {
  professional_summary?: string;
}

interface AdditionalInformation {
  languages?: string[] | string; // Permitir string ou array para flexibilidade
  citizenship?: string;
  availability?: string;
  interests?: string;
}

interface AboutMeProps {
  content?: Summary;
  additionalInfo?: AdditionalInformation;
}

const AboutMe: React.FC<AboutMeProps> = ({ content, additionalInfo }) => {
  // Converter languages para array, se for string ou undefined
  const languagesArray = Array.isArray(additionalInfo?.languages)
    ? additionalInfo.languages
    : additionalInfo?.languages
    ? [additionalInfo.languages]
    : [];

  return (
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
      {content?.professional_summary ? (
        <p className="text-gray-700 leading-relaxed">{content.professional_summary}</p>
      ) : (
        <p className="text-gray-700 leading-relaxed">No about me section available</p>
      )}
      {additionalInfo && (
        <div className="mt-4">
          {additionalInfo.availability && (
            <p className="text-gray-700">
              <strong className="text-gray-900">Availability:</strong>{' '}
              {additionalInfo.availability}
            </p>
          )}
          {additionalInfo.interests && (
            <p className="mt-2 text-gray-700">
              <strong className="text-gray-900">Interests:</strong>{' '}
              {additionalInfo.interests}
            </p>
          )}
          {languagesArray.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Languages</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
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

export default AboutMe;