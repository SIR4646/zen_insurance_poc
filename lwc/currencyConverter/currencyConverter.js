import { LightningElement, track } from 'lwc';
import fetchHistory from '@salesforce/apex/CurrencyConverterController.fetchHistory';
import createHistory from '@salesforce/apex/CurrencyConverterController.createHistory';
export default class CurrencyConverter extends LightningElement {

    amount;
    histories =[];
    isLoading = false;

    @track
    convertedAmtMap = {};

    showConvertedAmt = false;
    connectedCallback() {
        this.setHistories();
    }

    setHistories() {
        fetchHistory()
        .then((response) => this.histories = response)
        .catch(error => console.log('error', error));
    }
    handleAmtChange(event) {
        this.amount = event.detail.value;
    }

    handleConvert() {
        this.isLoading = true;
        this.convertedAmtMap = {};
        this.showConvertedAmt = false;
        Promise.all([this.convertAmountAndCreateHistory('USD'),this.convertAmountAndCreateHistory('EUR')])
        .then(() => {
            this.setHistories();
            this.isLoading = false;
            this.showConvertedAmt = true;
        })
        .catch(error => console.log('error', error));
    }

    convertAmountAndCreateHistory(currencyToConvert){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'apikey': "Yy8DnwD34W7IlPphWcdNep0nO8eKLHjH"
            }
        };
        return fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currencyToConvert}&from=CAD&amount=${this.amount}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                const { result: convertedAmount } = JSON.parse(result) || {};
                this.convertedAmtMap[currencyToConvert] = convertedAmount;
                return createHistory({ fromVal: `${this.amount} CAD`, toVal: `${convertedAmount} ${currencyToConvert}`});
            })
            .catch(error => console.log('error', error));
    }
}