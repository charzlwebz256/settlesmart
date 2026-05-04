import { useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'so', label: 'Soomaali', flag: '🇸🇴' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

export default function LanguageTranslator() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');

  const handleSelect = (code) => {
    setCurrent(code);
    setOpen(false);
    if (code === 'en') {
      // Remove translate if switching back to English
      const el = document.getElementById('google_translate_element');
      if (el) el.innerHTML = '';
      const select = document.querySelector('.goog-te-combo');
      if (select) { select.value = 'en'; select.dispatchEvent(new Event('change')); }
      return;
    }
    // Use Google Translate element if available, else inject it
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    } else {
      // Inject Google Translate script
      if (!document.getElementById('gt-script')) {
        window.googleTranslateElementInit = function () {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: LANGUAGES.map(l => l.code).join(','), autoDisplay: false },
            'google_translate_element'
          );
        };
        const s = document.createElement('script');
        s.id = 'gt-script';
        s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(s);

        // Wait for it to load then select language
        const interval = setInterval(() => {
          const sel = document.querySelector('.goog-te-combo');
          if (sel) {
            clearInterval(interval);
            setTimeout(() => {
              sel.value = code;
              sel.dispatchEvent(new Event('change'));
            }, 500);
          }
        }, 300);
      }
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === current);

  return (
    <div className="relative">
      {/* Hidden Google Translate container */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
        title="Translate"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.label}</span>
        <span className="sm:hidden">{currentLang?.flag}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-xl shadow-xl p-2 w-44">
            <p className="text-[10px] font-semibold text-muted-foreground px-2 pb-1.5 border-b border-border mb-1">Select Language</p>
            <div className="space-y-0.5 max-h-64 overflow-y-auto">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                    current === lang.code
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}