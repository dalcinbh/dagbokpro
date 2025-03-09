interface SkillsProps {
  items?: string[];
}

const Skills: React.FC<SkillsProps> = ({ items }) => {
  return (
    <section className="my-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {items && items.length > 0 ? (
          items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No skills available</li>
        )}
      </ul>
    </section>
  );
};

export default Skills;