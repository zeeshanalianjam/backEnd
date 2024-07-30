const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((Error) => next(Error))
    }
}


export { asyncHandler}



// heigh order functin beacuse its accept a outer functon as parameter
const asyncHandlerSecondWay = (myFunc) => async (req, res, next) => {
    try {
        await myFunc(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}