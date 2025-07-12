import React, { useState, useRef, useEffect } from "react";
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
  Eye,
  Edit,
  AtSign,
} from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  rows = 8,
  onImageUpload,
  onMention,
  availableUsers = [],
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const linkDialogRef = useRef(null);
  const mentionSuggestionsRef = useRef(null);

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
    "🎯",
    "✨",
    "🌟",
    "💪",
    "👏",
    "🙏",
    "🤗",
    "😊",
    "😄",
    "😆",
    "😂",
    "🤣",
    "😉",
    "😋",
    "😎",
  ];

  // Filter users based on mention query
  const filteredUsers = availableUsers
    .filter(
      (user) =>
        user.username?.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(mentionQuery.toLowerCase())
    )
    .slice(0, 5);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        linkDialogRef.current &&
        !linkDialogRef.current.contains(event.target)
      ) {
        setShowLinkDialog(false);
      }
      if (
        mentionSuggestionsRef.current &&
        !mentionSuggestionsRef.current.contains(event.target)
      ) {
        setShowMentionSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mention detection
  useEffect(() => {
    if (!textareaRef.current || isPreviewMode) return;

    const handleInput = (e) => {
      const textarea = e.target;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPosition);

      // Check for @ symbol
      const atIndex = textBeforeCursor.lastIndexOf("@");
      if (atIndex !== -1) {
        // Check if @ is at the beginning or preceded by whitespace
        const beforeAt = textBeforeCursor.substring(0, atIndex);
        if (atIndex === 0 || /\s$/.test(beforeAt)) {
          const query = textBeforeCursor.substring(atIndex + 1);
          setMentionQuery(query);
          setMentionStartIndex(atIndex);
          setShowMentionSuggestions(true);
          setSelectedMentionIndex(0);
          return;
        }
      }

      setShowMentionSuggestions(false);
    };

    const textarea = textareaRef.current;
    textarea.addEventListener("input", handleInput);
    return () => textarea.removeEventListener("input", handleInput);
  }, [value, isPreviewMode, availableUsers]);

  // Handle mention keyboard navigation
  useEffect(() => {
    if (!showMentionSuggestions) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev > 0 ? prev - 1 : filteredUsers.length - 1
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          insertMention(filteredUsers[selectedMentionIndex]);
        }
      } else if (e.key === "Escape") {
        setShowMentionSuggestions(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMentionSuggestions, selectedMentionIndex, filteredUsers]);

  const insertMention = (user) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const mentionText = `@${user.username}`;
    const beforeMention = value.substring(0, mentionStartIndex);
    const afterMention = value.substring(textarea.selectionStart);
    const newValue = beforeMention + mentionText + " " + afterMention;

    onChange(newValue);
    setShowMentionSuggestions(false);
    setMentionQuery("");
    setMentionStartIndex(-1);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = mentionStartIndex + mentionText.length + 1;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    // Call onMention callback if provided
    if (onMention) {
      onMention(user);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            handleTextFormat("bold");
            break;
          case "i":
            e.preventDefault();
            handleTextFormat("italic");
            break;
          case "u":
            e.preventDefault();
            handleTextFormat("strikethrough");
            break;
          case "k":
            e.preventDefault();
            setShowLinkDialog(true);
            break;
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea && !isPreviewMode) {
      textarea.addEventListener("keydown", handleKeyDown);
      return () => textarea.removeEventListener("keydown", handleKeyDown);
    }
  }, [value, isPreviewMode]);

  const handleTextFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

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

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + emoji + value.substring(end);
    onChange(newValue);
    setShowEmojiPicker(false);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const textarea = textareaRef.current;
      if (!textarea) return;

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
        const newCursorPos = start + linkMarkdown.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size must be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          const textarea = textareaRef.current;
          if (!textarea) return;

          const start = textarea.selectionStart;
          const imageMarkdown = `![${file.name}](${imageUrl})\n`;

          const newValue =
            value.substring(0, start) +
            imageMarkdown +
            value.substring(textarea.selectionEnd);
          onChange(newValue);

          // If onImageUpload callback is provided, call it with the file
          if (onImageUpload) {
            onImageUpload(file, imageUrl);
          }

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          // Focus back to textarea
          setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + imageMarkdown.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file");
      }
    });
  };

  const handleLinkKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insertLink();
    }
  };

  return (
    <div className="relative">
      {/* Rich Text Editor Toolbar */}
      <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`p-2 rounded text-gray-600 hover:text-gray-800 transition-colors ${
            isPreviewMode ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
          }`}
          title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
        >
          {isPreviewMode ? (
            <Edit className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleTextFormat("bold")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("italic")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("strikethrough")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Strikethrough (Ctrl+U)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => handleTextFormat("ul")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("ol")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <div className="relative" ref={emojiPickerRef}>
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={isPreviewMode}
            className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 grid grid-cols-6 gap-1 z-10 max-h-48 overflow-y-auto">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 rounded text-lg transition-colors"
                  title={emoji}
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
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Insert Link (Ctrl+K)"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("center")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleTextFormat("right")}
          disabled={isPreviewMode}
          className="p-2 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Editor/Preview Content */}
      {isPreviewMode ? (
        <div className="border-l border-r border-b border-gray-300 rounded-b-md p-3 bg-white min-h-[200px]">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-gray-400 italic">{placeholder}</p>
          )}
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2 border-l border-r border-b border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
        />
      )}

      {/* Mention Suggestions */}
      {showMentionSuggestions && filteredUsers.length > 0 && (
        <div
          ref={mentionSuggestionsRef}
          className="absolute z-20 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto min-w-48"
          style={{
            top: textareaRef.current
              ? textareaRef.current.offsetTop + textareaRef.current.offsetHeight
              : 0,
            left: textareaRef.current ? textareaRef.current.offsetLeft : 0,
          }}
        >
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AtSign className="w-4 h-4" />
              <span>Mention users</span>
            </div>
          </div>
          {filteredUsers.map((user, index) => (
            <button
              key={user._id || user.id}
              type="button"
              onClick={() => insertMention(user)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors ${
                index === selectedMentionIndex
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={
                    user.profilePicture ||
                    "https://tse4.mm.bing.net/th/id/OIP.l54ICAiwopa2RCt7J2URWwHaHa?pid=Api&P=0&h=180"
                  }
                  alt={user.name || user.username}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <div className="font-medium text-sm">
                    {user.name || user.username}
                  </div>
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            ref={linkDialogRef}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Insert Link</h3>
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyPress={handleLinkKeyPress}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
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
                  onKeyPress={handleLinkKeyPress}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                disabled={!linkUrl || !linkText}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
