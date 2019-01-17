describe('authentication service', function () {

    var $httpBackend, ServerTime, localTime;

    beforeEach(function () {
        module('crowdsource');
        module('crowdsource.templates');

        inject(function (_$httpBackend_, _ServerTime_) {
            $httpBackend = _$httpBackend_;
            ServerTime = _ServerTime_;
        });

        localTime = moment();

        // freeze the time. All calls to new Date() return this time
        jasmine.clock().uninstall();
        jasmine.clock().mockDate(localTime.toDate());
        jasmine.clock().install();
    });

    it('should return the time of the server if the server is ahead', function () {
        var serverTime = moment(localTime).add(5, 'seconds');
        $httpBackend.expectGET('/datetime').respond(200, {dateTime: serverTime.toISOString()});

        ServerTime.reloadReferenceTime();
        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf());
    });

    it('should return the time of the server if the server is behind', function () {
        var serverTime = moment(localTime).subtract(500, 'milliseconds');
        $httpBackend.expectGET('/datetime').respond(200, {dateTime: serverTime.toISOString()});

        ServerTime.reloadReferenceTime();
        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf());
    });

    it('should return the time of the server if the server and client are in sync', function () {
        var serverTime = moment(localTime);
        $httpBackend.expectGET('/datetime').respond(200, {dateTime: serverTime.toISOString()});

        ServerTime.reloadReferenceTime();
        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf());
    });

    it('should still return the correct server time after some time elapsed', function () {
        var serverTime = moment(localTime).add(5, 'seconds');
        $httpBackend.expectGET('/datetime').respond(200, {dateTime: serverTime.toISOString()});

        ServerTime.reloadReferenceTime();
        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf());

        var elapsedMs = 10000;
        jasmine.clock().tick(elapsedMs);

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf() + elapsedMs);
    });

    it('should return the local time until the server response arrives', function () {
        var serverTime = moment(localTime).add(5, 'seconds');
        $httpBackend.expectGET('/datetime').respond(200, {dateTime: serverTime.toISOString()});

        ServerTime.reloadReferenceTime();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(localTime.valueOf());

        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(serverTime.valueOf());
    });

    it('should return the local time if reloadReferenceTime was not called', function () {
        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(localTime.valueOf());
    });

    it('should return the local time if the server time could not be retrieved', function () {
        $httpBackend.expectGET('/datetime').respond(500);

        ServerTime.reloadReferenceTime();
        $httpBackend.flush();

        expect(ServerTime.getInterpolatedTimeOfServer().getTime()).toBe(localTime.valueOf());
    });
});
