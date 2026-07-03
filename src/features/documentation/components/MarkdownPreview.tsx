import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  source: string;
  className?: string;
}

export default function MarkdownPreview({
  source,
  className = "",
}: MarkdownPreviewProps) {
  return (
    <div className={`markdown ${className}`.trim()}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  );
}