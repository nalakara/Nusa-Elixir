
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { NATURAL_SODA_TYPES } from '../../constants';

interface NaturalSodaFormProps {
    naturalSodaType: string;
    setNaturalSodaType: (value: string) => void;
}

const NaturalSodaForm: React.FC<NaturalSodaFormProps> = ({ naturalSodaType, setNaturalSodaType }) => {
    const { t, translate } = useLocalization();

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    
    return (
        <div className={`${formSectionClasses} md:col-span-4 space-y-6`}>
            <h4 className="text-sm font-bold text-bauhaus-dark uppercase tracking-wider">{t('naturalSodaSection')}</h4>
            <div>
                <label htmlFor="naturalSodaType" className={labelClasses}>{t('naturalSodaTypeLabel')}</label>
                <div className="relative">
                    <select id="naturalSodaType" value={naturalSodaType} onChange={(e) => setNaturalSodaType(e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                        {NATURAL_SODA_TYPES.map(type => (
                            <option className="bg-white text-bauhaus-dark" key={type.id} value={type.id}>{translate(type)}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-bauhaus-dark">
                        <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NaturalSodaForm;