import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleContentProps {
  markdown: string;
  className?: string;
}

/**
 * Hiển thị Markdown an toàn:
 * - không dùng rehype-raw → HTML thô trong Markdown không được render;
 * - không dùng dangerouslySetInnerHTML;
 * - ảnh Markdown bị loại bỏ (MVP chỉ có ảnh bìa);
 * - liên kết ngoài mở tab mới với rel="noopener noreferrer".
 */
export default function ArticleContent({ markdown, className }: ArticleContentProps) {
  return (
    <div
      className={
        "prose prose-neutral max-w-none prose-headings:font-serif prose-headings:text-foreground " +
        "prose-a:text-accent prose-strong:text-foreground " +
        (className ?? "")
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        disallowedElements={["img"]}
        components={{
          a: ({ href, children }) => {
            const external = /^https?:\/\//i.test(href ?? "");
            return external ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <a href={href}>{children}</a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
