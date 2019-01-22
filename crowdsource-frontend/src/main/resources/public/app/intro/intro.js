angular.module('crowdsource')

    .controller('IntroController', function (Authentication) {
        var vm = this;
        vm.auth = Authentication;

        vm.campaigns = {
            ideas: [],
            prototypes: []
        };

        init();

        function init() {
            vm.campaigns.ideas.push({id:"1", title:"Weniger Müll", startDate:"", endDate: "", teaser:"Blind Text TextTExtBlind Text TextTExtBlind Text TextTExtBlind Text TextTExt", sponsor:"Mathias Döpfner"})
            vm.campaigns.ideas.push({id:"2", title:"AS Ideas Team Events", startDate:"", endDate: "", teaser:"Lorem ipsum dolor sit amet,consetetur sadipscing elitr", sponsor:"Michael Alber"})
        }
    });
