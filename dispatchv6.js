var ibmdb = require('ibm_db');

function fetchCountryList(dsn) {
    try {
        var conn = ibmdb.openSync(dsn);
        var reporter = conn.querySync('SELECT DISTINCT "Reporter" FROM TRADES ');
        var partner = conn.querySync('SELECT DISTINCT "Partner" FROM TRADES WHERE NOT "Partner"=\'World\' ');
        conn.closeSync();
        
        var reporterArr = [{
            "title": "Select a Reporter:",
            "options": reporter.map(element => {
                return {
                    label: element.Reporter,
                    value: {
                        input: {
                            text: element.Reporter
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];

        // Return both generated string and data
        return {
            reporter: reporter, reporterArr: reporterArr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchPartnerWithSpecificReporter(dsn, reporter) {
    try {
        var conn = ibmdb.openSync(dsn);
        var partner = conn.querySync('SELECT DISTINCT "Partner" FROM TRADES WHERE LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND NOT "Partner"=\'World\' ', [reporter]);
        conn.closeSync();
        
        var partnerArr = [{
            "title": "Select a Partner:",
            "options": partner.map(element => {
                return {
                    label: element.Partner,
                    value: {
                        input: {
                            text: element.Partner
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];

        // Return both generated string and data
        return {
            partner: partner, partnerArr: partnerArr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchBilateralProduct(dsn, reporter, partner) {
    try {
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync('SELECT DISTINCT "Trade_Value__US__", "Commodity", "Trade_Flow", "Reporter", "Partner", "Commodity_Code" FROM TRADES WHERE LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=2 ORDER BY "Trade_Value__US__" DESC FETCH FIRST 5 ROWS ONLY ', [reporter, partner]);
        conn.closeSync();

        var resString = "Top " + data.length + " sectors between " + data[0]['Reporter'] + " and " + data[0]['Partner'] + ":\n";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + data[i]['Commodity'] + "\nFlow: " + data[i]['Trade_Flow'] + "\nBalance: US$" + data[i]['Trade_Value__US__'] + "\n";
        }
        
        var arr = [{
            "title": "Select a commodity:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];

        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchHS4WithCountry(dsn, productname, reporter, partner) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=2', [productname, reporter, partner]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT "Commodity_Code", "Commodity" FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'__\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') ', [commodity_code, reporter, partner]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + data[i]['Commodity'] + "\n";
        }
        
        var arr = [{
            "title": "Select a product to continue:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];
         
        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchHS6WithCountry(dsn, productname, reporter, partner) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=4', [productname, reporter, partner]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT "Commodity_Code", "Commodity", "Trade_Flow", "Trade_Value__US__" FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'__\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') ', [commodity_code, reporter, partner]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + data[i]['Commodity'] + "\n";
            resString += data[i]['Trade_Flow'] + "\n";
            resString += "US$" + data[i]['Trade_Value__US__'] + "\n";
        }
        
        var arr = [{
            "title": "Select a product to continue:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];
         
        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchSpecificProductWithCountry(dsn, productname, reporter, partner) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=6', [productname, reporter, partner]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT * FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Partner")=LOWER(\'\' || ? || \'\') ', [commodity_code, reporter, partner]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + data[i]['Commodity'] + "\n";
            resString += "Trade Flow: " + data[i]['Trade_Flow'] + " from " + data[i]['Reporter'] + " to " + data[i]['Partner'];
            resString += "\nNetweight (kg): " + data[i]['Netweight__kg_'];
            resString += "\nTrade Value: US$" + data[i]['Trade_Value__US__'] + "\n";
        }
        
        var reporting_area = data[0]['Reporter_Code'];
        var partner_area = data[0]['Partner_Code'];
        var trade_flow = data[0]['Trade_Flow_Code']
        
        var url = "https://comtrade.un.org/api/get?r=" + reporting_area + "&px=HS&ps=2019&p=" + partner_area + "&rg=" + trade_flow + "&cc=" + commodity_code + "&fmt=csv&type=COMMODITIES&freq=A";
         
        // Return both generated string and data
        return {
            result: resString, data: data, url: url
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchDetailsOfCountry(dsn, country, detail) {
    try {
        var conn = ibmdb.openSync(dsn);
        var data = conn.querySync('SELECT DISTINCT "Commodity", "Commodity_Code", "Trade_Flow", "Reporter" FROM TRADES WHERE LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=2 ', [country, detail]);
        
        conn.closeSync();
        
        var resString = data[0]['Trade_Flow'] + " of " + data[0]['Reporter'] + ":\n";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + " " + data[i]['Commodity'] + "\n";
        }
        
        var arr = [{
            "title": "Select a product to continue:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];
         
        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchHS4DetailsOfProduct(dsn, productname, country, detail) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=2', [productname, country, detail]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT "Commodity_Code", "Commodity" FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'__\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') ', [commodity_code, country, detail]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += i+1 + "." + " " + data[i]['Commodity'] + "\n";
        }
        
        var arr = [{
            "title": "Select a product to continue:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];
         
        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchHS6DetailsOfProduct(dsn, productname, country, detail) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=4', [productname, country, detail]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT "Commodity_Code", "Commodity" FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'__\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') ', [commodity_code, country, detail]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += i+1 + "." + " " + data[i]['Commodity'] + "\n";
        }
        
        var arr = [{
            "title": "Select a product to continue:",
            "options": data.map(element => {
                return {
                    label: element.Commodity,
                    value: {
                        input: {
                            text: element.Commodity
                        }
                    }
                }
            }),
            "description": "",
            "response_type": "option"
        }];
         
        // Return both generated string and data
        return {
            result: resString, data: data, arr: arr
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function fetchSpecificDetailsOfProduct(dsn, productname, country, detail) {
    try {
        var conn = ibmdb.openSync(dsn);
        var code = conn.querySync('SELECT DISTINCT "Commodity_Code" FROM TRADES WHERE LOWER("Commodity") LIKE LOWER(\'%\' || ? || \'%\') AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') AND "Aggregate_Level"=6', [productname, country, detail]);
        
        var commodity_code = code[0]['Commodity_Code'];
        
        var data = conn.querySync('SELECT DISTINCT * FROM TRADES WHERE "Commodity_Code" LIKE \'\' || ? || \'\' AND LOWER("Reporter")=LOWER(\'\' || ? || \'\') AND LOWER("Trade_Flow")=LOWER(\'\' || ? || \'\') ', [commodity_code, country, detail]);
        
        conn.closeSync();
        
        var resString = "";
        for(let i = 0; i < data.length; i++) {
            resString += data[i]['Commodity_Code'] + " - " + data[i]['Commodity'] + "\n";
            resString += "Trade Flow: " + data[i]['Trade_Flow'] + " from " + data[i]['Reporter'] + " to " + data[i]['Partner'];
            resString += "\nNetweight (kg): " + data[i]['Netweight__kg_'];
            resString += "\nTrade Value: US$" + data[i]['Trade_Value__US__'] + "\n";
        }
        
        var reporting_area = data[0]['Reporter_Code'];
        var trade_flow = data[0]['Trade_Flow_Code']
        
        var url = "https://comtrade.un.org/api/get?r=" + reporting_area + "&px=HS&ps=2019&rg=" + trade_flow + "&cc=" + commodity_code + "&fmt=csv&type=COMMODITIES&freq=A";
         
        // Return both generated string and data
        return {
            result: resString, data: data, url: url
        };
    } catch (e) {
        return {
            dberror: e
        }
    }
}

function main(params) {
    dsn = params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;

    // dsn does not exist in the DB2 credential for Standard instance. It must be built manually
    if(!dsn) {
        const dbname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.database;
        const hostname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].hostname;
        const port = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].port;
        const protocol = 'TCPIP';
        const uid = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.username;
        const password = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.password;

        //dsn="DATABASE=;HOSTNAME=;PORT=;PROTOCOL=;UID=;PWD=;Security=SSL";
        dsn = `DATABASE=${dbname};HOSTNAME=${hostname};PORT=${port};PROTOCOL=${protocol};UID=${uid};PWD=${password};Security=SSL`;
    }

    switch(params.actionname) {
        case "countryList":
            return fetchCountryList(dsn);
        case "searchPartnerWithSpecificReporter":
            return fetchPartnerWithSpecificReporter(dsn, params.reporter);
        case "searchBilateralTrade":
            return fetchBilateralProduct(dsn, params.reporter, params.partner);
        case "searchHS4WithCountry":
            return fetchHS4WithCountry(dsn, params.productname, params.reporter, params.partner);
        case "searchHS6WithCountry":
            return fetchHS6WithCountry(dsn, params.productname, params.reporter, params.partner);
        case "searchSpecificProductWithCountry":
            return fetchSpecificProductWithCountry(dsn, params.productname, params.reporter, params.partner);
        case "searchDetailsOfCountry":
            return fetchDetailsOfCountry(dsn, params.country, params.detail);
        case "searchHS4DetailsOfProduct":
            return fetchHS4DetailsOfProduct(dsn, params.productname, params.country, params.detail);
        case "searchHS6DetailsOfProduct":
            return fetchHS6DetailsOfProduct(dsn, params.productname, params.country, params.detail);
        case "searchSpecificDetailsOfProduct":
            return fetchSpecificDetailsOfProduct(dsn, params.productname, params.country, params.detail);
        default:
            return { dberror: "No action defined", actionname: params.actionname}
    }
}
