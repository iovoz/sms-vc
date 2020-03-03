import 'babel-polyfill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

addLocaleData([...en, ...zh]);
addLocaleData([
    { locale: 'en-us', parentLocale: 'en' },
    { locale: 'zh-hk', parentLocale: 'zh-Hant-HK' }
]);

function Fragment(props) {
    return props.children || <span {...props} /> || null;
}

export default class IntlWrapper extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        messages: PropTypes.object.isRequired
    };

    render() {
        const { locale, store, children, messages } = this.props;

        return (
            <Provider store={store}>
                <IntlProvider locale={locale} messages={messages} textComponent={Fragment}>
                    {children}
                </IntlProvider>
            </Provider>
        );
    }
}
