
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

interface LiqueurFormProps {
    baseSpirit: string;
    setBaseSpirit: (value: string) => void;
    desiredAbv: string;
    setDesiredAbv: (value: string) => void;
    baseSpiritOptions: Array<{ id: string; nameEn: string; nameId: string; }>;
}

const LiqueurForm: React.FC<LiqueurFormProps> = ({ baseSpirit, setBaseSpirit, desiredAbv, setDesiredAbv, baseSpiritOptions }) => {
    const { t, translate } = useLocalization();

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    
    const handleNonNegativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || parseFloat(value) >= 0) {
            setDesiredAbv(value);
        }
    };
    
    return (
        <div className={`${formSectionClasses} md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6`}>
            <div>
                <label htmlFor="baseSpirit" className={labelClasses}>{t('baseSpiritLabel')}</label>
                <div className="relative">
                    <select id="baseSpirit" value={baseSpirit} onChange={(e) => setBaseSpirit(e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                        {baseSpiritOptions.map(type => (
                            <option className="bg-white text-bauhaus-dark" key={type.id} value={type.id}>{translate(type)}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-bauhaus-dark">
                        <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="desiredAbv" className={labelClasses}>{t('desiredAbvLabel')}</label>
                <input
                    type="number"
                    id="desiredAbv"
                    value={desiredAbv}
                    onChange={handleNonNegativeChange}
                    placeholder={t('desiredAbvPlaceholder')}
                    min="1"
                    className={inputBaseClasses}
                />
            </div>
        </div>
    );
};

export default LiqueurForm;
