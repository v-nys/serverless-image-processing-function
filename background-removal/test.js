'use strict'
const expect = require('chai').expect
const handler = require('./handler') // The function's handler

const initial_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bi1IrDnYQdcjQOtlFRRxrFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxdnBSdJES/5cUWsR4cNyPd/ced+8Af7PKVLMnAaiaZWRSSSGXXxV6XxFEP0KIYVRipj4niml4jq97+Ph6F+dZ3uf+HANKwWSATyBOMN2wiDeIZzYtnfM+cYSVJYX4nHjCoAsSP3JddvmNc8lhP8+MGNnMPHGEWCh1sdzFrGyoxNPEUUXVKN+fc1nhvMVZrdZZ+578heGCtrLMdZpjSGERSxAhQEYdFVRhIU6rRoqJDO0nPfwjjl8kl0yuChg5FlCDCsnxg//B727N4tSkmxROAsEX2/6IAb27QKth29/Htt06AQLPwJXW8deawOwn6Y2OFj0CBreBi+uOJu8BlzvA8JMuGZIjBWj6i0Xg/Yy+KQ8M3QKhNbe39j5OH4AsdZW+AQ4OgfESZa97vLuvu7d/z7T7+wF+eXKr5Nf5lAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+gFCwomMba1PfYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAD0lEQVQI12P4z8DA/l8YAAgnAhlNUSGtAAAAAElFTkSuQmCC";

const grayscale_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4AWM0MzP739zczAAADhYDLCgAyDMAAAAASUVORK5CYII=";

describe('Image processing', async function() {
    it('gives a 200 for a valid request', async function() {
        let success_callback = async function(err, val) { };
        let event = new FunctionEvent({
            body: initial_base64,
            headers: {
                authorization: "Bearer my-secret-pw"
            }
        });
        let context = new FunctionContext(success_callback);
        let res = await handler(event, context);
        expect(context.status()).to.equal(200);
        expect(context.data.trim()).to.equal(grayscale_base64);
    });
});

class FunctionEvent {
    constructor(req) {
        this.body = req.body;
        this.headers = req.headers;
        this.method = req.method;
        this.query = req.query;
        this.path = req.path;
    }
}

class FunctionContext {
    constructor(cb) {
        this.statusValue = 200;
        this.cb = cb;
        this.headerValues = {};
        this.cbCalled = 0;
    }
    status(value) {
        if (!value) {
            return this.statusValue;
        }
        this.statusValue = value;
        return this;
    }
    headers(value) {
        if (!value) {
            return this.headerValues;
        }
        this.headerValues = value;
        return this;
    }
    succeed(value) {
        let err;
        this.cbCalled++;
        this.data = value;
        this.cb(err, value);
    }
    fail(value) {
        let message;
        this.cbCalled++;
        this.cb(value, message);
    }
}
