import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  RotateCcw,
  Clock,
  FileCode,
  Palette,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { QrSize, ErrorCorrectionLevel, QrHistoryItem } from './types';
import {
  generateQrDataUrl,
  generateQrSvg,
  downloadQrCode,
  copyQrToClipboard,
  slugify,
} from './utils/qrHelper';
import { QuickPresets } from './components/QuickPresets';
import { HistoryModal } from './components/HistoryModal';

const COLOR_PALETTES = [
  { name: 'Negro clásico', value: '#000000', ring: 'bg-black' },
  { name: 'Azul Índigo', value: '#4338ca', ring: 'bg-indigo-700' },
  { name: 'Pizarra oscura', value: '#0f172a', ring: 'bg-slate-900' },
  { name: 'Verde esmeralda', value: '#065f46', ring: 'bg-emerald-800' },
];

export default function App() {
  const [inputText, setInputText] = useState<string>('');
  const [inputTitle, setInputTitle] = useState<string>('');
  const [size, setSize] = useState<QrSize>(300);
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrSvgString, setQrSvgString] = useState<string | null>(null);
  const [currentRenderedTitle, setCurrentRenderedTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<QrHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const qrWrapRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qr_generator_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToHistory = (text: string, title: string, qrSize: QrSize) => {
    const newItem: QrHistoryItem = {
      id: Date.now().toString(),
      text,
      title,
      size: qrSize,
      createdAt: Date.now(),
    };
    const updated = [newItem, ...history.filter((h) => h.text !== text)].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem('qr_generator_history', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleGenerate = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) {
      textareaRef.current?.focus();
      return;
    }

    setIsGenerating(true);
    try {
      const dataUrl = await generateQrDataUrl(trimmedText, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: '#ffffff' },
        errorCorrectionLevel: errorCorrection,
      });

      const svg = await generateQrSvg(trimmedText, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: '#ffffff' },
        errorCorrectionLevel: errorCorrection,
      });

      setQrDataUrl(dataUrl);
      setQrSvgString(svg);
      const title = inputTitle.trim();
      setCurrentRenderedTitle(title);
      saveToHistory(trimmedText, title, size);

      // Smooth scroll into view on mobile
      setTimeout(() => {
        qrWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err) {
      console.error('Error generating QR:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = async () => {
    if (!qrDataUrl) return;
    await downloadQrCode(qrDataUrl, currentRenderedTitle, size);
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugify(currentRenderedTitle || 'codigo-qr')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    const success = await copyQrToClipboard(qrDataUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setInputTitle('');
    setQrDataUrl(null);
    setQrSvgString(null);
    setCurrentRenderedTitle('');
    textareaRef.current?.focus();
  };

  const handleSelectHistory = (item: QrHistoryItem) => {
    setInputText(item.text);
    setInputTitle(item.title);
    setSize(item.size);
    // Auto generate
    setTimeout(() => {
      generateQrDataUrl(item.text, {
        width: item.size,
        margin: 2,
        color: { dark: fgColor, light: '#ffffff' },
        errorCorrectionLevel: errorCorrection,
      }).then((dataUrl) => {
        setQrDataUrl(dataUrl);
        setCurrentRenderedTitle(item.title);
      });
    }, 50);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('qr_generator_history');
    } catch {
      // ignore
    }
  };

  const handlePresetSelect = (text: string, title?: string) => {
    setInputText(text);
    if (title) setInputTitle(title);
    textareaRef.current?.focus();
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6"
      style={{
        background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      }}
    >
      {/* Top Utility Nav */}
      <div className="w-full max-w-[440px] flex items-center justify-between text-xs text-indigo-200/90 mb-3 px-1">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-white/95">
          <QrCode className="w-4 h-4 text-indigo-400" />
          <span className="text-[11.5px] uppercase">Generador de Códigos QR Gratuito</span>
        </div>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition"
              title="Ver códigos generados recientemente"
            >
              <Clock className="w-3 h-3" />
              <span>Historial ({history.length})</span>
            </button>
          )}
          {(inputText || qrDataUrl) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Limpiar formulario"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div
        id="qr-app-card"
        className="card bg-white rounded-[20px] p-6 sm:p-8 w-full max-w-[440px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/20 relative"
      >
        <h1 className="m-0 mb-1.5 text-[20px] sm:text-[21px] font-extrabold text-[#1e293b] text-center tracking-tight leading-snug">
          GENERADOR DE CÓDIGOS QR GRATUITO
        </h1>
        <p className="subtitle m-0 mb-5 text-center text-[#64748b] text-[13px] leading-relaxed">
          Generá códigos QR legibles al instante desde cualquier celular, sin costo y sin límites.
        </p>

        {/* Input Text / URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="input-text"
              className="block text-[13px] font-semibold text-[#1e293b]"
            >
              Texto o URL
            </label>
            <span className="text-[11px] text-slate-400">
              {inputText.length > 0 ? `${inputText.length} caracteres` : 'Requerido'}
            </span>
          </div>

          <textarea
            id="input-text"
            ref={textareaRef}
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://ejemplo.com o cualquier texto"
            className="w-full min-h-[86px] px-3.5 py-2.5 border border-[#e2e8f0] focus:border-[#4f46e5] rounded-xl text-sm font-normal text-[#1e293b] outline-none transition duration-150 resize-y focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
          />

          {/* Quick Presets */}
          <QuickPresets onSelectPreset={handlePresetSelect} />
        </div>

        {/* Optional Title */}
        <div className="mt-4 space-y-1.5">
          <label
            htmlFor="input-title"
            className="title-label block text-[13px] font-semibold text-[#1e293b]"
          >
            Título o descripción (opcional)
          </label>
          <input
            type="text"
            id="input-title"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Menú del restaurante"
            maxLength={60}
            className="w-full px-3.5 py-2.5 border border-[#e2e8f0] focus:border-[#4f46e5] rounded-xl text-sm text-[#1e293b] outline-none transition duration-150 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
          />
        </div>

        {/* Options Row: Size & Advanced settings toggle */}
        <div className="row flex items-center gap-2.5 mt-4">
          <select
            id="size-select"
            value={size}
            onChange={(e) => setSize(Number(e.target.value) as QrSize)}
            className="flex-1 px-3 py-2.5 rounded-[10px] border border-[#e2e8f0] text-sm text-[#1e293b] bg-white outline-none focus:border-[#4f46e5] transition font-medium cursor-pointer"
          >
            <option value="200">Tamaño chico (200px)</option>
            <option value="300">Tamaño mediano (300px)</option>
            <option value="400">Tamaño grande (400px)</option>
          </select>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2.5 rounded-[10px] border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              showAdvanced
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Personalizar color y nivel de redundancia"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-500" />
            <span>Estilo</span>
          </button>
        </div>

        {/* Advanced Options Accordion */}
        {showAdvanced && (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 animate-in fade-in duration-150">
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Color del código QR
              </span>
              <div className="flex items-center gap-2">
                {COLOR_PALETTES.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFgColor(color.value)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition ${color.ring} ${
                      fgColor === color.value
                        ? 'ring-2 ring-offset-2 ring-indigo-600 scale-105'
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    title={color.name}
                  >
                    {fgColor === color.value && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
              <span className="font-semibold text-slate-700">Corrección de errores:</span>
              <div className="flex gap-1">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setErrorCorrection(lvl)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      errorCorrection === lvl
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          id="generate-btn"
          disabled={!inputText.trim() || isGenerating}
          onClick={handleGenerate}
          className="mt-[18px] w-full py-3.5 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer transition duration-150 disabled:bg-[#cbd5e1] disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generar QR</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 text-center mt-1.5">
          Tip: Podés presionar <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border text-[10px] text-slate-500">Ctrl</kbd> + <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded border text-[10px] text-slate-500">Enter</kbd>
        </p>

        {/* QR Output Wrap */}
        {qrDataUrl && (
          <div
            id="qr-wrap"
            ref={qrWrapRef}
            className="qr-wrap visible mt-6 flex flex-col items-center gap-3.5 pt-5 border-t border-slate-100"
          >
            {currentRenderedTitle && (
              <p
                id="qr-title"
                className="qr-title visible m-0 text-base font-bold text-[#1e293b] text-center"
              >
                {currentRenderedTitle}
              </p>
            )}

            {/* QR display box */}
            <div
              id="qrcode"
              className="p-4 bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm flex items-center justify-center transition hover:shadow-md"
            >
              <img
                src={qrDataUrl}
                alt="Código QR Generado"
                className="block max-w-full h-auto"
                style={{ width: size, height: size, maxWidth: '280px', maxHeight: '280px' }}
              />
            </div>

            {/* Main Download Button */}
            <button
              id="download-btn"
              onClick={handleDownload}
              className="download-btn w-full py-3.5 px-4 bg-[#0f172a] hover:bg-[#1e293b] text-white border-none rounded-xl text-[14.5px] font-semibold cursor-pointer transition duration-150 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PNG (Alta resolución)</span>
            </button>

            {/* Secondary Action Buttons (Copy & SVG) */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                title="Copiar imagen al portapapeles"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Imagen</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                title="Descargar en formato vectorial SVG"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Vector SVG</span>
              </button>
            </div>

            <p className="hint text-xs text-[#64748b] text-center mt-0.5">
              Escaneá con la cámara del celular para acceder
            </p>
          </div>
        )}
      </div>

      {/* Authorship & Credits Footer */}
      <footer className="mt-6 text-center text-xs text-slate-300 max-w-[440px] px-2 flex flex-col items-center gap-1.5">
        <div className="w-full border-t border-white/10 pt-4 flex flex-col items-center">
          <p className="text-[12px] font-semibold text-slate-200">
            Autoría y Desarrollo:
          </p>
          <p className="text-[13px] font-bold text-white tracking-wide mt-0.5">
            Mg. Lic. Prof. Leandro Guerschberg
          </p>
          <p className="text-[11.5px] text-indigo-300 font-medium mt-0.5">
            Profesor de Informática — DCSyD — PUEF — BIO — UNPAZ
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Procesamiento 100% local en tu navegador · Sin registro ni recopilación de datos.
          </p>
        </div>
      </footer>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />
    </main>
  );
}
