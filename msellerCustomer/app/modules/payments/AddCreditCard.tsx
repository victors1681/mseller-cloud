import React from 'react';
import {WebView, DataWeb} from '../webview';
import Config from 'react-native-config';
import {saveDefaultCreditCard} from 'app/utils/creditCardTokenHandler';

//EXAMPLE 'http://192.168.1.210:8088/cardnet/
let SERVER_URL = __DEV__ ? Config.DEV_GRAPHQL_URL : Config.PROD_GRAPHQL_URL;
SERVER_URL += '/cardnet';

export const AddCreditCard = (): React.ReactElement => {
  const handleCallBack = (payload: DataWeb) => {
    console.log('data', payload);
    //save token in the current store.
    //token added can be used to purchase immediately
    saveDefaultCreditCard(payload.token);
  };

  return (
    <React.Fragment>
      <WebView
        uri={SERVER_URL}
        callback={handleCallBack}
        title="Agregar Tarjeta de crédito"
      />
    </React.Fragment>
  );
};
