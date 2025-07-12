import React, { useState, useRef, useEffect } from "react";
import { Bell, Home, User, X, Plus, Upload } from "lucide-react";
import { createQuestion, getPopularTags } from "../services/questionService";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

const AskQuestionPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // Available tags for suggestions - will be populated from API
  const [availableTags, setAvailableTags] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Express",
    "Vue.js",
    "Angular",
    "TypeScript",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "Docker",
    "AWS",
    "Git",
    "API",
    "Database",
    "Frontend",
    "Backend",
    "Full-stack",
    "Mobile",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Testing",
    "Performance",
    "Security",
    "Authentication",
    "JWT",
    "REST",
    "GraphQL",
    "Redux",
    "Webpack",
  ]);

  // Load popular tags on component mount
  useEffect(() => {
    const loadPopularTags = async () => {
      try {
        const response = await getPopularTags();
        if (response.success && response.data) {
          const tagNames = response.data.map((tag) => tag.name);
          setAvailableTags((prevTags) => {
            // Combine API tags with default tags, removing duplicates
            const combined = [...new Set([...prevTags, ...tagNames])];
            return combined;
          });
        }
      } catch (error) {
        console.error("Error loading popular tags:", error);
        // Keep default tags if API fails
      }
    };

    loadPopularTags();
  }, []);

  const handleTagInput = (e) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.trim() && (e.key === "Enter" || e.key === ",")) {
      e.preventDefault();
      addTag(value.trim());
    }
  };

  const addTag = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setUploadedImages((prev) => [
            ...prev,
            { file, url: imageUrl, name: file.name },
          ]);

          // Insert image markdown into description
          const imageMarkdown = `![${file.name}](${imageUrl})\n`;
          setDescription((prev) => prev + imageMarkdown);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim() || selectedTags.length === 0) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const questionData = {
        title: title.trim(),
        description: description.trim(),
        tags: selectedTags,
        images: uploadedImages,
      };

      const response = await createQuestion(questionData);

      if (response.success) {
        setSuccess("Question submitted successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setSelectedTags([]);
        setUploadedImages([]);

        // Redirect to the question page after a short delay
        setTimeout(() => {
          navigate(`/question/${response.data._id}`);
        }, 1500);
      } else {
        setError(response.message || "Failed to submit question");
      }
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("An error occurred while submitting your question");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Ask Question
          </h2>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your question"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific and imagine you're asking a question to another
                person
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>

              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide detailed information about your question. Include what you've tried and what specific help you need."
                rows={12}
              />

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setUploadedImages((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tags *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Type tags and press Enter (e.g., React, JavaScript, Node.js)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {/* Tag Suggestions */}
                {tagInput && filteredTags.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto z-10">
                    {filteredTags.slice(0, 10).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-1">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Question"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Link Dialog */}
      {/* This section is no longer needed as RichTextEditor handles formatting */}
      {/* {showLinkDialog && (
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
      )} */}
    </div>
  );
};

export default AskQuestionPage;
