var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventEmitter } from "events";
import { C } from "./Constants";
import { TypeStrings } from "./Enums";
import { RequestSender } from "./RequestSender";
import { OutgoingRequest } from "./SIPMessage";
import { Utils } from "./Utils";
var ClientContext = /** @class */ (function (_super) {
    __extends(ClientContext, _super);
    function ClientContext(ua, method, target, options) {
        var _this = _super.call(this) || this;
        _this.data = {};
        ClientContext.initializer(_this, ua, method, target, options);
        return _this;
    }
    ClientContext.initializer = function (objToConstruct, ua, method, originalTarget, options) {
        objToConstruct.type = TypeStrings.ClientContext;
        // Validate arguments
        if (originalTarget === undefined) {
            throw new TypeError("Not enough arguments");
        }
        objToConstruct.ua = ua;
        objToConstruct.logger = ua.getLogger("sip.clientcontext");
        objToConstruct.method = method;
        var target = ua.normalizeTarget(originalTarget);
        if (!target) {
            throw new TypeError("Invalid target: " + originalTarget);
        }
        /* Options
        * - extraHeaders
        * - params
        * - contentType
        * - body
        */
        options = Object.create(options || Object.prototype);
        options.extraHeaders = (options.extraHeaders || []).slice();
        // Build the request
        objToConstruct.request = new OutgoingRequest(objToConstruct.method, target, objToConstruct.ua, options.params, options.extraHeaders);
        if (options.body) {
            objToConstruct.body = {};
            objToConstruct.body.body = options.body;
            if (options.contentType) {
                objToConstruct.body.contentType = options.contentType;
            }
            objToConstruct.request.body = objToConstruct.body;
        }
        /* Set other properties from the request */
        if (objToConstruct.request.from) {
            objToConstruct.localIdentity = objToConstruct.request.from;
        }
        if (objToConstruct.request.to) {
            objToConstruct.remoteIdentity = objToConstruct.request.to;
        }
    };
    ClientContext.prototype.send = function () {
        var sender = new RequestSender(this, this.ua);
        sender.send();
        return this;
    };
    ClientContext.prototype.receiveResponse = function (response) {
        var statusCode = response.statusCode || 0;
        var cause = Utils.getReasonPhrase(statusCode);
        switch (true) {
            case /^1[0-9]{2}$/.test(statusCode.toString()):
                this.emit("progress", response, cause);
                break;
            case /^2[0-9]{2}$/.test(statusCode.toString()):
                if (this.ua.applicants[this]) {
                    delete this.ua.applicants[this];
                }
                this.emit("accepted", response, cause);
                break;
            default:
                if (this.ua.applicants[this]) {
                    delete this.ua.applicants[this];
                }
                this.emit("rejected", response, cause);
                this.emit("failed", response, cause);
                break;
        }
    };
    ClientContext.prototype.onRequestTimeout = function () {
        this.emit("failed", undefined, C.causes.REQUEST_TIMEOUT);
    };
    ClientContext.prototype.onTransportError = function () {
        this.emit("failed", undefined, C.causes.CONNECTION_ERROR);
    };
    return ClientContext;
}(EventEmitter));
export { ClientContext };
