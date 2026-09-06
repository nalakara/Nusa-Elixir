import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Language } from '../types';
import type { Screen } from '../App';

interface HeaderProps {
    setCurrentScreen: (screen: Screen) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentScreen }) => {
    const { t, language, setLanguage } = useLocalization();

    const toggleLanguage = () => {
        const newLang: Language = language === 'en' ? 'id' : 'en';
        setLanguage(newLang);
    };

    const buttonClasses = "p-2 text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-bauhaus-blue";

    return (
        <header className="bg-white sticky top-0 z-10 border-b-4 border-bauhaus-dark">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button 
                    onClick={() => setCurrentScreen('home')}
                    className="flex items-center focus:outline-none"
                    aria-label="Go to home page"
                >
                    <span className="text-2xl font-sans font-bold tracking-widest text-bauhaus-dark">
                        {t('appTitle')}
                    </span>
                </button>
                <div className="flex items-center space-x-2 md:space-x-4">
                     <button
                        onClick={() => setCurrentScreen('myRecipes')}
                        className={buttonClasses}
                        aria-label={t('myRecipes')}
                    >
                        {t('myRecipes')}
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className={`${buttonClasses} w-10 h-10 bg-bauhaus-yellow border-2 border-bauhaus-dark`}
                        aria-label={`Switch to ${language === 'en' ? 'Indonesian' : 'English'}`}
                    >
                        {language === 'en' ? 'ID' : 'EN'}
                    </button>
                    <button className={`hidden md:block ${buttonClasses} px-4 py-2 bg-bauhaus-blue text-white border-2 border-bauhaus-dark`}>
                        {t('login')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;