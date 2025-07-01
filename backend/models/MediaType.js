export default (sequelize, DataTypes) => {
    const MediaType = sequelize.define('MediaType', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    });
  
    MediaType.associate = (models) => {
      MediaType.hasMany(models.MediaTemplate, { foreignKey: 'media_type_id' });
      MediaType.hasMany(models.MediaRecord, { foreignKey: 'media_type_id' });
    };
  
    return MediaType;
  };
  