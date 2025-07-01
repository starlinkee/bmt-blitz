export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('media_records', 'media_template_id', {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1, // Tymczasowa wartość domyślna
    references: {
      model: 'media_templates',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('media_records', 'media_template_id');
} 