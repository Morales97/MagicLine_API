module.exports = {
    "port": 3000,
    // "appEndpoint": "http://localhost:3600",
    // "apiEndpoint": "http://localhost:3600",
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    // "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    },
    "tramStates": {
        "OPEN": "Obert",
        "ESCOMBRANT": "Escombrant",
        "CLOSED": "Tancat",
    },
    "incidentGravity": {
        "LLEU": "Lleu",
        "GREU": "Greu",
        "MOLT_GREU": "Molt greu"
    }
};