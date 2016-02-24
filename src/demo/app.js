// pn: project name

angular.module('ui.bootstrap.modal', [])
/**
 * Pluggable resolve mechanism for the modal resolve resolution
 * Supports UI Router's $resolve service
 */
    .provider('$uibResolve', function() {
        var resolve = this;
        this.resolver = null;

        this.setResolver = function(resolver) {
            this.resolver = resolver;
        };

        this.$get = ['$injector', '$q', function($injector, $q) {
            var resolver = resolve.resolver ? $injector.get(resolve.resolver) : null;
            return {
                resolve: function(invocables, locals, parent, self) {
                    if (resolver) {
                        return resolver.resolve(invocables, locals, parent, self);
                    }

                    var promises = [];

                    angular.forEach(invocables, function(value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promises.push($q.resolve($injector.invoke(value)));
                        } else if (angular.isString(value)) {
                            promises.push($q.resolve($injector.get(value)));
                        } else {
                            promises.push($q.resolve(value));
                        }
                    });

                    return $q.all(promises).then(function(resolves) {
                        var resolveObj = {};
                        var resolveIter = 0;
                        angular.forEach(invocables, function(value, key) {
                            resolveObj[key] = resolves[resolveIter++];
                        });

                        return resolveObj;
                    });
                }
            };
        }];
    })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
    .directive('uibModalBackdrop', ['$animateCss', '$injector', '$uibModalStack',
    function($animateCss, $injector, $modalStack) {
        return {
            replace: true,
            templateUrl: '/demo/components/modal/backdrop.html',    //'uib/template/modal/backdrop.html',
            compile: function(tElement, tAttrs) {
                tElement.addClass(tAttrs.backdropClass);
                return linkFn;
            }
        };

        function linkFn(scope, element, attrs) {
            if (attrs.modalInClass) {
                $animateCss(element, {
                    addClass: attrs.modalInClass
                }).start();

                scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
                    var done = setIsAsync();
                    if (scope.modalOptions.animation) {
                        $animateCss(element, {
                            removeClass: attrs.modalInClass
                        }).start().then(done);
                    } else {
                        done();
                    }
                });
            }
        }
    }])

    .directive('uibModalWindow', ['$uibModalStack', '$q', '$animate', '$animateCss', '$document',
    function($modalStack, $q, $animate, $animateCss, $document) {
        return {
            scope: {
                index: '@'
            },
            replace: true,
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                return tAttrs.templateUrl || '/demo/components/modal/window.html'; //'uib/template/modal/window.html';
            },
            link: function(scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                element.addClass(attrs.windowTopClass || '');
                scope.size = attrs.size;

                scope.close = function(evt) {
                    var modal = $modalStack.getTop();
                    if (modal && modal.value.backdrop &&
                        modal.value.backdrop !== 'static' &&
                        evt.target === evt.currentTarget) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $modalStack.dismiss(modal.key, 'backdrop click');
                    }
                };

                // moved from template to fix issue #2280
                element.on('click', scope.close);

                // This property is only added to the scope for the purpose of detecting when this directive is rendered.
                // We can detect that by using this property in the template associated with this directive and then use
                // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
                scope.$isRendered = true;

                // Deferred object that will be resolved when this modal is render.
                var modalRenderDeferObj = $q.defer();
                // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
                // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
                attrs.$observe('modalRender', function(value) {
                    if (value === 'true') {
                        modalRenderDeferObj.resolve();
                    }
                });

                modalRenderDeferObj.promise.then(function() {
                    var animationPromise = null;

                    if (attrs.modalInClass) {
                        animationPromise = $animateCss(element, {
                            addClass: attrs.modalInClass
                        }).start();

                        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
                            var done = setIsAsync();
                            if ($animateCss) {
                                $animateCss(element, {
                                    removeClass: attrs.modalInClass
                                }).start().then(done);
                            } else {
                                $animate.removeClass(element, attrs.modalInClass).then(done);
                            }
                        });
                    }


                    $q.when(animationPromise).then(function() {
                        /**
                         * If something within the freshly-opened modal already has focus (perhaps via a
                         * directive that causes focus). then no need to try and focus anything.
                         */
                        if (!($document[0].activeElement && element[0].contains($document[0].activeElement))) {
                            var inputWithAutofocus = element[0].querySelector('[autofocus]');
                            /**
                             * Auto-focusing of a freshly-opened modal element causes any child elements
                             * with the autofocus attribute to lose focus. This is an issue on touch
                             * based devices which will show and then hide the onscreen keyboard.
                             * Attempts to refocus the autofocus element via JavaScript will not reopen
                             * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                             * the modal element if the modal does not contain an autofocus element.
                             */
                            if (inputWithAutofocus) {
                                inputWithAutofocus.focus();
                            } else {
                                element[0].focus();
                            }
                        }
                    });

                    // Notify {@link $modalStack} that modal is rendered.
                    var modal = $modalStack.getTop();
                    if (modal) {
                        $modalStack.modalRendered(modal.key);
                    }
                });
            }
        };
    }])

    .directive('uibModalAnimationClass', function() {
        return {
            compile: function(tElement, tAttrs) {
                if (tAttrs.modalAnimation) {
                    tElement.addClass(tAttrs.uibModalAnimationClass);
                }
            }
        };
    })

    .directive('uibModalTransclude', function() {
        return {
            link: function(scope, element, attrs, controller, transclude) {
                transclude(scope.$parent, function(clone) {
                    element.empty();
                    element.append(clone);
                });
            }
        };
    })

    .factory('$uibModalStack', ['$animate', '$animateCss', '$document',
        '$compile', '$rootScope', '$q',
        function($animate, $animateCss, $document, $compile, $rootScope, $q) {
            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            // var openedWindows = $$stackedMap.createNew();
            // var openedClasses = $$multiMap.createNew();
            var openedWindows = new T.Collections.StackedMap();
            var openedClasses = new T.Collections.MultiMap();
            var $modalStack = {
                NOW_CLOSING_EVENT: 'modal.stack.now-closing'
            };

            //Modal focus behavior
            var focusableElementList;
            var focusIndex = 0;
            var tababbleSelector = 'a[href], area[href], input:not([disabled]), ' +
                'button:not([disabled]),select:not([disabled]), textarea:not([disabled]), ' +
                'iframe, object, embed, *[tabindex], *[contenteditable=true]';

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance, elementToReceiveFocus) {
                var modalWindow = openedWindows.get(modalInstance).value;
                var appendToElement = modalWindow.appendTo;

                //clean up the stack
                openedWindows.remove(modalInstance);

                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
                    var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
                    openedClasses.remove(modalBodyClass, modalInstance);
                    appendToElement.toggleClass(modalBodyClass, openedClasses.hasKey(modalBodyClass));
                    toggleTopWindowClass(true);
                }, modalWindow.closedDeferred);
                checkRemoveBackdrop();

                //move focus to specified element if available, or else to body
                if (elementToReceiveFocus && elementToReceiveFocus.focus) {
                    elementToReceiveFocus.focus();
                } else if (appendToElement.focus) {
                    appendToElement.focus();
                }
            }

            // Add or remove "windowTopClass" from the top window in the stack
            function toggleTopWindowClass(toggleSwitch) {
                var modalWindow;

                if (openedWindows.length() > 0) {
                    modalWindow = openedWindows.top().value;
                    modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
                }
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() === -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, function() {
                        backdropScopeRef = null;
                    });
                    backdropDomEl = undefined;
                    backdropScope = undefined;
                }
            }

            function removeAfterAnimate(domEl, scope, done, closedDeferred) {
                var asyncDeferred;
                var asyncPromise = null;
                var setIsAsync = function() {
                    if (!asyncDeferred) {
                        asyncDeferred = $q.defer();
                        asyncPromise = asyncDeferred.promise;
                    }

                    return function asyncDone() {
                        asyncDeferred.resolve();
                    };
                };
                scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

                // Note that it's intentional that asyncPromise might be null.
                // That's when setIsAsync has not been called during the
                // NOW_CLOSING_EVENT broadcast.
                return $q.when(asyncPromise).then(afterAnimating);

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    $animateCss(domEl, {
                        event: 'leave'
                    }).start().then(function() {
                        domEl.remove();
                        if (closedDeferred) {
                            closedDeferred.resolve();
                        }
                    });

                    scope.$destroy();
                    if (done) {
                        done();
                    }
                }
            }

            $document.on('keydown', keydownListener);

            $rootScope.$on('$destroy', function() {
                $document.off('keydown', keydownListener);
            });

            function keydownListener(evt) {
                if (evt.isDefaultPrevented()) {
                    return evt;
                }

                var modal = openedWindows.top();
                if (modal) {
                    switch (evt.which) {
                        case 27: {
                            if (modal.value.keyboard) {
                                evt.preventDefault();
                                $rootScope.$apply(function() {
                                    $modalStack.dismiss(modal.key, 'escape key press');
                                });
                            }
                            break;
                        }
                        case 9: {
                            $modalStack.loadFocusElementList(modal);
                            var focusChanged = false;
                            if (evt.shiftKey) {
                                if ($modalStack.isFocusInFirstItem(evt) || $modalStack.isModalFocused(evt, modal)) {
                                    focusChanged = $modalStack.focusLastFocusableElement();
                                }
                            } else {
                                if ($modalStack.isFocusInLastItem(evt)) {
                                    focusChanged = $modalStack.focusFirstFocusableElement();
                                }
                            }

                            if (focusChanged) {
                                evt.preventDefault();
                                evt.stopPropagation();
                            }
                            break;
                        }
                    }
                }
            }

            $modalStack.open = function(modalInstance, modal) {
                var modalOpener = $document[0].activeElement,
                    modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

                toggleTopWindowClass(false);

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    renderDeferred: modal.renderDeferred,
                    closedDeferred: modal.closedDeferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard,
                    openedClass: modal.openedClass,
                    windowTopClass: modal.windowTopClass,
                    animation: modal.animation,
                    appendTo: modal.appendTo
                });

                openedClasses.put(modalBodyClass, modalInstance);

                var appendToElement = modal.appendTo,
                        currBackdropIndex = backdropIndex();

                if (!appendToElement.length) {
                    throw new Error('appendTo element not found. Make sure that the element passed is in DOM.');
                }

                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.modalOptions = modal;
                    backdropScope.index = currBackdropIndex;
                    backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
                    backdropDomEl.attr('backdrop-class', modal.backdropClass);
                    if (modal.animation) {
                        backdropDomEl.attr('modal-animation', 'true');
                    }
                    $compile(backdropDomEl)(backdropScope);
                    $animate.enter(backdropDomEl, appendToElement);
                }

                var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
                angularDomEl.attr({
                    'template-url': modal.windowTemplateUrl,
                    'window-class': modal.windowClass,
                    'window-top-class': modal.windowTopClass,
                    'size': modal.size,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(modal.content);
                if (modal.animation) {
                    angularDomEl.attr('modal-animation', 'true');
                }

                $animate.enter($compile(angularDomEl)(modal.scope), appendToElement)
                    .then(function() {
                        $animate.addClass(appendToElement, modalBodyClass);
                    });

                openedWindows.top().value.modalDomEl = angularDomEl;
                openedWindows.top().value.modalOpener = modalOpener;

                $modalStack.clearFocusListCache();
            };

            function broadcastClosing(modalWindow, resultOrReason, closing) {
                return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
            }

            $modalStack.close = function(modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow && broadcastClosing(modalWindow, result, true)) {
                    modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                    return true;
                }
                return !modalWindow;
            };

            $modalStack.dismiss = function(modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
                    modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                    return true;
                }
                return !modalWindow;
            };

            $modalStack.dismissAll = function(reason) {
                var topModal = this.getTop();
                while (topModal && this.dismiss(topModal.key, reason)) {
                    topModal = this.getTop();
                }
            };

            $modalStack.getTop = function() {
                return openedWindows.top();
            };

            $modalStack.modalRendered = function(modalInstance) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.renderDeferred.resolve();
                }
            };

            $modalStack.focusFirstFocusableElement = function() {
                if (focusableElementList.length > 0) {
                    focusableElementList[0].focus();
                    return true;
                }
                return false;
            };
            $modalStack.focusLastFocusableElement = function() {
                if (focusableElementList.length > 0) {
                    focusableElementList[focusableElementList.length - 1].focus();
                    return true;
                }
                return false;
            };

            $modalStack.isModalFocused = function(evt, modalWindow) {
                if (evt && modalWindow) {
                    var modalDomEl = modalWindow.value.modalDomEl;
                    if (modalDomEl && modalDomEl.length) {
                        return (evt.target || evt.srcElement) === modalDomEl[0];
                    }
                }
                return false;
            };

            $modalStack.isFocusInFirstItem = function(evt) {
                if (focusableElementList.length > 0) {
                    return (evt.target || evt.srcElement) === focusableElementList[0];
                }
                return false;
            };

            $modalStack.isFocusInLastItem = function(evt) {
                if (focusableElementList.length > 0) {
                    return (evt.target || evt.srcElement) === focusableElementList[focusableElementList.length - 1];
                }
                return false;
            };

            $modalStack.clearFocusListCache = function() {
                focusableElementList = [];
                focusIndex = 0;
            };

            $modalStack.loadFocusElementList = function(modalWindow) {
                if (focusableElementList === undefined || !focusableElementList.length) {
                    if (modalWindow) {
                        var modalDomE1 = modalWindow.value.modalDomEl;
                        if (modalDomE1 && modalDomE1.length) {
                            focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
                        }
                    }
                }
            };

            return $modalStack;
        }])

    .provider('$uibModal', function() {
        var $modalProvider = {
            options: {
                animation: true,
                backdrop: true, //can also be false or 'static'
                keyboard: true
            },
            $get: ['$rootScope', '$q', '$document', '$templateRequest', '$controller', '$uibResolve', '$uibModalStack',
                function ($rootScope, $q, $document, $templateRequest, $controller, $uibResolve, $modalStack) {
                    var $modal = {};

                    function getTemplatePromise(options) {
                        return options.template ? $q.when(options.template) :
                            $templateRequest(angular.isFunction(options.templateUrl) ?
                                options.templateUrl() : options.templateUrl);
                    }

                    var promiseChain = null;
                    $modal.getPromiseChain = function() {
                        return promiseChain;
                    };

                    $modal.open = function(modalOptions) {
                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();
                        var modalClosedDeferred = $q.defer();
                        var modalRenderDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            closed: modalClosedDeferred.promise,
                            rendered: modalRenderDeferred.promise,
                            close: function (result) {
                                return $modalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                return $modalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};
                        modalOptions.appendTo = modalOptions.appendTo || $document.find('body').eq(0);

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions), $uibResolve.resolve(modalOptions.resolve, {}, null, null)]);

                        function resolveWithTemplate() {
                            return templateAndResolvePromise;
                        }

                        // Wait for the resolution of the existing promise chain.
                        // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
                        // Then add to $modalStack and resolve opened.
                        // Finally clean up the chain variable if no subsequent modal has overwritten it.
                        var samePromise;
                        samePromise = promiseChain = $q.all([promiseChain])
                            .then(resolveWithTemplate, resolveWithTemplate)
                            .then(function resolveSuccess(tplAndVars) {
                                var providedScope = modalOptions.scope || $rootScope;

                                var modalScope = providedScope.$new();
                                modalScope.$close = modalInstance.close;
                                modalScope.$dismiss = modalInstance.dismiss;

                                modalScope.$on('$destroy', function() {
                                    if (!modalScope.$$uibDestructionScheduled) {
                                        modalScope.$dismiss('$uibUnscheduledDestruction');
                                    }
                                });

                                var ctrlInstance, ctrlLocals = {};

                                //controllers
                                if (modalOptions.controller) {
                                    ctrlLocals.$scope = modalScope;
                                    ctrlLocals.$uibModalInstance = modalInstance;
                                    angular.forEach(tplAndVars[1], function(value, key) {
                                        ctrlLocals[key] = value;
                                    });

                                    ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                    if (modalOptions.controllerAs) {
                                        if (modalOptions.bindToController) {
                                            ctrlInstance.$close = modalScope.$close;
                                            ctrlInstance.$dismiss = modalScope.$dismiss;
                                            angular.extend(ctrlInstance, providedScope);
                                        }

                                        modalScope[modalOptions.controllerAs] = ctrlInstance;
                                    }
                                }

                                $modalStack.open(modalInstance, {
                                    scope: modalScope,
                                    deferred: modalResultDeferred,
                                    renderDeferred: modalRenderDeferred,
                                    closedDeferred: modalClosedDeferred,
                                    content: tplAndVars[0],
                                    animation: modalOptions.animation,
                                    backdrop: modalOptions.backdrop,
                                    keyboard: modalOptions.keyboard,
                                    backdropClass: modalOptions.backdropClass,
                                    windowTopClass: modalOptions.windowTopClass,
                                    windowClass: modalOptions.windowClass,
                                    windowTemplateUrl: modalOptions.windowTemplateUrl,
                                    size: modalOptions.size,
                                    openedClass: modalOptions.openedClass,
                                    appendTo: modalOptions.appendTo
                                });
                                modalOpenedDeferred.resolve(true);

                        }, function resolveError(reason) {
                            modalOpenedDeferred.reject(reason);
                            modalResultDeferred.reject(reason);
                        })['finally'](function() {
                            if (promiseChain === samePromise) {
                                promiseChain = null;
                            }
                        });

                        return modalInstance;
                    };

                    return $modal;
                }
            ]
        };

        return $modalProvider;
    })

    .controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

      $scope.items = ['item1', 'item2', 'item3'];

      // $scope.animationsEnabled = true;

      $scope.open = function (size) {

        var modalInstance = $uibModal.open({
          // animation: $scope.animationsEnabled,
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      // $scope.toggleAnimation = function () {
      //   $scope.animationsEnabled = !$scope.animationsEnabled;
      // };

    })
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };

      $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    });


angular.module('pnApp.filters', [])
	.filter('fooFilter', ['$log', function(){

		console.log('app filter');

		return function(){
			return 0;
		};
	}]);

angular.module('pnApp.services', []).value('version', '0.1')	// 'ngResource'
    .factory('tModalService', function ($compile){

        console.log('app tModalService');
        var modalScope;

        return {
            create: function(options){
                var parseData= function(data){
                    if(modalScope){
                        modalScope.$destroy();
                    }
                    modalScope=options.scope.$new();
                    return $compile(data)(modalScope);
                };

                var onInitialized= function(){
                    // modal.show();
                    this.show();
                };

                var modal= new T.UI.Components.Modal(options.targetElement, {
                    modalId: options.modalId,
                    show: false,
                    bindTarget: false,
                    remote: options.remote,     //'/demo/components/paginator/remoteEditor.html',
                    parseData: options.parseData || parseData,
                    onInitialized: options.onInitialized || onInitialized,
                    buttons: options.buttons
                    // close $scope.distroy
                });

                return modal;
            }
        };
    })
	.factory('fooService', function (){

		console.log('app service');

		return {
			foo: 'foo'
		};
	});

angular.module('pnApp.controllers', [])
	.controller('fooController', ['$scope', '$rootScope', function ($scope, $rootScope){
		console.log('app controller');
	}])
    .controller('treeController', ['$scope', '$rootScope', function ($scope, $rootScope){
        // console.log('app controller');

        var treeOptions={
            // onNodeChecked: function(e, node){ alert( node.text + ': onNodeChecked') },
            // onNodeCollapsed: function(e, node){ alert( node.text + ': onNodeCollapsed') },
            // onNodeDisabled: function(e, node){ alert( node.text + ': onNodeDisabled') },
            // onNodeEnabled: function(e, node){ alert( node.text + ': onNodeEnabled') },
            // onNodeExpanded: function(e, node){ alert( node.text + ': onNodeExpanded') },
            onNodeSelected: function(e, node){ alert( node.text + ': onNodeSelected') }//,
            // onNodeUnchecked: function(e, node){ alert( node.text + ': onNodeUnchecked') },
            // onNodeUnselected: function(e, node){ alert( node.text + ': onNodeUnselected') },
            // onSearchComplete: function(e, node){ alert( node.text + ': onSearchComplete') },
            // onSearchCleared: function(e, node){ alert( node.text + ': onSearchCleared') }
        };
        $scope.treeOptions = treeOptions;

        var data= [
            {
                "text": "Parent 2",
                "href": "#parent2",
                "tags": ["0"]
            },
            {
                "text": "Parent 3",
                "href": "#parent3",
                "tags": ["4"],
                "nodes": [
                    {
                        "text": "Child 3",
                        "href": "#child3",
                        "tags": ["2"],
                        "nodes": [
                            {
                                "text": "Grandchild 31",
                                "href": "#grandchild31",
                                "tags": ["0"]
                            },
                            {
                                "text": "Grandchild 32",
                                "href": "#grandchild32",
                                "tags": ["0"]
                            }
                        ]
                    },
                    {
                        "text": "Child 2",
                        "href": "#child2",
                        "tags": ["0"]
                    }
                ]
            },
            {
                "text": "Parent 5",
                "href": "#parent5"  ,
                "tags": ["0"]
            }
        ];

        $scope.collapseAll= function(){
            $scope.treeRef.collapseAll();
        };
        $scope.expandAll= function(){
            $scope.treeRef.expandAll();
        };
        $scope.changeData= function(){
            $scope.treeRef.updateData(data);
            $scope.treeRef.refresh();
        };
    }])
	.controller('bindController', ['$scope', '$rootScope', function ($scope, $rootScope){
        $scope.comboboxValue= 'CO';
        $scope.spinnerValue= 55;
        $scope.typeaheadValue= 'Virginia';
        $scope.levelValue= '230000,230200,230227';	// 330000,330600,330682 浙江 / 绍兴 / 上虞
        $scope.dtpickerValue= '2001-11-11 11:11:11';
    }])
    .controller("validatorController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;
    }])
    .controller('paginatorController', ['$scope', '$rootScope', '$compile', 'tModalService', function ($scope, $rootScope, $compile, Modal){
        function reloadList(pageIndex){
            var queryData={
                name: $('#formQuery #name').val(),
                pageSize: 10,
                pageIndex: pageIndex,
            };

            $.ajax({
                dataType: 'json',
                url: '/demo/components/paginator/data.json',
                data: queryData,
                success: function(data){
                    for(var i=0; i<data.entities.length; i++){
                        data.entities[i].name += (pageIndex+1); // 模拟查询结果数据
                    }

                    $scope.pageRef.updateOptions({pageIndex: pageIndex, totalRecords: data.totalRecords});

                    $scope.entities= data.entities;// $.extend(true, [], data);
                    $scope.$apply();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：paginator，ajax获取数据失败!');
                }
            });
        }

        $('#paginatorx').on('paginator.on.pageindexchange', function(e, pageIndex){
            reloadList(pageIndex);
        });

        $scope.query=function(e){
            reloadList(0);
        }

        $scope.toggleCheckBoxes = function (e) {
            var checkedAll = $(event.target).is(':checked');
            $('#tblListData tbody :checkbox').prop('checked', checkedAll);
        };

        var creatorScope;
        $scope.create= function(e){
            var creator= new T.UI.Components.Modal(e.target, {
                modalId: '#demoPopCreatorModal',
                show: false,
                bindTarget: false,
                remote: '/demo/components/paginator/remoteCreator.html',
                parseData: function(data){
                    if(creatorScope){
                        creatorScope.$destroy();
                    }
                    creatorScope=$scope.$new();
                    return $compile(data)(creatorScope);
                },
                onInitialized: function(){
                    $scope.$broadcast("craeteEntity");  //, entity
                    creator.show();
                },
                buttons: {
                    submit: {
                        selector: '.submit',
                        eventName: 'click',
                        handler: function(e){
                            $scope.$broadcast("craeteEntitySubmit");  //, entity
                        }
                    }
                }
                // close $scope.distroy
            });
        };

        // 动态加载的内容compiled以后，从dom中移除还不够，还需要销毁$scope
        var editorScope;
        $scope.edit=function(entity, e){
            e.preventDefault();

            // if(!confirm('你确定要修改id: '+entity.id+' 吗？')){
            //     return;
            // }

            // get html
            // get data
            // bind data
            // show

            // var editor= new T.UI.Components.Modal(e.target, {
            //     modalId: '#demoPopEditorModal',
            //     show: false,
            //     bindTarget: false,
            //     remote: '/demo/components/paginator/remoteEditor.html',
            //     parseData: function(data){
            //         if(editorScope){
            //             editorScope.$destroy();
            //         }
            //         editorScope=$scope.$new();
            //         return $compile(data)(editorScope);
            //     },
            //     onInitialized: function(){
            //         $scope.$broadcast("editEntity", entity);
            //         editor.show();
            //     },
            //     buttons: {
            //         submit: {
            //             selector: '.submit',
            //             eventName: 'click',
            //             handler: function(e){
            //                 $scope.$broadcast("editorEntitySubmit");  //, entity
            //             }
            //         }
            //     }
            //     // close $scope.distroy
            // });

            var editor= Modal.create({
                modalId: '#demoPopEditorModal',
                targetElement: e.target,
                remote: '/demo/components/paginator/remoteEditor.html',
                scope: $scope,
                onInitialized: function(){
                    $scope.$broadcast("editEntity", entity);
                    this.show();
                }//,
                // buttons: {
                //     submit: {
                //         selector: '.submit',
                //         eventName: 'click',
                //         handler: function(e){
                //             $scope.$broadcast("editorEntitySubmit");  //, entity
                //         }
                //     }
                // }
            });

            var unRegister= $scope.$on('editorSubmitSuccess', function(event){
                editor.hide();

                // 必须取消事件注册，否则会在$scope.$listener里重复添加事件注册。
                // 导致不同的动态窗口重复调用$scope.$on的handler函数。
                unRegister();
            });

            // TODO: doesn't work ($scope haven't distroyed)
            // $scope.$on('$destroy', function() {
            //     unRegister();
            // });

            // this.inputElements.original.trigger('modal.on.initialized');
        };

        $scope.deleteEntity=function(entity, e){
            e.preventDefault();

            if(!confirm('你确定要删除id: '+entity.id+' 吗？')){
                return;
            }
        };

        $scope.batchDelete=function(e){
            var selectedEntities = $('#tblListData tbody :checkbox:checked');
            if (selectedEntities.length === 0) {
                alert('请选择要删除的行！');
                return;
            }

            if (!confirm('确定要删除选定行么？')) {
                return;
            }            

            function done(data) {
                context.ajaxDone.call(context, data);
            }

            var ids=[];
            selectedEntities.each(function (index) {
                var id = $(this).val();
                // context.options.restfulService.remove('/admin/' + context.options.entityName + '/remove', id, done);
                ids.push(id);
            });

            alert('删除选中id: '+ids.join(','));
        };

        $scope.pageOptions={
            pageSize: 20,       // 每页记录数
            pageIndex: 0,       // 当前页
            pageButtons: 7      // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
        };
        reloadList(0);
    }])
    .controller("createController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;

        $scope.$on("createEntity",function (event){ // , entity
            // $scope.entity= entity;

            $scope.validatorRef.resetForm();
        });

        $scope.$on("craeteEntitySubmit",function (event){ // , entity
            // $scope.entity= entity;

            $scope.validatorRef.checkForm();
        });
    }])
    .controller("editController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;

        $scope.$on("editEntity",function (event, entity){
            $scope.entity= entity;

            $scope.validatorRef.resetForm();
        });

        $scope.onSubmit= function(e){
            var successed= $scope.validatorRef.checkForm();
            // alert(successed);
            // $scope.$parent.
            if(successed){
                $scope.$emit('editorSubmitSuccess');
            }
        };
        // $scope.$on("editorEntitySubmit",function (event){ // , entity
        //     // $scope.entity= entity;
        //     $scope.validatorRef.checkForm();
        // });
    }]);

angular.module('pnApp.directives', [])
    .directive('fooDirective', ['$rootScope', '$compile', function($rootScope, $compile){
		console.log('app directive');

		function link(){
			console.log('app directive link');
		}

		return {
			scope:{
				instance     : '=controller',
				templateUrl  : '@',
				unload       : '&'
			},
			restric          : 'A',
			transclude       : false,
			//replace          : false,
			//template         : '<div></div>'
			link             : link
		};
	}]);


var pnApp = angular.module('pnApp', [
		'ngRoute',
		'T.UI.ngControls',
        'T.UI.ngComponents',
        'ui.bootstrap.modal',   // 临时测试用
		'pnApp.filters', 
		'pnApp.services', 
		'pnApp.directives', 
		'pnApp.controllers'//, 
		//'ui.router', 
		//'ui.bootstrap'
	]);

// ui-route
pnApp
    .config([
		//'$stateProvider', 
		'$routeProvider',
		//'$urlRouterProvider', 
		//'$compileProvider', 
		//'$httpProvider', 
		//function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider){
		function ($routeProvider){
			//$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/),
		    //$urlRouterProvider.otherwise("/home"),
		    //$stateProvider.state("task", {
		    //    url: "/task/:uuid",
		    //    templateUrl: "/partials/taskview",
		    //    controller: "TaskviewCtrl"
		    //});
		    // $httpProvider.responseInterceptors.push
		    // $httpProvider.defaults.transformRequest.push
		    // $httpProvider.interceptors.push
		    $routeProvider
		    	.when('/home',{
		    		templateUrl:'/demo/home/index.html'
		    	})
		    	.otherwise({
		    		redirectTo:'/home'
		    	});
		}
	])
	.run(function($rootScope){
		// console.log('app run');
	});

angular.bootstrap(document, ['pnApp']);

/*pnApp.run(function ($rootScope) {
	;
});*/