
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { RecipeIngredient } from '../../types';

interface CustomIngredientsProps {
    ingredients: RecipeIngredient[];
    setIngredients: (ingredients: RecipeIngredient[]) => void;
}

const CustomIngredients: React.FC<CustomIngredientsProps> = ({ ingredients, setIngredients }) => {
    const { t } = useLocalization();

    const formSectionClasses = "border-2 border-bauhaus-dark bg-white p-6";
    const labelClasses = "block text-sm font-bold text-bauhaus-dark uppercase tracking-wider mb-2";
    const inputBaseClasses = "block w-full bg-white border-2 border-bauhaus-dark p-3 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-bauhaus-yellow/50 focus:border-bauhaus-blue";
    const buttonClasses = "py-2 px-4 text-sm font-bold uppercase tracking-wider border-2 border-bauhaus-dark transition-all";

    const handleIngredientChange = (index: number, field: keyof RecipeIngredient, value: string | number) => {
        const newIngredients = [...ingredients];
        (newIngredients[index] as any)[field] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantityValue: 0, quantityUnit: '' }]);
    };

    const removeIngredient = (index: number) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    return (
        <div className={`${formSectionClasses} md:col-span-4 space-y-6`}>
            <div className="flex justify-between items-center">
                <h4 className={labelClasses}>{t('customIngredientsLabel')}</h4>
                <button type="button" onClick={addIngredient} className={`${buttonClasses} bg-bauhaus-yellow hover:bg-bauhaus-blue hover:text-white`}>
                    {t('addIngredientBtn')}
                </button>
            </div>

            {ingredients.length === 0 && (
                 <p className="text-stone-500 text-sm">Add custom ingredients to guide the recipe generation.</p>
            )}

            <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <input
                            type="text"
                            placeholder={t('ingredientNamePlaceholder')}
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                            className={`${inputBaseClasses} sm:col-span-6`}
                        />
                        <input
                            type="number"
                            placeholder={t('quantityPlaceholder')}
                            value={ingredient.quantityValue || ''}
                            onChange={(e) => handleIngredientChange(index, 'quantityValue', parseFloat(e.target.value) || 0)}
                            className={`${inputBaseClasses} sm:col-span-2`}
                            min="0"
                        />
                         <input
                            type="text"
                            placeholder={t('unitPlaceholder')}
                            value={ingredient.quantityUnit}
                            onChange={(e) => handleIngredientChange(index, 'quantityUnit', e.target.value)}
                            className={`${inputBaseClasses} sm:col-span-3`}
                        />
                        <button type="button" onClick={() => removeIngredient(index)} className={`${buttonClasses} sm:col-span-1 bg-bauhaus-red text-white hover:bg-bauhaus-dark flex items-center justify-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomIngredients;