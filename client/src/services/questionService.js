import axiosInstance from "../Authorisation/axiosConfig";

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    const formData = new FormData();

    // Add basic question data
    formData.append("title", questionData.title);
    formData.append("description", questionData.description);

    // Add tags as JSON string
    if (questionData.tags && questionData.tags.length > 0) {
      formData.append("tags", JSON.stringify(questionData.tags));
    }

    // Add images if any
    if (questionData.images && questionData.images.length > 0) {
      questionData.images.forEach((image, index) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    }

    const response = await axiosInstance.post("/api/questions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create Question Error:", error);
    throw error;
  }
};

// Get all questions with filters
export const getQuestions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/questions", { params });
    return response.data;
  } catch (error) {
    console.error("Get Questions Error:", error);
    throw error;
  }
};

// Get a single question by ID
export const getQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.get(`/api/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Get Question Error:", error);
    throw error;
  }
};

// Get popular tags
export const getPopularTags = async () => {
  try {
    const response = await axiosInstance.get("/api/questions/tags");
    return response.data;
  } catch (error) {
    console.error("Get Tags Error:", error);
    throw error;
  }
};

// Create an answer to a question
export const createAnswer = async (questionId, answerData) => {
  try {
    const response = await axiosInstance.post(
      `/api/questions/${questionId}/answers`,
      {
        content: answerData.content,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create Answer Error:", error);
    throw error;
  }
};

// Vote on a question or answer
export const vote = async (voteData) => {
  try {
    const response = await axiosInstance.post("/api/questions/vote", voteData);
    return response.data;
  } catch (error) {
    console.error("Vote Error:", error);
    throw error;
  }
};

// Accept an answer
export const acceptAnswer = async (questionId, answerId) => {
  try {
    const response = await axiosInstance.post(
      `/api/questions/${questionId}/answers/${answerId}/accept`
    );
    return response.data;
  } catch (error) {
    console.error("Accept Answer Error:", error);
    throw error;
  }
};

// Get questions by user ID
export const getUserQuestions = async (userId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/api/questions/user/${userId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Get User Questions Error:", error);
    throw error;
  }
};

// Get answers by user ID
export const getUserAnswers = async (userId, params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/api/questions/answers/user/${userId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Get User Answers Error:", error);
    throw error;
  }
};

// Edit a question
export const editQuestion = async (questionId, questionData) => {
  try {
    const formData = new FormData();

    // Add basic question data
    formData.append("title", questionData.title);
    formData.append("description", questionData.description);

    // Add tags as JSON string
    if (questionData.tags && questionData.tags.length > 0) {
      formData.append("tags", JSON.stringify(questionData.tags));
    }

    // Add images if any
    if (questionData.images && questionData.images.length > 0) {
      questionData.images.forEach((image, index) => {
        if (image.file) {
          formData.append("images", image.file);
        }
      });
    }

    const response = await axiosInstance.put(
      `/api/questions/${questionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Edit Question Error:", error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axiosInstance.delete(`/api/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Question Error:", error);
    throw error;
  }
};

// Edit an answer
export const editAnswer = async (answerId, answerData) => {
  try {
    const response = await axiosInstance.put(
      `/api/questions/answers/${answerId}`,
      {
        content: answerData.content,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Edit Answer Error:", error);
    throw error;
  }
};

// Delete an answer
export const deleteAnswer = async (answerId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/questions/answers/${answerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Delete Answer Error:", error);
    throw error;
  }
};
