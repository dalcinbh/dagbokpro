interface ExperienceEntry {
  company?: string;
  role?: string;
  timeline?: string;
  description?: string;
  highlights?: string[];
}

interface ExperienceProps {
  items?: ExperienceEntry[];
}

const Experience: React.FC<ExperienceProps> = ({ items }) => {
  return (
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Experience</h2>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
            {item.company && (
              <h3 className="text-xl font-medium text-gray-800">{item.company}</h3>
            )}
            {item.role && <p className="text-gray-600">{item.role}</p>}
            {item.timeline && <p className="text-gray-600">{item.timeline}</p>}
            {item.description && (
              <p className="mt-2 text-gray-700">{item.description}</p>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                {item.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-700">No experience entries available</p>
      )}
    </section>
  );
};

export default Experience;