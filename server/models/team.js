import { DataTypes } from 'sequelize';

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
export function Team(sequelize) {
    const Team = sequelize.define('team', {
        teamKey: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
    });
    return Team;
};