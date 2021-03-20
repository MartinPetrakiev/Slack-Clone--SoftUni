import React, { useState } from 'react';
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { Button, Container, Form, Header, Message } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

const CREAT_TEAM_MUTATION = gql`
    mutation($name:String!) {
        createTeam( name: $name){
          ok
          errors {
            path
            message
          }
        }
      }
`;

const CreateTeam = observer((props) => {
    const [createTeam] = useMutation(CREAT_TEAM_MUTATION);
    const [formState] = useState(() =>
        observable({
            name: '',
            nameError: '',
            otherError: '',
        })
    );

    const onSubmit = async (e) => {
        //clear errors form state
        (action(state => {
            state.nameError = '';
        }))(formState);
        let res;
        const { name } = { ...formState };
        try {
            res = await createTeam({
                variables: { name }
            });
        } catch (error) {
            console.log(error);
            props.history.push('/login');
            return;
        }

        const { ok, errors } = res.data.createTeam;
        if (ok) {
            props.history.push('/');
        } else {
            //add errors to state
            (action(state => {
                errors.forEach(({ path, message }) => {
                    state[`${path}Error`] = message;
                });
            }))(formState);
        }
        console.log(res);
    };

    const handleChange = action((e, state) => {
        const { name, value } = e.target;
        state[name] = value;
    });

    const { name } = formState;
    const errorList = [];

    if (formState.nameError) {
        errorList.push(formState.nameError);
    }
    if (formState.otherError) {
        errorList.push(formState.otherError);
    }

    return (
        <Container text>
            <Header as='h2'>Create Team</Header>
            <Form error={!!errorList.length}>
                <Form.Field>
                    <Form.Input error={!!formState.nameError} fluid label='Team Name' placeholder='Name...' name="name" value={name} onChange={(e) => handleChange(e, formState)} />
                </Form.Field>
                <Message
                    error
                    list={errorList}
                />
                <Button onClick={onSubmit}>Submit</Button>
            </Form>
        </Container>
    );
});

export default CreateTeam;
