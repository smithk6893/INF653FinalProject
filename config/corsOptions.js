// Cross Origin Resource Sharing
const whitelist = ['https://dot-marked-action.glitch.me', 'http://localhost:3000', 'https://dazzling-snickerdoodle-777101.netlify.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;