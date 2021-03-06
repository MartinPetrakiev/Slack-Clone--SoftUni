import { AddBox } from '@material-ui/icons';
import React, { useReducer, useState } from 'react';
import { Button, Form, Header, Modal } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { CREATE_CHANNEL_MUTATION } from '../graphql/mutations';
import { ALL_CHANNELS_QUERY } from '../graphql/quereis';
import reducer from './modalReducer';

function AddChannelModal({ teamId, admin, refetch }) {
    const [state, dispatch] = useReducer(reducer, {
        open: false
    });
    const [errorsState, setErrors] = useState({});
    const [createChannel] = useMutation(CREATE_CHANNEL_MUTATION);
    const addChannel = async (e) => {
        e.preventDefault();
        const name = e.target.channelName.value;
        const topic = e.target.topic.value;
        let res;
        try {
            res = await createChannel({
                variables: {
                    teamId: Number(teamId),
                    name,
                    topic,
                    admin
                },
                refetchQueries: [{
                    query: ALL_CHANNELS_QUERY,
                    variables: { teamId: Number(teamId) },
                    fetchPolicy: 'network-only'
                }]
            });
        } catch (error) {
            console.log(error);
            return;
        }
        const { ok, errors } = res.data.createChannel;
        if (ok) {
            console.log('channel added');
            dispatch({ type: 'CLOSE_MODAL' });
            refetch();
        } else {
            console.log(errors);
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            setErrors((oldState) => ({ ...oldState, ...err }));
        }
    };

    const errorList = [];

    if (errorsState.nameError) {
        errorList.push(errorsState.nameError);
    }
    return (
        <Modal
            as={Form}
            open={state.open}
            onOpen={() => dispatch({ type: 'OPEN_MODAL' })}
            onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
            trigger={<span><AddBox />Add channel</span>}
            onSubmit={e => addChannel(e)}
            size="tiny"
        >
            <Header icon="pencil" content="Create a channel" as="h2" />
            <Modal.Content>
                <Form.Input required={true} label="Name" type="text" placeholder="# e.g. budget-talks ..." name="channelName" />
                <Form.Input label="Topic" type="text" placeholder="anything useful ..." name="topic" />
            </Modal.Content>
            {!!errorList.length &&
                (<p style={{ paddingLeft: '20px', color: 'red' }}>
                    { errorList[0]}
                </p>)}
            <Modal.Actions>
                <Button type="button" onClick={() => dispatch({ type: 'CLOSE_MODAL' })} color="red" icon="times" content="Close" />
                <Button type="submit" color="green" icon="add" content="Add" value="add" />
            </Modal.Actions>
        </Modal>
    );
}

export default AddChannelModal;
