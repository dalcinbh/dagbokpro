interface EducationEntry {
  [key: string]: string | string[];
}

interface EducationProps {
  items?: EducationEntry;
}

const Education: React.FC<EducationProps> = ({ items }) => {
  return (
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
      {items && Object.keys(items).length > 0 ? (
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          {Object.entries(items).map(([institution, details], index) => (
            <li key={index} className="ml-4">
              <strong className="text-gray-900">{institution}:</strong>{' '}
              {Array.isArray(details)
                ? details.map((detail, idx) => (
                    <span key={idx} className="ml-1">
                      {detail}
                      {idx < details.length - 1 ? ', ' : ''}
                    </span>
                  ))
                : details}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No education entries available</p>
      )}
    </section>
  );
};

export default Education;