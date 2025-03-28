"use client";

import { useState } from "react";

export function TranslationInterface() {
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("spanish");
  const [targetLang, setTargetLang] = useState("english");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://api-translate.fivepro.tech/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslatedText(data.translated_text || data.translation || data.result || "");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Text Translator</h2>
      
      <div className="mb-6">
        <label htmlFor="inputText" className="block mb-2 text-sm font-medium dark:text-white">
          Text to translate:
        </label>
        <textarea
          id="inputText"
          className="w-full p-2 border border-gray-300 rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="sourceLang" className="block mb-2 text-sm font-medium dark:text-white">
            Source Language:
          </label>
          <select
            id="sourceLang"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={`source-${lang.value}`} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="targetLang" className="block mb-2 text-sm font-medium dark:text-white">
            Target Language:
          </label>
          <select
            id="targetLang"
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={`target-${lang.value}`} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
        onClick={handleTranslate}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? "Translating..." : "Translate"}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
      
      {translatedText && !error && (
        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium dark:text-white">
            Translation:
          </label>
          <div className="p-3 bg-gray-100 rounded-lg dark:bg-zinc-700 dark:text-white">
            {translatedText}
          </div>
        </div>
      )}
    </div>
  );
} 