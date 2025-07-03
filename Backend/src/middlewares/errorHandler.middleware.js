const errorHandler = (error, req, res, next) =>{
return res
.status(error.statusCode || 500)
.json({
    success:error.success || false,
    message:error.message || "Internal Server Error",
    errors:error.errors || [],
    stack:error.stack || "",
    data:error.data || null
})
}

export {errorHandler};