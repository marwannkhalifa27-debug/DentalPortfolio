

export const logger = (req,res,next) => {
    console.log(`
        Method: ${req.method} 
        URL: ${req.originalUrl} 
        Requested on: ${new Date(Date.now())}
        `)
    next()
}