//This page is only for IPFS testing
//The goal is to have no server side code
import { Meteor } from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import '../imports/ipfsPaths.js';

Meteor.startup(() => {

IpfsAPI = require("ipfs-api");
ipfs = IpfsAPI('localhost', '5001', {protocol: 'http'});

  Meteor.methods({

    "ipfsAdd": function(addThis){
        var result = ipfs.util.addFromFs('/home/eruguru/CreativeCommonPlace/client/IPFSLibrary/quasar.jpg');
        // ipfs.util.addFromFs(addThis);
        return (result);
        },

    "getFile": function(fileHash){
        var results = HTTP.get('http://127.0.0.1:5001/api/v0/object/get',
        {timeout:50000, params:
        {"arg": "QmW1xtbLAmS9TBfmeHnhNC7cavLEcxDPHa2MfJtRSmy8dC"}});
        return (results)
      },

    "getOp": function(){
        var results = HTTP.get("https://testnet-api.smartbit.com.au/v1/blockchain/tx/9df322da40a111ada505babb9057b4a17a00841f4fafc20c14060285e4d52a83/op-returns",
      );
        return (results);
      }

  });
});
