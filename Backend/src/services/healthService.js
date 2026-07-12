

export const getHealth=()=>{
    return {
        status:"UP",
        service:"LibraAI Backend",
        version:"1.0.0",
        uptime:process.uptime(),
        timestamp:new Date().toISOString(),
        environment:process.env.NODE_ENV || "developement"
    }
}