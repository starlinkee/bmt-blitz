export default (sequelize, DataTypes) => {
    const MediaAttachment = sequelize.define('MediaAttachment', {
      file_path: DataTypes.STRING,
      original_name: DataTypes.STRING,
      uploaded_at: DataTypes.DATE
    });
  
    MediaAttachment.associate = (models) => {
      MediaAttachment.belongsTo(models.MediaRecord, { foreignKey: 'media_record_id' });
    };
  
    return MediaAttachment;
  };
  