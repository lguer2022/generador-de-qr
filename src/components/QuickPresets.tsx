import React from 'react';
import { Globe, Wifi, MessageCircle, Mail, FileText } from 'lucide-react';

interface QuickPresetsProps {
  onSelectPreset: (sampleText: string, sampleTitle?: string) => void;
}

export const QuickPresets: React.FC<QuickPresetsProps> = ({ onSelectPreset }) => {
  const presets = [
    {
      label: 'Web / URL',
      icon: Globe,
      text: 'https://',
      title: 'Sitio Web',
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      text: 'https://wa.me/5491100000000?text=Hola,%20quisiera%20consultar',
      title: 'Contacto WhatsApp',
    },
    {
      label: 'Wi-Fi',
      icon: Wifi,
      text: 'WIFI:S:MiRedWifi;T:WPA;P:ClaveSegura123;;',
      title: 'Acceso Wi-Fi',
    },
    {
      label: 'Email',
      icon: Mail,
      text: 'mailto:contacto@ejemplo.com?subject=Consulta',
      title: 'Enviar Correo',
    },
    {
      label: 'Texto libre',
      icon: FileText,
      text: '¡Bienvenidos! Escaneá para más información.',
      title: 'Nota informativa',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      <span className="text-xs font-medium text-slate-400 mr-1">Plantillas:</span>
      {presets.map((p) => {
        const Icon = p.icon;
        return (
          <button
            key={p.label}
            type="button"
            onClick={() => onSelectPreset(p.text, p.title)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-slate-200/70"
            title={`Cargar formato para ${p.label}`}
          >
            <Icon className="w-3 h-3 text-indigo-500" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
