import {
  BatteryFull,
  Bell,
  CreditCard,
  GraduationCap,
  Home,
  Mail,
  Menu,
  Signal,
  User,
  VolumeX,
  Wifi,
  X,
} from "lucide-react";

const fields = [
  { label: "Semestre de ingresso", value: "2024/1" },
  { label: "Forma de ingresso", value: "Processo seletivo" },
  { label: "Situação", value: "NORMAL" },
  { label: "Estado", value: "Ativo" },
  { label: "Subdivisão de curso", value: "FÍSICA - 02004PD001/Presencial/DIURNO" },
  { label: "Versão curricular", value: "D-20191/9" },
];

export default function CarteirinhaPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] bg-white rounded-[2rem] overflow-hidden shadow-xl">
        {/* Error banner + status bar */}
        <div className="bg-red-600 text-white px-4 pt-3 pb-3">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span>22:56</span>
            <div className="flex items-center gap-1.5">
              <VolumeX size={13} />
              <Wifi size={13} />
              <Signal size={13} />
              <span className="flex items-center gap-0.5 bg-white/20 rounded-full px-1.5 py-0.5">
                <BatteryFull size={13} />
                34
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold leading-tight">Erro</div>
              <div className="text-sm leading-snug">
                Não há carteira do aluno para esse registro.
              </div>
            </div>
            <button
              type="button"
              aria-label="Fechar"
              className="w-7 h-7 shrink-0 rounded-full bg-white/90 text-red-600 flex items-center justify-center"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="relative bg-gradient-to-b from-blue-400 to-blue-800 pt-8 pb-8 px-6 text-center overflow-hidden">
          <svg
            className="absolute inset-x-0 bottom-0 w-full h-24 text-blue-900/40"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,40 C100,90 300,0 400,50 L400,100 L0,100 Z"
            />
          </svg>
          <svg
            className="absolute inset-x-0 bottom-0 w-full h-16 text-blue-950/50"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,60 C120,20 280,90 400,30 L400,100 L0,100 Z"
            />
          </svg>

          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-950 flex items-center justify-center">
              <CreditCard size={28} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="text-white font-semibold tracking-wide">
              ARIEL DE SOUSA AMARAL
            </div>
            <div className="text-white/90 text-sm mt-1">2024009934</div>
            <div className="text-white/90 text-sm">GRADUAÇÃO</div>
          </div>
        </div>

        {/* Icon strip */}
        <div className="bg-blue-950 flex items-center justify-around py-4">
          <button type="button" aria-label="Perfil" className="text-white/90">
            <User size={20} />
          </button>
          <button type="button" aria-label="Mensagens" className="text-white/70">
            <Mail size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 flex flex-col gap-5">
          {fields.map((field) => (
            <div key={field.label}>
              <div className="text-blue-900 font-medium text-[15px]">
                {field.label}
              </div>
              <div className="text-gray-400 text-[15px] mt-0.5">
                {field.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="border-t border-gray-200 flex items-center justify-around py-3">
          <User size={22} className="text-blue-900" />
          <GraduationCap size={22} className="text-gray-300" />
          <Home size={22} className="text-gray-300" />
          <Bell size={22} className="text-gray-300" />
          <Menu size={22} className="text-gray-300" />
        </div>
        <div className="flex justify-center pb-2 pt-1">
          <div className="w-32 h-1 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
