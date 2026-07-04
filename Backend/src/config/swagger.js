import swaggerJsdoc from "swagger-jsdoc";

const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "LibraAI API",

            version: "1.0.0",

            description:
                "AI Powered Smart Library Management System"

        },

        servers: [

            {

                url: "http://localhost:5000"

            }

        ],

        components: {

            securitySchemes: {

                bearerAuth: {

                    type: "http",

                    scheme: "bearer",

                    bearerFormat: "JWT"

                }

            }

        }

    },

    apis: [

        "./src/routes/**/*.js"

    ]

};

const specs = swaggerJsdoc(

    options

);

export default specs;