import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const OfflineBanner: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="bg-bauhaus-yellow text-bauhaus-dark text-center p-4 mx-4 my-2 border-2 border-bauhaus-dark">
            <p className="font-bold uppercase tracking-wider">{t('offlineTitle')}</p>
            <p className="text-sm">{t('offlineDesc')}</p>
        </div>
    );
};

export default OfflineBanner;