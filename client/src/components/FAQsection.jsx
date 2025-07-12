import { useState } from "react";

const FAQSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const questions = [
    {
      question: "How is worker attendance recorded?",
      answer:
        "Worker attendance is recorded using our digital attendance system. Each worker logs in at the beginning of their shift, and their attendance data is securely stored for tracking and analysis.",
    },
    {
      question: "What safety protocols are in place?",
      answer:
        "Our coal mines follow strict safety protocols including regular safety drills, personal protective equipment (PPE), and continuous air quality monitoring to ensure a safe working environment.",
    },
    {
      question: "How can workers report a safety issue?",
      answer:
        "Workers can report safety issues directly through our website or by contacting the site supervisor. All reports are taken seriously and addressed promptly by our safety team.",
    },
    {
      question: "Are there emergency response systems in place?",
      answer:
        "Yes, we have a robust emergency response system, including alarms, trained personnel, and first aid stations to respond quickly to any emergency situation within the mines.",
    },
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-900">
            Find answers to common questions about worker attendance, safety
            measures, and more!
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {questions.map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-slate-300 border rounded-lg border-gray-200 shadow-lg cursor-pointer hover:bg-slate-200"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-4 sm:p-6"
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-xl font-semibold ">{item.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${
                    activeQuestion === index ? "rotate-0" : "rotate-180"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div
                className={`px-4 pb-5 sm:px-6 sm:pb-6 transition-all duration-200 ${
                  activeQuestion === index ? "block" : "hidden"
                }`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-base mt-9">
          Still have questions?{" "}
          <span className="cursor-pointer font-medium text-blue-600 transition-all duration-200 hover:underline">
            Contact our support team
          </span>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
