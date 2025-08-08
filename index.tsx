import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const PSYCH_METHODS = [
  'Dringlichkeit', 'Verknappung', 'Social Proof', 'Autorität',
  'Sympathie', 'Gegenseitigkeit', 'Commitment & Konsistenz',
  'Verlustangst', 'Neugierde', 'Exklusivität'
];

const TEXT_LENGTHS = {
  'Kurz & Knackig': 'Sehr kurzer Text, ideal für Headlines, Social Media Ads oder Tweets.',
  'Standard': 'Ein ausgewogener Text, passend für die meisten Social Media Posts oder E-Mail Teaser.',
  'Ausführlich': 'Ein längerer, detaillierterer Text, geeignet für Blog-Einleitungen oder Landing-Page-Sektionen.'
};


const CopyButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="copy-button" title="Kopieren">
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25H9a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
      )}
    </button>
  );
};

const App = () => {
  const [productInfo, setProductInfo] = useState('');
  const [platform, setPlatform] = useState('Facebook Ad');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [textLength, setTextLength] = useState('Standard');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMethodToggle = (method: string) => {
    setSelectedMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productInfo) {
      setError('Bitte geben Sie eine Produktinformation ein.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productInfo,
          platform,
          selectedMethods,
          textLength,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ein Fehler ist aufgetreten.');
      }
      
      const parsedResult = await response.json();
      setResults(parsedResult);

    } catch (e) {
      console.error(e);
      setError(`Ein Fehler ist aufgetreten: ${e.message}. Bitte versuchen Sie es mit einer anderen Eingabe erneut.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1>KI Copy-Assistent Pro</h1>
          <p>Generieren Sie meisterhafte Werbetexte, die auf psychologischen Triggern basieren und für jede Plattform optimiert sind.</p>
        </div>
      </header>
      <main className="container">
        <aside className="sidebar">
          <form onSubmit={handleSubmit} className="input-form">
            <div className="form-group">
              <label htmlFor="product-info">1. Produkt / Dienstleistung beschreiben</label>
              <textarea
                id="product-info"
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                placeholder="z.B. Ein nachhaltiger Rucksack aus recycelten Meeresplastik, wasserdicht, mit Laptopfach und Anti-Diebstahl-System..."
                rows={6}
                aria-required="true"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="platform">2. Werbeformat / Plattform wählen</label>
              <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option>Facebook Ad</option>
                <option>Instagram Post</option>
                <option>Google Ads</option>
                <option>LinkedIn Post</option>
                <option>B2B Kaltakquise E-Mail</option>
                <option>Follow-Up E-Mail</option>
                <option>Newsletter Teaser</option>
                <option>Blog Post (Ideen & Gliederung)</option>
                <option>Artikel (Einleitung)</option>
                <option>Landing Page (Hero-Sektion)</option>
              </select>
            </div>

             <div className="form-group">
              <label>3. Psychologische Methoden (Optional)</label>
              <div className="methods-grid">
                {PSYCH_METHODS.map(method => (
                  <button
                    type="button"
                    key={method}
                    className={`method-tag ${selectedMethods.includes(method) ? 'selected' : ''}`}
                    onClick={() => handleMethodToggle(method)}
                    aria-pressed={selectedMethods.includes(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
                <label htmlFor="text-length">4. Gewünschte Textlänge</label>
                <select id="text-length" value={textLength} onChange={(e) => setTextLength(e.target.value)}>
                    {Object.keys(TEXT_LENGTHS).map(key => (
                        <option key={key} value={key}>{key}</option>
                    ))}
                </select>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Generiere...' : 'Texte generieren'}
            </button>
          </form>
        </aside>

        <section className="results-container">
          {error && <div className="error-message" role="alert">{error}</div>}
          
          {loading && (
            <div className="loading-indicator" aria-label="Ladeergebnisse">
              <div className="spinner"></div>
              <p>KI analysiert, denkt und textet...</p>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
             <div className="placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="placeholder-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
              <h2>Ihre Textergebnisse erscheinen hier</h2>
              <p>Füllen Sie die Felder links aus, um zu beginnen.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="results-grid" aria-live="polite">
              {results.map((result, index) => (
                <div className="result-card" key={index}>
                  <div className="result-card-header">
                    <span className="angle-tag">{result.angle}</span>
                  </div>
                  <div className="result-content">
                    <h3>Headline</h3>
                    <p>{result.headline}</p>
                    <CopyButton textToCopy={result.headline} />
                  </div>
                   <div className="result-content">
                    <h3>Text</h3>
                    <p>{result.body}</p>
                    <CopyButton textToCopy={result.body} />
                  </div>
                   <div className="result-content">
                    <h3>Call-to-Action</h3>
                    <p>{result.cta}</p>
                    <CopyButton textToCopy={result.cta} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);