let sinon = require('sinon');
let assert = require('chai').assert;
let transformData = require('../api').transformData;
let sendRequest = require('../api').sendRequest;


describe("api", function () {

    describe("transformData", function () {

        const status = 200;

        const response = {
            "coord": {
                "lon": 139,
                "lat": 35
            },
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01n"
                }
            ],
            "base": "stations",
            "main": {
                "temp": 28.92,
                "pressure": 1009,
                "humidity": 92,
                "temp_min": 28.71,
                "temp_max": 29
            },
            "visibility": 10000,
            "wind": {
                "speed": 0.47,
                "deg": 107.538
            },
            "clouds": {
                "all": 2
            },
            "dt": 1573312299,
            "sys": {
                "type": 3,
                "id": 2019346,
                "country": "JP",
                "sunrise": 1560281377,
                "sunset": 1560333478
            },
            "timezone": 32400,
            "id": 1851632,
            "name": "Shuzenji",
            "cod": 200
        };

        it('data should contain "parameters" array ', function () {
            const data = transformData(response, status);

            assert.property(data, "parameters");
            assert.isArray(data.parameters);
        });

        it('data array should contain 5 elements)', function () {
           let length = 5;

            const data = transformData(response, status);

            assert.isArray(data.parameters);
            assert.lengthOf(data.parameters, length);
        });

        it("each data's parameter should contains fields: 'name', 'value', 'units', 'icon'", function() {
            const data = transformData(response, status);

            data.parameters.forEach(parameter => {
                assert.property(parameter, "name");
                assert.property(parameter, "value");
                assert.property(parameter, "units");
                assert.property(parameter, "icon");
            });
        });

        it('Error answer when status is not 200', function () {
            const data = transformData(response, 400);
            const errorAnswer = {message: 'city not found'};

            assert.deepEqual(data, errorAnswer);
        });
    });

    describe("sendRequest", function () {

        before(() => {
            global.fetch = () => null;
        });

        after(() => {
            delete global.fetch;
        });

        let stubbedFetch = sinon.stub();
        beforeEach(() => {
            stubbedFetch = sinon.stub(global, "fetch");
            stubbedFetch
                .resolves({
                    ok: true,
                    json: () => Promise.resolve("default json content")
                });
        });

        afterEach(() => {
            stubbedFetch.restore();
        });

        it("should call fetch once", async () => {
            await sendRequest("cityName");

            sinon.assert.calledOnce(stubbedFetch);
        });

        it("should call fetch and return resolved promise", async () => {

            let expectedJsonContent = ["json data", 200];
            stubbedFetch
                .resolves({
                    ok: true,
                    json: () => Promise.resolve(expectedJsonContent)
                });

            const [json, ok] = await sendRequest("cityName");

            assert.equal(json, expectedJsonContent);
        });
    });
});