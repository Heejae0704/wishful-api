require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'localhost',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/wishful',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgressql://postgres@localhost/wishful_test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}