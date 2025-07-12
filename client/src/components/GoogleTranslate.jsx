// import { useEffect } from "react";

// const GoogleTranslate = () => {
//   useEffect(() => {
//     const addGoogleTranslateScript = () => {
//       const script = document.createElement("script");
//       script.type = "text/javascript";
//       script.src =
//         "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//       document.body.appendChild(script);
//     };

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//         },
//         "google_translate_element"
//       );
//     };

//     addGoogleTranslateScript();
//   }, []);

//   return <div id="google_translate_element"></div>;
// };

// export default GoogleTranslate;
