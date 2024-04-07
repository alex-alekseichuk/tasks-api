import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Tasks API',
            version: '1.0.0',
            description: 'Test API',
        },
    },
    apis: ['**/*.ts'], // Specify the path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
