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
import { TypeStrings } from "./Enums";
import { Parameters } from "./URI";
/**
 * @class Class creating a Name Address SIP header.
 *
 * @param {SIP.URI} uri
 * @param {String} [displayName]
 * @param {Object} [parameters]
 *
 */
var NameAddrHeader = /** @class */ (function (_super) {
    __extends(NameAddrHeader, _super);
    function NameAddrHeader(uri, displayName, parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.type = TypeStrings.NameAddrHeader;
        // Checks
        if (!uri || !(uri.type === TypeStrings.URI)) {
            throw new TypeError('missing or invalid "uri" parameter');
        }
        _this.uri = uri;
        _this._displayName = displayName;
        return _this;
    }
    Object.defineProperty(NameAddrHeader.prototype, "friendlyName", {
        get: function () {
            return this.displayName || this.uri.aor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NameAddrHeader.prototype, "displayName", {
        get: function () { return this._displayName; },
        set: function (value) {
            this._displayName = value;
        },
        enumerable: true,
        configurable: true
    });
    NameAddrHeader.prototype.clone = function () {
        return new NameAddrHeader(this.uri.clone(), this._displayName, JSON.parse(JSON.stringify(this.parameters)));
    };
    NameAddrHeader.prototype.toString = function () {
        var body = (this.displayName || this.displayName === "0") ? '"' + this.displayName + '" ' : "";
        body += "<" + this.uri.toString() + ">";
        for (var parameter in this.parameters) {
            if (this.parameters.hasOwnProperty(parameter)) {
                body += ";" + parameter;
                if (this.parameters[parameter] !== null) {
                    body += "=" + this.parameters[parameter];
                }
            }
        }
        return body;
    };
    return NameAddrHeader;
}(Parameters));
export { NameAddrHeader };
