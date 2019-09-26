angular.module('crowdsource')

    .directive('projectPledgingForm', function () {
        return {
            templateUrl: 'app/project/details/project-pledging-form.html',
            controllerAs: 'pledgingForm',
            bindToController: true,
            scope: {
                project: '='
            },
            controller: function (Project, Authentication, RemoteFormValidation, FinancingRound, $q, $scope, $timeout) {
                var vm = this;

                vm.pledge = {
                    amount: 0
                };
                vm.initslider = false;
                vm.amountInitialized = false;

                $q.when(vm.project).then(function(project){
                    // Resolve project when deferred by parent scope in order to refresh this form correctly
                    vm.project = project;
                    vm.project._recentChange = new Date().getTime();
                });

                vm.financingRound = FinancingRound.reloadCurrentRound().then(function(financingRound){
                    vm.financingRound = financingRound;
                });

                $scope.$watch(function() {
                    return vm.project.pledgedAmountByRequestingUser + vm.project._recentChange;
                }, function() {
                    // lazy init slider after project data are available;
                    $timeout(function() {
                        vm.initslider = true;

                        vm.initAmount();
                    }, 100);
                });

                vm.initAmount = function () {
                    if(!vm.amountInitialized){
                        vm.pledge.amount = vm.currentlyPledgedAmountByUser();
                    }
                };

                // to get the current user's budget
                vm.user = Authentication.reloadUser();

                vm.authorizedForPostRoundPledges = function () {
                    var currentFinancingRound = vm.financingRound;
                    return currentFinancingRound.postRoundBudgetDistributable &&
                        vm.user.hasRole('ADMIN') &&
                        vm.project.status == 'PUBLISHED';
                };

                vm.pledgeProject = function () {
                    vm.success = false;
                    vm.saving = true;
                    vm.wasReversePledge = vm.isReversePledge();

                    RemoteFormValidation.clearRemoteErrors(vm);

                    Project.pledge(vm.project.id, normalizePledge(vm.pledge)).$promise
                        .then(function () {
                            // load the project and user again to update the project details view to the new state
                            return reloadUserAndProject();
                        },
                        function (response) {
                            RemoteFormValidation.applyServerErrorResponse(vm, vm.form, response);

                            // most probably the project details or displayed user budget was outdated and the user "over-pledged"
                            reloadUserAndProject();

                            // return a rejected promise, or the .then() callback below will be called
                            return $q.reject(response);
                        })
                        .then(function () {
                            vm.success = true;
                        })
                        .finally(function () {
                            vm.saving = false;
                            vm.form.$setPristine();
                        });
                };

                vm.getPledgableAmount = function () {
                    var remainingProjectGoal,
                        financingRound = vm.financingRound;

                    if (isLoading() || vm.project.status != 'PUBLISHED') {
                        return 0;
                    }

                    remainingProjectGoal = vm.project.pledgeGoal - vm.project.pledgedAmount;

                    if (vm.authorizedForPostRoundPledges()) {
                        return vm.getPledgedAmountByPostRoundBudget() + Math.min(remainingProjectGoal, financingRound.postRoundBudgetRemaining);
                    } else if(financingRound.active) {
                        return vm.getPledgedAmountByCurrentUser() + Math.min(remainingProjectGoal, vm.user.budget);
                    }else {
                        return 0;
                    }
                };

                vm.currentlyPledgedAmountByUser = function () {
                    if (vm.authorizedForPostRoundPledges()){
                        return vm.getPledgedAmountByPostRoundBudget();
                    }else {
                        return vm.getPledgedAmountByCurrentUser();
                    }
                };

                vm.getPledgedAmountByCurrentUser = function () {
                    return vm.project.pledgedAmountByRequestingUser || 0;
                };
                vm.getPledgedAmountByPostRoundBudget = function () {
                    return vm.project.pledgedAmountByPostRoundBudget || 0;
                };

                vm.getUserBudget = function () {
                    var budgetAvailableForUser;
                    if ( vm.authorizedForPostRoundPledges()){
                        budgetAvailableForUser = vm.financingRound.postRoundBudgetRemaining;
                    }else {
                        budgetAvailableForUser = vm.user.budget;
                    }
                    return budgetAvailableForUser - vm.pledge.amount + vm.currentlyPledgedAmountByUser();
                };

                vm.getPledgedAmount = function () {
                    return vm.project.pledgedAmount + vm.pledge.amount - vm.currentlyPledgedAmountByUser();
                };

                vm.isReversePledge = function () {
                    return normalizePledge(vm.pledge).amount < 0;
                };

                vm.isZeroPledge = function () {
                    return normalizePledge(vm.pledge).amount == 0;
                };

                vm.financeButtonLabel = function () {
                    if (vm.saving) return  'Bitte warten...';
                    if (vm.isReversePledge()) {
                        return 'Jetzt Budget abziehen'
                    }
                    return 'Jetzt finanzieren';
                };

                function normalizePledge(pledge) {
                    return {
                        amount : parseInt(pledge.amount) - vm.currentlyPledgedAmountByUser()
                    };
                }

                vm.getNotification = function () {
                    if (isLoading()) {
                        return null;
                    }

                    if (vm.success && vm.project.status == 'FULLY_PLEDGED') {
                        return {
                            type: 'success',
                            message: 'Deine Finanzierung war erfolgreich. Das Projekt ist jetzt zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.'
                        };
                    }
                    if (vm.success) {
                        var msg = !vm.wasReversePledge ? 'Deine Finanzierung war erfolgreich.' : "Budget erfolgreich aus dem Projekt abgezogen.";
                        return {type: 'success', message: msg};
                    }
                    if (vm.project.status == 'FULLY_PLEDGED') {
                        return {type: 'info', message: 'Das Projekt ist zu 100% finanziert. Eine weitere Finanzierung ist nicht mehr möglich.'};
                    }
                    if (vm.project.status != 'PUBLISHED') {
                        return {type: 'info', message: 'Eine Finanzierung ist erst möglich, wenn das Projekt von einem Administrator veröffentlicht wurde.'};
                    }
                    if (!vm.financingRound.active && !vm.authorizedForPostRoundPledges()) {
                        return {type: 'info', message: 'Momentan läuft keine Finanzierungsrunde. Bitte versuche es nochmal, wenn die Finanzierungsrunde gestartet worden ist.'};
                    }
                    if (vm.authorizedForPostRoundPledges()) {
                        return {type: 'info', message: 'Momentan läuft keine Finanzierungsrunde. Du bist als Admin jedoch berechtigt aus dem restlichen Budget der Finanzierungsrunde weitere Investments zu tätigen.'};
                    }
                    if (!vm.user.loggedIn) {
                        return {type: 'info', message: 'Bitte logge dich ein, um Projekte finanziell zu unterstützen.'};
                    }
                    if (vm.user.budget == 0) {
                        return {
                            type: 'info',
                            message: 'Dein Budget ist leider aufgebraucht. Du kannst dieses Projekt nicht weiter finanzieren. Bitte warte ab, bis die nächste Finanzierungsrunde startet, dann wird der Finanzierungstopf erneut auf alle Benutzer aufgeteilt.'
                        };
                    }

                    return null;
                };

                function isLoading() {
                    return !vm.project.$resolved || !vm.user.$resolved || !vm.financingRound.$resolved;
                }

                function reloadUserAndProject() {
                    // parallel execution of backend calls
                    var promises = $q.all({
                        project: Project.get(vm.project.id),
                        user: Authentication.reloadUser().$promise,
                        financingRound: FinancingRound.reloadCurrentRound()
                    });

                    // will be resolved when all calls are completed
                    promises.then(function (resolvedPromises) {
                        angular.copy(resolvedPromises.project, vm.project);
                        vm.project._recentChange = new Date().getTime();
                        vm.amountInitialized = false;
                        vm.initAmount();
                        vm.financingRound = angular.copy(resolvedPromises.financingRound, vm.financingRound);

                        // the user is already copied over in their services
                    });

                    return promises;
                }
            }
        };
    });
