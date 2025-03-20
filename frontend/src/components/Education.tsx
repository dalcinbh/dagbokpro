import { EducationEntry } from "../types";

interface EducationProps {
  items: EducationEntry[];
}

const Education: React.FC<EducationProps> = ({ items }) => {
  return (
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education</h2>
      {items && items.length > 0 ? (
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          {items.map((entry, index) => (
            <li key={index} className="ml-4">
              <strong className="text-gray-900">{entry.institution}:</strong> {entry.degree}, {entry.year}
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