export default (sequelize, DataTypes) => {
    const MediaRecord = sequelize.define('MediaRecord', {
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      media_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      media_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    }, {
      underscored: true,
      timestamps: false
    });
  
    MediaRecord.associate = (models) => {
      MediaRecord.belongsTo(models.Client, { foreignKey: 'client_id' });
      MediaRecord.belongsTo(models.MediaType, { foreignKey: 'media_type_id' });
      MediaRecord.belongsTo(models.MediaTemplate, { foreignKey: 'media_template_id' });
      MediaRecord.hasMany(models.MediaVariable, { foreignKey: 'media_record_id' });
      MediaRecord.hasMany(models.MediaAttachment, { foreignKey: 'media_record_id' });
    };
  
    return MediaRecord;
  };
  