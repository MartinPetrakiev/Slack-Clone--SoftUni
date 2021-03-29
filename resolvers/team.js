import formatErrors from '../formatErrors';
import requiresAuth from '../permissions';

export default {
    Query: {
        allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
            models.team.findAll({ where: { owner: 1 } }, { raw: true })),
        getTeam: requiresAuth.createResolver(async (parent, { teamKey }, { models }) =>
            models.team.findOne({ where: { teamKey: teamKey } }, { raw: true })),
    },
    Mutation: {
        addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, { models, user }) => {
            try {
                const teamPromise = models.team.findOne({ where: { id: teamId } }, { raw: true });
                const userToAddPromise = models.user.findOne({ where: { email } }, { raw: true });
                const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
                if (team.owner !== 1) {
                    return {
                        ok: false,
                        errors: [{ path: 'email', message: 'You cannot add members to the team' }],
                    };
                }
                if (!userToAdd) {
                    return {
                        ok: false,
                        errors: [{ path: 'email', message: 'Could not find user with this email' }],
                    };
                }
                await models.member.create({ id: Math.round(Math.random() * 10), userId: userToAdd.id, teamId });
                return {
                    ok: true,
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        }),
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const team = await models.team.create({ ...args, owner: user.id });
                await models.channel.create({ name: 'General', public: true, teamId: team.id });
                return {
                    ok: true
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err)
                };
            }
        }),
    },
    Team: {
        channels: ({ id }, args, { models }) => models.channel.findAll({ where: { teamId: id } }),
    }
};