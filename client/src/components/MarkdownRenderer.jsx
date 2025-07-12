import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";

const MarkdownRenderer = ({ content, className = "" }) => {
  // Process content to handle user mentions
  const processMentions = (text) => {
    // Replace @username with markdown links to user profiles
    return text.replace(/@(\w+)/g, "[@$1](/profile/$1)");
  };

  const processedContent = processMentions(content);

  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for different elements
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold text-gray-900 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-bold text-gray-900 mb-2" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-sm font-bold text-gray-900 mb-1" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-xs font-bold text-gray-900 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-gray-900" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-gray-800" {...props} />
          ),
          del: ({ node, ...props }) => (
            <del className="line-through text-gray-500" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-4"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }) => {
            if (inline) {
              return (
                <code
                  className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                />
              );
            }
            return (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code className="text-sm font-mono text-gray-800" {...props} />
              </pre>
            );
          },
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-1"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-700" {...props} />
          ),
          a: ({ node, href, children, ...props }) => {
            // Handle user profile links
            if (href && href.startsWith("/profile/")) {
              return (
                <Link
                  to={href}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                  {...props}
                >
                  {children}
                </Link>
              );
            }

            // Handle external links
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ node, ...props }) => (
            <img
              className="max-w-full h-auto rounded-lg shadow-md my-4"
              loading="lazy"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-300" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-gray-300 my-6" {...props} />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
