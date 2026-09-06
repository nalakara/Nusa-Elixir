
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { WINE_TYPES, WINE_SWEETNESS } from '../../constants';

interface WineFormProps {
    wineType: string;
    setWineType: (value: string) => void;
    wineSweetness: string;
    setWineSweetness: (value: string) => void;
}

const WineForm: React.FC<WineFormProps> = ({ wineType, setWineType, wineSweetness, setWineSweetness }) => {
    const { t, translate } = useLocalization();

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    const buttonGroupBaseClasses = "flex-1 text-center px-3 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-dark transition-colors duration-200";
    const buttonGroupActiveClasses = "bg-bauhaus-dark text-white";
    const buttonGroupInactiveClasses = "text-bauhaus-dark bg-white hover:bg-bauhaus-yellow";
    
    return (
        <div className={`${formSectionClasses} md:col-span-4 space-y-6`}>
            <h4 className="text-sm font-bold text-bauhaus-dark uppercase tracking-wider">{t('wineMakingSection')}</h4>
            <div>
                <label htmlFor="wineType" className={labelClasses}>{t('wineTypeLabel')}</label>
                <div className="relative">
                    <select id="wineType" value={wineType} onChange={(e) => setWineType(e.target.value)} className={`${inputBaseClasses} appearance-none`}>
                        {WINE_TYPES.map(type => (
                            <option className="bg-white text-bauhaus-dark" key={type.id} value={type.id}>{translate(type)}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-bauhaus-dark">
                        <svg className="fill-current h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            <div>
                <label className={labelClasses}>{t('wineSweetnessLabel')}</label>
                <div className="mt-2 flex space-x-[-2px]">
                    {WINE_SWEETNESS.map(level => (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => setWineSweetness(level.id)}
                            className={`${buttonGroupBaseClasses} ${wineSweetness === level.id ? buttonGroupActiveClasses : buttonGroupInactiveClasses}`}
                        >
                            {translate(level)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WineForm;
