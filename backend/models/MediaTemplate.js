export default (sequelize, DataTypes) => {
    const MediaTemplate = sequelize.define('MediaTemplate', {
      media_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      formula: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      variables_json: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '[]'
      }
    }, {
      tableName: 'media_templates',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  
    MediaTemplate.associate = (models) => {
      MediaTemplate.belongsTo(models.MediaType, { foreignKey: 'media_type_id' });
    };
  
    return MediaTemplate;
  };
  