interface CoverLetterProps {
  content?: string;
}

const CoverLetter: React.FC<CoverLetterProps> = ({ content }) => {
  return (
    <section className="my-5">
      <h2 className="text-2xl font-semibold">Cover Letter</h2>
      <p className="mt-2">{content || "No cover letter available"}</p>
    </section>
  );
};

export default CoverLetter;