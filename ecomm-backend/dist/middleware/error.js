export const errorMidleware = (err, req, res, next) => {
    res.status(err.statusCode || 400).json({
        error: err.message || "An error occurred",
        success: false,
    });
};
export const TryCatch = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
