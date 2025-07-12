import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Smile,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from "lucide-react";

const RichTextEditor = ({ value, onChange, placeholder, rows = 8 }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = [
    "😀",
    "😅",
    "😍",
    "🤔",
    "😎",
    "👍",
    "👎",
    "❤️",
    "🔥",
    "💯",
    "🎉",
    "🤝",
    "💡",
    "⚡",
    "🚀",
  ];

  const handleTextFormat = (format) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        formattedText = `*${selectedText || "italic text"}*`;
        break;
      case "strikethrough":
        formattedText = `~~${selectedText || "strikethrough text"}~~`;
        break;
      case "ul":
        formattedText = `\n- ${selectedText || "list item"}`;
        break;
      case "ol":
        formattedText = `\n1. ${selectedText || "list item"}`;
        break;
      case "left":
        formattedText = `\n::: left\n${
          selectedText || "left aligned text"
        }\n:::`;
        break;
      case "center":
        formattedText = `\n::: center\n${
          selectedText || "center aligned text"
        }\n:::`;
        break;
      case "right":
        formattedText = `\n::: right\n${
          selectedText || "right aligned text"
        }\n:::`;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + emoji + value.substring(end);
    onChange(newValue);
    setShowEmojiPicker(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const linkMarkdown = `[${linkText}](${linkUrl})`;

      const newValue =
        value.substring(0, start) +
        linkMarkdown +
        value.substring(textarea.selectionEnd);
      onChange(newValue);
      setShowLinkDialog(false);
      setLinkUrl("");
      setLinkText("");

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + linkMarkdown.length,
          start + linkMarkdown.length
        );
      }, 0);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          const textarea = textareaRef.current;
          const start = textarea.selectionStart;
          const imageMarkdown = `![${file.name}](${imageUrl})\n`;

          const newValue =
            value.substring(0, start) +
            imageMarkdown +
            value.substring(textarea.selectionEnd);
          onChange(newValue);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div>
      {/* Rich Text Editor Toolbar */}
      <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => handleTextFormat("bold")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("italic")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("strikethrough")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleTextFormat("ul")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("ol")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
            title="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 grid grid-cols-5 gap-1 z-10">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 rounded text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowLinkDialog(true)}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Upload Image"
        >
          <Image className="w-4 h-4" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleTextFormat("left")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("center")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("right")}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
