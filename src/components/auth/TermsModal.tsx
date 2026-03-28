'use client';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
            <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#1a2332] rounded-lg shadow-xl overflow-hidden">
                
                <div className="sticky top-0 bg-[#1a2332] border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Términos y Condiciones</h2>
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
                        <h3 className="text-xl font-semibold text-white mb-2">1. Aceptación</h3>
                        <p className="text-sm leading-relaxed">
                            Al acceder y utilizar esta plataforma, usted acepta cumplir
                            con los presentes Términos y Condiciones.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">2. Uso del servicio</h3>
                        <p className="text-sm leading-relaxed">
                            El usuario se compromete a utilizar el servicio de forma legal,
                            responsable y conforme a la normativa vigente.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">3. Responsabilidades del usuario</h3>
                        <p className="text-sm leading-relaxed">
                            El usuario es responsable de mantener la confidencialidad
                            de sus credenciales y de todas las actividades realizadas en su cuenta.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-white mb-2">4. Limitación de responsabilidad</h3>
                        <p className="text-sm leading-relaxed">
                            La plataforma no será responsable por daños indirectos,
                            pérdidas económicas o interrupciones derivadas del uso del servicio.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h3 className="text-xl font-semibold text-white mb-2">5. Modificaciones</h3>
                        <p className="text-sm leading-relaxed">
                            Nos reservamos el derecho de modificar estos términos en cualquier momento.
                            El uso continuado del servicio implica la aceptación de los cambios.
                        </p>
                    </section>

                </div>

           
                <div className="sticky bottom-0 bg-[#1a2332] border-t border-gray-700 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};