import { TypeStrings } from "../Enums";
/* SessionDescriptionHandlerObserver
 * @class SessionDescriptionHandler Observer Class.
 * @param {SIP.Session} session
 * @param {Object} [options]
 */
var SessionDescriptionHandlerObserver = /** @class */ (function () {
    function SessionDescriptionHandlerObserver(session, options) {
        this.type = TypeStrings.SessionDescriptionHandlerObserver;
        this.session = session;
        this.options = options;
    }
    SessionDescriptionHandlerObserver.prototype.trackAdded = function () {
        this.session.emit("trackAdded");
    };
    SessionDescriptionHandlerObserver.prototype.directionChanged = function () {
        this.session.emit("directionChanged");
    };
    return SessionDescriptionHandlerObserver;
}());
export { SessionDescriptionHandlerObserver };
