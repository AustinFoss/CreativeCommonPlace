import { Template } from 'meteor/templating';
import { ListofFiles } from './ipfsPaths.js';
import './templates.html';
//import { TemplateVar } from 'meteor/template-var';
var hashFiles = require('hash-files');

IpfsAPI = require("ipfs-api");
ipfs = IpfsAPI('localhost', '5001', {protocol: 'http'});

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};

const bitcore=require("bitcore-lib")
//const ipfs = require("ipfs-api")

const createCreatorABI = [{"constant":false,"inputs":[{"name":"_LibAddress","type":"address"}],"name":"changeLibAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"newCreator","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Lib","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"etherAddress","type":"address"},{"indexed":false,"name":"CreatorID","type":"address"}],"name":"CreatorCreated","type":"event"}]
const createCreatorAddress = '0x4b70457be77EaB5aFa2cF45b2D7FF1e1Cc0f1Bf0'

const CreatorABI = [{"constant":false,"inputs":[{"name":"_LibAddress","type":"address"}],"name":"changeLibAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Lib","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_enterHash","type":"bytes32"},{"name":"_distLicense","type":"string"}],"name":"RegisterIP","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ContentHash","type":"bytes32"},{"indexed":false,"name":"DistLicense","type":"string"}],"name":"Registration","type":"event"}]
//var CreatorID = '0x319baa985fe266e9da23e2412375bb1f94611391';

const createCreator = web3.eth.contract(createCreatorABI).at(createCreatorAddress);

Template.newCreatorID.events({
  'click #newCreatorID': function(event, template){
    createCreator.newCreator((function (err, res){
      console.log(res);
    }))
  }
})

Template.connectToCreator.events({
  'click #searchForIDs': function(event){

    results = [];
    searchIDs = createCreator.CreatorCreated({etherAddress: etherSearch.value}, {fromBlock: 	576587, toBlock: 'latest'});
    var template = Template.instance();

    searchIDs.watch(function(err, res){
      console.log(res.args.CreatorID);
      results.push(res.args.CreatorID);
      TemplateVar.set(template, 'IDresults', results);
    });

  }
})

Template.connectToCreator.events({
  'click #connectToCreator': function(event){

    IPs = [];
    selectedID = document.getElementById('selectID');
    Creator = web3.eth.contract(CreatorABI).at(selectedID.value);
    OpenPortfolio = Creator.Registration({etherAddress: selectID.value}, {fromBlock:	551821, toBlock: 'latest'});
    var template = Template.instance();

    OpenPortfolio.watch(function(err, res){
      console.log(res.args.ContentHash, res.args.DistLicense);
      IPs.push({ContentHash: res.args.ContentHash, DistLicense: res.args.DistLicense});
      TemplateVar.set(template, 'IPs', IPs);
    })

  }
})

Template.connectToCreator.helpers({

  IDresults() {
    TemplateVar.set(template, 'IDresults', results);
    return TemplateVar.get("IDresults");
  },

  IPs() {
    TemplateVar.set(template, 'IPs', IPs);
    return TemplateVar.get('IPs');
  }

})

Template.Publish.events({
  'click #publish': function(event){

    // var reader = new FileReader();

    // reader.onload = function (err,res){
    //   console.log(err,res);
    // }

    // selectedFile = document.getElementById('publishThis');
    // dataToHash = reader.readAsArrayBuffer(selectedFile.files[0]);
    // var hash = (bitcore.crypto.Hash.sha256(dataToHash)).toString('hex');

    selectedFile = document.getElementById('publishThis');
    var value = new Buffer(selectedFile.value);
    var hash = (bitcore.crypto.Hash.sha256(value)).toString('hex');
    console.log(hash);

    distLicense = document.getElementById('DistLicense');
    console.log(distLicense.value)

    Creator.RegisterIP('0x'+ hash, distLicense.value, (function(err, res){
      console.log(err, res);
    }))
  }
})

Template.ipfsAdd.events({
  'click #ipfsButton': function(event, file){

    //selectedFile = document.getElementById('ipfs_add_file');
    //addThis = selectedFile;

    //ipfs.util.addFromStream(ipfs_add_file.files[0]);

    Meteor.call("ipfsAdd", function(err, res){
        console.log(res[0].hash);
        alert(res[0].hash);
        ipfsLink = document.getElementById('ipfsLink');
        ipfsLink.href = 'https://gateway.ipfs.io/ipfs/' + res[0].hash;
      }
    );
  }
})
