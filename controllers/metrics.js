const client = require("prom-client");

//Global Registry
const register = new client.Registry()

//Collect  CPU, Memory, Event Loop, Lag
client.collectDefaultMetrics({register})

//Counter
const httpsRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
})

//Metric Export
module.exports.httpRequestCounter = httpsRequestCounter;

//Roll Custom Metrics
register.registerMetric(httpsRequestCounter)

//Fetch Metrics
const getMetrics = async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports.getMetrics = getMetrics