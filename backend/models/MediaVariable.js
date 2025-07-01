export default (sequelize, DataTypes) => {
    const MediaVariable = sequelize.define('MediaVariable', {
      name: DataTypes.STRING,
      value: DataTypes.DECIMAL(10, 2)
    });
  
    MediaVariable.associate = (models) => {
      MediaVariable.belongsTo(models.MediaRecord, { foreignKey: 'media_record_id' });
    };
  
    return MediaVariable;
  };
  