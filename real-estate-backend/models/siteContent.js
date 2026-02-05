'use strict';

module.exports = (sequelize, DataTypes) => {
    const SiteContent = sequelize.define(
        'SiteContent',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                comment: 'Unique key for content (e.g., hero_images, about_content)'
            },
            value: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
                comment: 'JSON string containing the content data'
            },
            contentType: {
                type: DataTypes.ENUM('json', 'text', 'html', 'image'),
                defaultValue: 'json',
                comment: 'Type of content stored'
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'User ID who last updated this content'
            }
        },
        {
            tableName: 'site_content',
            freezeTableName: true,
            timestamps: true,
        }
    );

    return SiteContent;
};
