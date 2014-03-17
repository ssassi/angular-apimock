'use strict';

angular.module('apiMock', [])

	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})

	.factory('mockSwitch', function() {
		return {
			mockApi: function() {
				return location.search.toLowerCase().indexOf('apimock=true') > -1;
			}
		};
	})

	.factory('httpInterceptor', function ($q, mockSwitch) {
		var doMock = mockSwitch.mockApi(),
			config = {
				mockDataPath: '/mock_data',
				apiPath: '/api'
			};

		return {
			apiMocked: mockSwitch.mockApi,
			request: function(req) {
				if (doMock && req) {
					if (req.url.indexOf(config.apiPath) === 0) {
						var path = req.url.substring(config.apiPath.length);
						req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
					}
				}

				return req || $q.when(req);
			},
			config: function(options) {
				angular.extend(config, options);
			}
		};
	}
);
