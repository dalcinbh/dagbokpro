interface HeadProps {
  title?: string;
}

const Head: React.FC<HeadProps> = ({ title }) => {
  return (
    <header className="bg-gray-100 text-center py-6 border-b border-gray-200 shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800">{title || "My Resume"}</h1>
    </header>
  );
};

export default Head;