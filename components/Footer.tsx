import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Footer: React.FC = () => {
    const { t } = useLocalization();
    return (
        <footer className="mt-16 pt-6 border-t border-stone-300">
            <div className="container mx-auto px-4 py-6 text-center text-sm text-stone-600">
                <p>{t('footerText')}</p>
            </div>
        </footer>
    );
};

export default Footer;