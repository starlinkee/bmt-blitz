export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('media_batches', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    month: {
      type: Sequelize.STRING(7),
      allowNull: false,
      unique: true
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('media_batches');
} 