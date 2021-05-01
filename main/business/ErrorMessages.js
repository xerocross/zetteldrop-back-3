class ErrorMessages {
    static unknown = "An unknown exception occurred."
    static OUT_OF_ORDER_EXCEPTION = "Out of order exception. This usually means the app did not initialize in the expected order. Something was falsy that definitely should have been initialized by the time a given function was called"
    static COULD_NOT_CREATE_ZETTEL = "Could not create zettel."
}
exports.ErrorMessages = ErrorMessages