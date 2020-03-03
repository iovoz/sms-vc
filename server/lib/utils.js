import en_us from '../../locales/en.json';
import zh_hk from '../../locales/zh.json';

const maxAge = 30 * 24 * 3600000; // 30 days
const languageCookieName = 'lang';

const languages = {
    'en-us': { id: 1, translations: en_us, text: 'English', locale: 'en-us' },
    'zh-hk': { id: 2, translations: zh_hk, text: '繁體中文', locale: 'zh-hk' },
};

function getLanguage(req, res) {
    let languageCode = 'en-us';
    const match = req.url.match(/^\/([A-Za-z]{2}-[A-Za-z]{2})([\/\?].*)?$/i);

    if (match) {
        languageCode = match[1];
        req.url = match[2] || '/';
    }

    // Get language from cookie if ajax request
    if ((req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') >= 0)) && req.cookies && req.cookies[languageCookieName]) {
        languageCode = req.cookies[languageCookieName].toLowerCase();
    }

    if (!languages[languageCode]) {
        languageCode = 'en-us';
    }

    res.cookie(languageCookieName, languageCode, {
        maxAge: maxAge,
        path: '/'
    });

    return languages[languageCode];
}

function setLanguage(res, languageCode) {
    if (languageCode) {
        res.cookie('lang', languageCode, {
            maxAge: maxAge,
            path: '/'
        });
    }
}

function setUserSession(req, data) {
    if (data.token) {
        req.session.userToken = data.token;
    }
    if (data.pinCode) {
        req.session.pinCode = data.pinCode;
    }
    if (data.quotationId) {
        req.session.quotationId = data.quotationId;
    }
}

module.exports = {
    languages: languages,
    getLanguage: getLanguage,
    setLanguage: setLanguage,
    setUserSession: setUserSession
};
