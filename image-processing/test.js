'use strict'
const expect = require('chai').expect // require syntax vereist iets oudere versie
const handler = require('./handler')

const initial_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9bi1IrDnYQdcjQOtlFRRxrFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxdnBSdJES/5cUWsR4cNyPd/ced+8Af7PKVLMnAaiaZWRSSSGXXxV6XxFEP0KIYVRipj4niml4jq97+Ph6F+dZ3uf+HANKwWSATyBOMN2wiDeIZzYtnfM+cYSVJYX4nHjCoAsSP3JddvmNc8lhP8+MGNnMPHGEWCh1sdzFrGyoxNPEUUXVKN+fc1nhvMVZrdZZ+578heGCtrLMdZpjSGERSxAhQEYdFVRhIU6rRoqJDO0nPfwjjl8kl0yuChg5FlCDCsnxg//B727N4tSkmxROAsEX2/6IAb27QKth29/Htt06AQLPwJXW8deawOwn6Y2OFj0CBreBi+uOJu8BlzvA8JMuGZIjBWj6i0Xg/Yy+KQ8M3QKhNbe39j5OH4AsdZW+AQ4OgfESZa97vLuvu7d/z7T7+wF+eXKr5Nf5lAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+gFCwomMba1PfYAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAD0lEQVQI12P4z8DA/l8YAAgnAhlNUSGtAAAAAElFTkSuQmCC";

const grayscale_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4AWM0MzP739zczAAADhYDLCgAyDMAAAAASUVORK5CYII=";

describe('Image processing', async function() {
    it('gives a 200 for a valid request', async function() {
        const function_context = {
            stored_status: undefined,
            data: undefined,
            status: function (value) {
                if (!value) {
                    return this.stored_status;
                }
                else {
                    this.stored_status = value;
                    return this;
                }
            },
            succeed: function(value) {
                this.data = value;
            }
        }
        let event = {
            body: initial_base64,
            headers: {
                authorization: "Bearer my-secret-pw"
            }
        };
        await handler(event, function_context);
        expect(function_context.status()).to.equal(200);
        expect(function_context.data.trim()).to.equal(grayscale_base64);
    });
});
