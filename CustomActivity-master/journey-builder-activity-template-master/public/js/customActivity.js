define([
    'postmonger'
], function(Postmonger) {
    'use strict';
    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var argumentos;
    $(window).ready(onRender);
    var eventDefinitionKey;
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('clickedNext', save);
    connection.on('requestedTriggerEventDefinition', function(eventDefinitionModel) {
        console.log('DEFINITION-> ' + eventDefinitionModel);
        if (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
            console.log(">>>Event Definition Key " + eventDefinitionKey);
            /*If you want to see all*/
            console.log('>>>Request Trigger', JSON.stringify(eventDefinitionModel));
        }
    });

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestTriggerEventDefinition');
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        var hasInArguments = Boolean(payload['arguments'] && payload['arguments'].execute && payload['arguments'].execute.inArguments && payload['arguments'].execute.inArguments.length > 0);
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        console.log(inArguments);
        $.each(inArguments, function(index, inArgument) {
            $.each(inArgument, function(key, val) {});
        });
        console.log('CARREGUEI BUTTON 1');
        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var name = 'Report Simulador Real Time';
        console.log(payload);
        var campanha = null;
        var material = null;
        campanha = $('#Campanha').val();
        material = $('#Material').val();
        // 'payload' is initialized on 'initActivity' above.
        // Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property
        // may be overridden as desired.
        //'ChaveCPessoal': '{{Event.' + eventDefinitionKey + '.\"Chave CPessoal\"}}',
        payload.name = name;
        payload['arguments'].execute.inArguments = [{
            'Identifier': '{{Contact.Key}}',
            'Email': '{{InteractionDefaults.Email}}',
            'CodigoWebsiteAtual': '{{Event.' + eventDefinitionKey + '.CodigoWebsiteAtual}}',
            'Origem': campanha,
            'Campanha': material
        }];
        //console.log(payload);~
        console.log(`${campanha} | ${material} `);
        if (campanha != null && material != null) {
            payload['metaData'].isConfigured = true;
            connection.trigger('updateActivity', payload);
        } else {
            alert('Preencha os campos por favor!');
        }
    }
});