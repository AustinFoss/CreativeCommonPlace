import { Template } from 'meteor/templating';
import { ListofFiles } from './ipfsPaths.js';
import './templates.html';
//var hashFiles = require('hash-files');

IpfsAPI = require("ipfs-api");
ipfs = IpfsAPI('localhost', '5001', {protocol: 'http'});

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};

const bitcore=require("bitcore-lib")

// Connects to the master Ethereum Contract
const createCreatorABI = [{"constant":false,"inputs":[{"name":"_LibAddress","type":"address"}],"name":"changeLibAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"newCreator","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Lib","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"etherAddress","type":"address"},{"indexed":false,"name":"CreatorID","type":"address"}],"name":"CreatorCreated","type":"event"}]
const createCreatorAddress = '0xBf53A97EA517AeeEa0b8DC84222F2462fE2896b3'
const createCreator = web3.eth.contract(createCreatorABI).at(createCreatorAddress);

//Sets the Creator contract code but not the address
const CreatorABI = [{"constant":false,"inputs":[{"name":"_LibAddress","type":"address"}],"name":"changeLibAddress","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Lib","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_enterHash","type":"bytes32"},{"name":"_distLicense","type":"string"}],"name":"RegisterIP","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ContentHash","type":"bytes32"},{"indexed":false,"name":"DistLicense","type":"string"}],"name":"Registration","type":"event"}]


Template.newCreatorID.events({//Creates an new Creator contracto
  'click #newCreatorID': function(event, template){
    createCreator.newCreator((function (err, res){
      console.log(res);
    }))
  }
})

Template.connectToCreator.events({//Connects to a specific creator contract
  'click #searchForIDs': function(event){//Searches for Creator ID's to connect to

    results = [];//Clears the array of search results for each new search
    searchIDs = createCreator.CreatorCreated(
      {etherAddress: etherSearch.value/*calls a UI input*/},
      {fromBlock:	691278/*Origin block of the createCreator contract*/, toBlock: 'latest'}
    );
    var template = Template.instance();

    searchIDs.watch(function(err, res){//collects all CreatorID events in the contract log
      console.log(res.args.CreatorID);
      results.push(res.args.CreatorID);
      TemplateVar.set(template, 'IDresults', results);
    });
  }
})

Template.connectToCreator.events({//Connects to a specific creator contract
  'click #connectToCreator': function(event){//Connects to a single Creator contract

    IPs = [];//Clears the array of search results for each new search
    selectedID = document.getElementById('selectID');//Selects a contract address from previous search
    Creator = web3.eth.contract(CreatorABI).at(selectedID.value);//Connects to the contract
    OpenPortfolio = Creator.Registration({etherAddress: selectID.value}, {fromBlock:	691278, toBlock: 'latest'});
    var template = Template.instance();

    OpenPortfolio.watch(function(err, res){//collects all RegisterIP events of the connected creator contract
      console.log(res.args.ContentHash, res.args.DistLicense);
      IPs.push({ContentHash: res.args.ContentHash, DistLicense: res.args.DistLicense});
      TemplateVar.set(template, 'IPs', IPs);
    })
  }
})

Template.connectToCreator.helpers({//takes the evnts of collected in the template events and makes them available to the html
  IDresults() {
    TemplateVar.set(template, 'IDresults', results);
    return TemplateVar.get("IDresults");
  },
  IPs() {
    TemplateVar.set(template, 'IPs', IPs);
    return TemplateVar.get('IPs');
  }
})

Template.Publish.events({//creates a new RegisterIP event & adds it to the connected Creator Portfolio
  'click #publish': function(event){

    selectedFile = document.getElementById('publishThis');//currently only selects a text input
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

Template.ipfsAdd.events({//currently only opperates from serverside code
  'click #ipfsButton': function(event, file){
    Meteor.call("ipfsAdd", function(err, res){//add a predefined file to the IPFS DHT
        console.log(res[0].hash);
        alert(res[0].hash);
        ipfsLink = document.getElementById('ipfsLink');
        ipfsLink.href = 'https://gateway.ipfs.io/ipfs/' + res[0].hash;
      }
    );
  }
})
