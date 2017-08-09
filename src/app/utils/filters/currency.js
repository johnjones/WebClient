angular.module('proton.utils')
    .filter('currency', (i18nLoader) => {

        const MAP = {
            USD: '$',
            EUR: '€',
            CHF: 'CHF'
        };

        const FORMATTERS = { };

        function fallbackFormat(amount = 0, currency = '') {

            const symbol = MAP[currency] || currency;
            const value = Number(amount);

            if (currency === 'USD') {
                // Negative amount, - is before the devise
                const prefix = (value < 0) ? '-' : '';
                return `${prefix}${symbol}${Math.abs(value)}`.trim();
            }

            return `${value} ${symbol}`.trim();
        }

        function getFormatter(currency) {

            const currencyLocale = currency === 'USD' ? 'en' : i18nLoader.langCountry;

            if(!Intl.NumberFormat) {
                return (amount) => fallbackFormat(amount, currency);
            }

            const formatter = new Intl.NumberFormat(currencyLocale, {
                style: 'currency',
                currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });

            if(!formatter.format){
                return (amount) => fallbackFormat(amount, currency);
            }

            return formatter.format;
        }

        return (amount, currency) => {

            if (angular.isUndefined(currency)) {
                return fallbackFormat(amount, currency);
            }

            if(currency && !(currency in FORMATTERS)) {
                FORMATTERS[currency] = getFormatter(currency);
            }

            const formatter = FORMATTERS[currency];

            return formatter(amount);
        };
    });
