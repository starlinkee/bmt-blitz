export default (sequelize, DataTypes) => {
    const ClientMediaTemplate = sequelize.define('ClientMediaTemplate', {
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'client_media_templates',
      underscored: true,
      timestamps: false
    });
  
    ClientMediaTemplate.associate = (models) => {
      ClientMediaTemplate.belongsTo(models.Client, {
        foreignKey: 'client_id',
        onDelete: 'CASCADE'
      });
      ClientMediaTemplate.belongsTo(models.MediaTemplate, {
        foreignKey: 'media_template_id',
        onDelete: 'CASCADE'
      });
    };
  
    return ClientMediaTemplate;
  };