import Sequelize from 'sequelize';

const development = new Sequelize('flipkart', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres'
});

export {
  development
}