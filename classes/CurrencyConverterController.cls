public class CurrencyConverterController {

    @AuraEnabled
    public static List< Conversion_History__c > fetchHistory(){
        return [SELECT Id,Name,From__c,To__c FROM Conversion_History__c ORDER BY CreatedDate DESC];
    }
    
    @AuraEnabled
    public static void createHistory(string fromVal,string toVal){
        INSERT new Conversion_History__c(From__c=fromVal,To__c=toVal);
    }
}