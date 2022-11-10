/*App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
   web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });*/
    App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    if(web3.currentProvider.enable){
    //For metamask
    web3.currentProvider.enable().then(function(acc){
        App.account = acc[0];
        $("#accountAddress").html("Your Account: " + App.account);
    });
} else{
    App.account = web3.eth.accounts[0];
    $("#accountAddress").html("Your Account: " + App.account);
}

    // Load contract data
  /*  App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});*/
App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
        /*  var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);*/

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('#vs').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
  result: function() {
    /*var username= $('#username').val();
    var psw= $('#psw').val();
    if((username=="adithya70") &&(psw=="adithya70")){
      alert("admin logged in successfully");
    document.location.replace('./new.html');
  }
  else{
    alert("admin login unsuccessfull");

  }

    console.log("fun");
console.log(x);*/
document.location.replace('./index.html');
  },
  admin:function(){
    var username= $('#username1').val();
    var psw= $('#psw1').val();

    console.log(psw);
      if((username=="admin") && (psw=="admin"))
      {
          alert("successfully logedin");
        document.location.replace('./new.html');
        var loader = $("#loader");
        loader.hide();
      }
      else{
      alert("not successfully logedin");

    }
  },
  home: function() {
    /*document.location.replace('./index.html');

    console.log("hi");
  var x= $('#test').val();
  console.log(x);
  var candidatesResults = $("#candidatesResults");
  candidatesResults.empty();

  for (var i = 1; i <= 2; i++) {

      // Render candidate Result
      var candidateTemplate = "<tr><th>" + i + "</th><td>" + "trump" + "</td><td>" + i + "</td></tr>"
      candidatesResults.append(candidateTemplate);
    }
    var loader = $("#loader");
    loader.hide();
    var content = $("#content");
  content.show();*/
  var loader = $("#loader");
var content = $("#content");
var bt = $("#bt");
bt.hide();
loader.show();
  App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= 2; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

  },

  reg:function(){
      var name= $('#name').val();
      var psw= $('#psw').val();

      console.log("ji");

      App.contracts.Election.deployed().then(function(instance) {
        return instance.register(name,psw,{ from: App.account });}).then(function(result) {
          // Wait for votes to update
        }).catch(function(err) {
          console.error(err);
        });
        alert("successfully registered");
        $("#id01").hide();
        console.log("hi");




  },
  login:function(){
      var username= $('#username').val();
      var psw= $('#psw').val();

      console.log(psw);

      App.contracts.Election.deployed().then(function(instance) {
        return instance.reg(username,{ from: App.account });}).then(function(result) {
          // Wait for votes to update
          console.log(result);
          if(psw==result){
            alert("successfully logedin");
            document.location.replace('./bew.html');
        }
        else{
        alert("not successfully logedin");

      }
        }).catch(function(err) {
          console.error(err);
        });

        $("#id02").hide();
        console.log("hi");




  }
};

$(function() {
  $(window).load(function() {
    var i=0;
    //if(window.location.pathname == "./car-driving.html")
    if(i<=0)
 {
    App.init();
    i++;
 }


  });
});
