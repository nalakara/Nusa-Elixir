
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { IBU_LEVELS, SRM_LEVELS, BREWING_METHODS } from '../../constants';

interface BeerFormProps {
    beerStyle: string;
    setBeerStyle: (value: string) => void;
    targetIbu: string;
    setTargetIbu: (value: string) => void;
    targetSrm: string;
    setTargetSrm: (value: string) => void;
    brewingMethod: string;
    setBrewingMethod: (value: string) => void;
}

const BeerForm: React.FC<BeerFormProps> = ({
    beerStyle, setBeerStyle, targetIbu, setTargetIbu, targetSrm, setTargetSrm, brewingMethod, setBrewingMethod
}) => {
    const { t, translate } = useLocalization();

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    const buttonGroupBaseClasses = "flex-1 text-center px-3 py-3 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-dark transition-colors duration-200";
    const buttonGroupActiveClasses = "bg-bauhaus-dark text-white";
    const buttonGroupInactiveClasses = "text-bauhaus-dark bg-white hover:bg-bauhaus-yellow";
    
    return (
        <div className={`${formSectionClasses} md:col-span-4 space-y-6`}>
            <h4 className="text-sm font-bold text-bauhaus-dark uppercase tracking-wider">{t('beerCraftingSection')}</h4>
            <div>
                <label htmlFor="beerStyle" className={labelClasses}>{t('beerStyleLabel')}</label>
                <input type="text" id="beerStyle" value={beerStyle} onChange={(e) => setBeerStyle(e.target.value)} placeholder={t('beerStylePlaceholder')} className={inputBaseClasses} />
            </div>
            
            <div>
                <label className={labelClasses}>{t('targetIbuLabel')}</label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {IBU_LEVELS.map(level => (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => setTargetIbu(level.id)}
                            className={`p-4 text-left transition-all flex flex-col justify-between h-full border-2 border-bauhaus-dark ${
                                targetIbu === level.id
                                    ? 'bg-bauhaus-blue text-white'
                                    : 'bg-white text-bauhaus-dark hover:bg-bauhaus-yellow'
                            }`}
                        >
                            <span className="font-semibold block">{translate(level)}</span>
                            <span className="text-xs opacity-80 block mt-1">{`~${level.value} IBU`}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div>
                <label className={labelClasses}>{t('targetSrmLabel')}</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {SRM_LEVELS.map(level => (
                        <button
                            key={level.id}
                            type="button"
                            onClick={() => setTargetSrm(level.id)}
                            className={`p-4 text-left transition-all flex flex-col justify-between h-full border-2 border-bauhaus-dark ${
                                targetSrm === level.id
                                   ? 'bg-bauhaus-blue text-white'
                                   : 'bg-white text-bauhaus-dark hover:bg-bauhaus-yellow'
                            }`}
                        >
                            <span className="font-semibold block">{translate(level)}</span>
                            <span className="text-xs opacity-80 block mt-1">{`~${level.value} SRM`}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className={labelClasses}>{t('brewingMethodLabel')}</label>
                <div className="mt-2 flex space-x-[-2px]">
                    {BREWING_METHODS.map(method => (
                        <button key={method.id} type="button" onClick={() => setBrewingMethod(method.id)} className={`${buttonGroupBaseClasses} ${brewingMethod === method.id ? buttonGroupActiveClasses : buttonGroupInactiveClasses}`}>
                            {translate(method)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BeerForm;
