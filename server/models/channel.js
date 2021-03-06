import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export function Channel(sequelize) {
    const Channel = sequelize.define('channel', {
        channelKey: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
        },
        name: {
            type: DataTypes.STRING,
        },
        topic: {
            type: DataTypes.STRING,
        },
        public: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    });
    return Channel;
};