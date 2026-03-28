'use client';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PrivacyModal = ({ isOpen, onClose }: TermsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#1a2332] rounded-lg shadow-xl overflow-hidden">
                
  
                <div className="sticky top-0 bg-[#1a2332] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Política de Privacidad</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

             
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-120px)] text-gray-300 space-y-4">

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">1. Información que recopilamos</h3>
                        <p className="text-sm leading-relaxed">
                            Recopilamos información personal como nombre, correo electrónico, datos de contacto
                            y cualquier otra información necesaria para prestar nuestros servicios.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">2. Uso de la información</h3>
                        <p className="text-sm leading-relaxed">
                            Utilizamos la información recopilada para operar, mejorar y personalizar nuestros servicios,
                            así como para cumplir obligaciones legales.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">3. Protección de datos</h3>
                        <p className="text-sm leading-relaxed">
                            Implementamos medidas de seguridad técnicas y organizativas para proteger
                            su información contra accesos no autorizados, pérdida o alteración.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">4. Compartición de información</h3>
                        <p className="text-sm leading-relaxed">
                            No vendemos ni comercializamos su información personal. Solo podrá compartirse
                            cuando sea necesario para prestar el servicio o por requerimiento legal.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">5. Derechos del usuario</h3>
                        <p className="text-sm leading-relaxed">
                            Usted puede solicitar el acceso, rectificación o eliminación de sus datos
                            personales conforme a la normativa vigente.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h3 className="text-xl font-semibold text-white mb-2">6. Cambios en la política</h3>
                        <p className="text-sm leading-relaxed">
                            Nos reservamos el derecho de modificar esta Política de Privacidad.
                            Los cambios serán publicados en esta sección.
                        </p>
                    </section>

                </div>

            
                <div className="sticky bottom-0 bg-[#1a2332] border-t border-gray-700 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};