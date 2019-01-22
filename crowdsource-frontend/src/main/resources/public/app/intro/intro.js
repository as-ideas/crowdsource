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
            vm.campaigns.ideas.push({id:"asd", title:"Weniger Müll", startDate:"", endDate: "", teaser:"Blind Text TextTExtBlind Text TextTExtBlind Text TextTExtBlind Text TextTExt", sponsor:"Mathias Döpfner"})
        }
    });
