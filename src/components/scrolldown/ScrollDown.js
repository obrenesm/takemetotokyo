import './ScrollDown.scss'
import { useLanguage } from '../../providers/languageProvider'

export function ScrollDown() {
    const { t } = useLanguage()

    return (
        <>
            <div className='scroll'>
                <h6>{t('scrollDown')}</h6>
                <div className='arrow'></div>
            </div>
        </>
    ) 
}

